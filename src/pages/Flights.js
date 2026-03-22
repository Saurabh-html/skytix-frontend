import { useState } from 'react';
import API from '../services/api';

const Flights = ({ showAlert }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [flights, setFlights] = useState([]);
  const [searched, setSearched] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);

  //  NEW: passengers state
  const [passengers, setPassengers] = useState([
    { name: '', age: '', gender: '' }
  ]);

  //  SEARCH
  const searchFlights = async () => {
    if (!from || !to || !date) {
      showAlert('Please enter all fields', 'warning');
      return;
    }

    try {
      const res = await API.get(
        `/flights?from=${from}&to=${to}&date=${date}`
      );

      setFlights(res.data.flights);
      setSearched(true);
    } catch (err) {
      showAlert('Error fetching flights', 'danger');
    }
  };

  //  OPEN MODAL
  const bookFlight = (flight) => {
    setSelectedFlight(flight);
    setPassengers([{ name: '', age: '', gender: '' }]); // reset
  };

  //  ADD PASSENGER
  const addPassenger = () => {
    setPassengers([...passengers, { name: '', age: '', gender: '' }]);
  };

  //  REMOVE PASSENGER
  const removePassenger = (index) => {
    const updated = passengers.filter((_, i) => i !== index);
    setPassengers(updated);
  };

  //  HANDLE INPUT CHANGE
  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  // CONFIRM BOOKING
  const confirmBooking = async () => {
    // validation
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
      showAlert(
        err.response?.data?.message || 'Error booking ticket',
        'danger'
      );
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">

      {/*  SEARCH */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">
          Search Flights
        </h2>

        <div className="flex gap-4 flex-wrap">
          <input
            type="text"
            placeholder="From"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border p-2 rounded w-full sm:w-[200px]"
          />

          <input
            type="text"
            placeholder="To"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="border p-2 rounded w-full sm:w-[200px]"
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded w-full sm:w-[200px]"
          />

          <button
            onClick={searchFlights}
            className="bg-blue-600 text-white px-5 py-2 rounded"
          >
            Search
          </button>
        </div>
      </div>

      {/*  NO FLIGHTS */}
      {searched && flights.length === 0 && (
        <p className="text-center text-gray-500">
          No flights available between these airports.
        </p>
      )}

      {/* \ FLIGHTS */}
      <div className="grid gap-4 md:grid-cols-2">
        {flights.map((f) => (
          <div key={f._id} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-blue-600">
              {f.flightNumber}
            </h3>

            <p>{f.from} → {f.to}</p>

            <p className="text-sm text-gray-500">
              Selected Date: {date}
            </p>

            <p className="text-sm text-gray-500">
                Seats Available: {f.seatsAvailable}
              </p>

            <p className="font-bold">₹ {f.price}</p>

            <button
            disabled={f.seatsAvailable === 0}
            onClick={() => bookFlight(f)}
            className={`mt-3 px-4 py-2 rounded text-white ${
              f.seatsAvailable === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {f.seatsAvailable === 0 ? 'Sold Out' : 'Book Now'}
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

            {/*  PASSENGERS */}
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

                <input
                  placeholder="Gender"
                  value={p.gender}
                  onChange={(e) =>
                    handlePassengerChange(index, 'gender', e.target.value)
                  }
                  className="border p-2 w-full mb-2"
                />

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

            {/*  ADD */}
            <button
              onClick={addPassenger}
              className="bg-blue-500 text-white px-3 py-1 rounded mb-3"
            >
              + Add Passenger
            </button>

            {/*  TOTAL */}
            <p className="font-bold mb-3">
              Total: ₹ {selectedFlight.price * passengers.length}
            </p>

            {/* ACTIONS */}
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