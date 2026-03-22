import { useState, useEffect } from 'react';
import API from '../services/api';

const Flights = ({ showAlert }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [flights, setFlights] = useState([]);
  const [searched, setSearched] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);

  const [passengers, setPassengers] = useState([
    { name: '', age: '', gender: '' }
  ]);

  //  AIRPORT STATES
  const [airports, setAirports] = useState([]);
  const [filteredAirports, setFilteredAirports] = useState([]);
  const [activeField, setActiveField] = useState(null);

  //  LOAD AIRPORTS
  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const res = await API.get('/airports');
        setAirports(res.data);
      } catch {
        showAlert('Error loading airports', 'danger');
      }
    };

    fetchAirports();
    //eslint-disable-next-line
  }, []);

  //  DATE LIMIT
  const today = new Date();
  const maxDate = new Date();
  maxDate.setMonth(today.getMonth() + 2);

  const formatDate = (d) => d.toISOString().split('T')[0];

  // AUTOCOMPLETE HANDLER
  const handleSearchInput = (value, field) => {
    if (field === 'from') setFrom(value);
    else setTo(value);

    setActiveField(field);

    const filtered = airports.filter(a =>
      a.city.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredAirports(filtered);
  };

  //  SEARCH FLIGHTS
  const searchFlights = async () => {
    if (!from || !to || !date) {
      showAlert('Please enter all fields', 'warning');
      return;
    }

    if (from.toLowerCase() === to.toLowerCase()) {
      showAlert('From and To cannot be same', 'warning');
      return;
    }

    try {
      const formattedDate = new Date(date).toISOString();

      const res = await API.get(
        `/flights?from=${from}&to=${to}&date=${formattedDate}`
      );

      setFlights(res.data.flights);
      setSearched(true);

    } catch {
      showAlert('Error fetching flights', 'danger');
    }
  };

  //  OPEN MODAL
  const bookFlight = (flight) => {
    if (flight.seatsAvailable === 0) {
      showAlert('No seats available', 'danger');
      return;
    }

    setSelectedFlight(flight);
    setPassengers([{ name: '', age: '', gender: '' }]);
  };

  //  ADD PASSENGER
  const addPassenger = () => {
    setPassengers([...passengers, { name: '', age: '', gender: '' }]);
  };

  //  REMOVE PASSENGER
  const removePassenger = (index) => {
    setPassengers(passengers.filter((_, i) => i !== index));
  };

  //  UPDATE PASSENGER
  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  //  CONFIRM BOOKING
  const confirmBooking = async () => {
    if (!selectedFlight) return;

    if (passengers.length > selectedFlight.seatsAvailable) {
      showAlert('Not enough seats available', 'danger');
      return;
    }

    for (let p of passengers) {
      if (!p.name || !p.age || !p.gender) {
        showAlert('Fill all passenger details', 'warning');
        return;
      }
    }

    try {
      await API.post('/bookings', {
        flightId: selectedFlight._id,
        date,
        passengers
      });

      showAlert('Booking successful', 'success');
      setSelectedFlight(null);

    } catch (err) {
      showAlert(err.response?.data?.message || 'Error', 'danger');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">

      {/*  SEARCH */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-4">Search Flights</h2>

        <div className="flex gap-4 flex-wrap">

          {/* FROM */}
          <div className="relative">
            <input
              value={from}
              onChange={(e) => handleSearchInput(e.target.value, 'from')}
              onFocus={() => setActiveField('from')}
              placeholder="From"
              className="border p-2 rounded w-[200px]"
            />

            {activeField === 'from' && filteredAirports.length > 0 && (
              <div className="absolute bg-white border w-full max-h-40 overflow-y-auto z-10">
                {filteredAirports.map((a, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setFrom(a.city);
                      setFilteredAirports([]);
                    }}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                  >
                    {a.city}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* TO */}
          <div className="relative">
            <input
              value={to}
              onChange={(e) => handleSearchInput(e.target.value, 'to')}
              onFocus={() => setActiveField('to')}
              placeholder="To"
              className="border p-2 rounded w-[200px]"
            />

            {activeField === 'to' && filteredAirports.length > 0 && (
              <div className="absolute bg-white border w-full max-h-40 overflow-y-auto z-10">
                {filteredAirports.map((a, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setTo(a.city);
                      setFilteredAirports([]);
                    }}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                  >
                    {a.city}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* DATE */}
          <input
            type="date"
            value={date}
            min={formatDate(today)}
            max={formatDate(maxDate)}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded"
          />

          <button
            onClick={searchFlights}
            className="bg-blue-600 text-white px-5 py-2 rounded"
          >
            Search
          </button>

        </div>
      </div>

      {/* RESULTS */}
      {searched && flights.length === 0 && (
        <p className="text-center text-gray-500">
          No flights available
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {flights.map((f) => (
          <div key={f._id} className="bg-white p-4 rounded shadow">

            <h3 className="text-lg font-semibold text-blue-600">
              {f.flightNumber}
            </h3>

            <p>{f.from} → {f.to}</p>
            <p>Seats Available: {f.seatsAvailable}</p>
            <p className="font-bold">₹ {f.price}</p>

            <button
              disabled={f.seatsAvailable === 0}
              onClick={() => bookFlight(f)}
              className={`mt-2 px-3 py-1 rounded text-white ${
                f.seatsAvailable === 0
                  ? 'bg-gray-400'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {f.seatsAvailable === 0 ? 'Sold Out' : 'Book'}
            </button>

          </div>
        ))}
      </div>

      {/*  BOOKING MODAL */}
      {selectedFlight && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">

          <div className="bg-white p-6 rounded w-[500px] max-h-[90vh] overflow-y-auto">

            <h2 className="text-xl font-bold mb-4">
              Book Flight {selectedFlight.flightNumber}
            </h2>

            {passengers.map((p, index) => (
              <div key={index} className="border p-3 mb-3 rounded">

                <h3 className="font-semibold mb-2">
                  Passenger {index + 1}
                </h3>

                <input
                  placeholder="Name"
                  value={p.name}
                  onChange={(e) =>
                    handlePassengerChange(index, 'name', e.target.value)
                  }
                  className="border p-2 w-full mb-2"
                />

                <input
                  placeholder="Age"
                  value={p.age}
                  onChange={(e) =>
                    handlePassengerChange(index, 'age', e.target.value)
                  }
                  className="border p-2 w-full mb-2"
                />

                <select
                  value={p.gender}
                  onChange={(e) =>
                    handlePassengerChange(index, 'gender', e.target.value)
                  }
                  className="border p-2 w-full mb-2"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>

                {passengers.length > 1 && (
                  <button
                    onClick={() => removePassenger(index)}
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={addPassenger}
              className="bg-blue-500 text-white px-3 py-1 rounded mb-3"
            >
              + Add Passenger
            </button>

            <p className="font-bold mb-3">
              Total: ₹ {selectedFlight.price * passengers.length}
            </p>

            <button
              onClick={confirmBooking}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Confirm Booking
            </button>

            <button
              onClick={() => setSelectedFlight(null)}
              className="ml-3"
            >
              Cancel
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default Flights;