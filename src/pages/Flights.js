import { useState, useEffect } from 'react';
import API from '../services/api';

const Flights = ({ showAlert }) => {

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');

  const [flights, setFlights] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  const [paymentLoading, setPaymentLoading] = useState(false);

  const [passengers, setPassengers] = useState([
    { name: '', age: '', gender: '' }
  ]);

  // AIRPORTS
  const [airports, setAirports] = useState([]);
  const [filteredAirports, setFilteredAirports] = useState([]);
  const [activeField, setActiveField] = useState(null);

  useEffect(() => {
    const fetchAirports = async () => {
      const res = await API.get('/airports');
      setAirports(res.data);
    };
    fetchAirports();
  }, []);

  const today = new Date();
  const maxDate = new Date();
  maxDate.setMonth(today.getMonth() + 2);

  const formatDate = (d) => d.toISOString().split('T')[0];

  // AUTOCOMPLETE
  const handleSearchInput = (value, field) => {
    field === 'from' ? setFrom(value) : setTo(value);
    setActiveField(field);

    const filtered = airports.filter(a =>
      a.city.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredAirports(filtered);
  };

  // SEARCH
  const searchFlights = async () => {
    if (!from || !to || !date) {
      showAlert('Please enter all fields', 'warning');
      return;
    }

    try {
      setLoading(true);

      const res = await API.get(
        `/flights?from=${from}&to=${to}&date=${date}`
      );

      setFlights(res.data.flights);
      setSearched(true);

    } catch {
      showAlert('Error fetching flights', 'danger');
    } finally {
      setLoading(false);
    }
  };

  // BOOK
  const bookFlight = (flight) => {
    if (flight.seatsAvailable === 0) {
      showAlert('No seats available', 'danger');
      return;
    }

    setSelectedFlight(flight);
    setPassengers([{ name: '', age: '', gender: '' }]);
  };

  // PASSENGERS
  const addPassenger = () => {
    setPassengers([...passengers, { name: '', age: '', gender: '' }]);
  };

  const removePassenger = (index) => {
    setPassengers(passengers.filter((_, i) => i !== index));
  };

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  // STEP 1 → VALIDATE → PAYMENT
  const proceedToPayment = () => {
    for (let p of passengers) {
      if (!p.name || !p.age || !p.gender) {
        showAlert('Fill all passenger details', 'warning');
        return;
      }
    }

    setShowPayment(true);
  };

  // STEP 2 → PAYMENT → BOOKING
  const handlePayment = async () => {
    setPaymentLoading(true);

    setTimeout(async () => {
      try {
        await API.post('/bookings', {
          flightId: selectedFlight._id,
          date,
          passengers
        });

        showAlert('Booking successful', 'success');

        setShowPayment(false);
        setSelectedFlight(null);
        searchFlights();

      } catch (err) {
        showAlert(err.response?.data?.message || 'Error', 'danger');
      } finally {
        setPaymentLoading(false);
      }
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">

      {/* SEARCH */}
      <div className="bg-white p-6 rounded shadow mb-6">

        <h2 className="text-xl font-bold mb-3">Search Flights</h2>

        <div className="flex gap-4 flex-wrap">

          {/* FROM */}
          <div className="relative">
            <input
              value={from}
              onChange={(e) => handleSearchInput(e.target.value, 'from')}
              onFocus={() => setActiveField('from')}
              placeholder="From"
              className="border p-2 rounded"
            />

            {activeField === 'from' && filteredAirports.length > 0 && (
              <div className="absolute bg-white border w-full max-h-40 overflow-y-auto z-10">
                {filteredAirports.map((a, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setFrom(a.city);
                      setFilteredAirports([]);
                      setActiveField(null);
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
              className="border p-2 rounded"
            />

            {activeField === 'to' && filteredAirports.length > 0 && (
              <div className="absolute bg-white border w-full max-h-40 overflow-y-auto z-10">
                {filteredAirports.map((a, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setTo(a.city);
                      setFilteredAirports([]);
                      setActiveField(null);
                    }}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                  >
                    {a.city}
                  </div>
                ))}
              </div>
            )}
          </div>

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
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Search
          </button>

        </div>
      </div>

      {/* STATES */}
      {loading && <p className="text-center">Searching...</p>}

      {searched && flights.length === 0 && (
        <p className="text-center text-gray-500">
          No flights available
        </p>
      )}

      {/* FLIGHTS */}
      <div className="grid gap-4 md:grid-cols-2">
        {flights.map((f) => (
          <div key={f._id} className="bg-white p-4 rounded shadow">

            <h3 className="text-lg font-bold text-blue-600">
              {f.flightNumber}
            </h3>

            <p>{f.from} → {f.to}</p>
            <p>Seats Left: {f.seatsAvailable}</p>
            <p className="font-bold">₹ {f.price}</p>

            <button
              disabled={f.seatsAvailable === 0}
              onClick={() => bookFlight(f)}
              className="bg-green-600 text-white px-3 py-1 rounded mt-2"
            >
              {f.seatsAvailable === 0 ? 'Sold Out' : 'Book Now'}
            </button>

          </div>
        ))}
      </div>

      {/* BOOKING MODAL */}
      {selectedFlight && (
        <div
          onClick={() => setSelectedFlight(null)}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 rounded w-[400px]"
          >
            <h2 className="font-bold mb-3">{selectedFlight.flightNumber}</h2>

            {passengers.map((p, i) => (
              <div key={i} className="mb-3">

                <input
                  placeholder="Name"
                  className="border p-2 w-full mb-1"
                  onChange={(e) => handlePassengerChange(i, 'name', e.target.value)}
                />

                <input
                  placeholder="Age"
                  className="border p-2 w-full mb-1"
                  onChange={(e) => handlePassengerChange(i, 'age', e.target.value)}
                />

                <select
                  className="border p-2 w-full"
                  onChange={(e) => handlePassengerChange(i, 'gender', e.target.value)}
                >
                  <option value="">Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>

                {passengers.length > 1 && (
                  <button onClick={() => removePassenger(i)} className="text-red-500 text-sm">
                    Remove
                  </button>
                )}

              </div>
            ))}

            <button onClick={addPassenger} className="bg-blue-500 text-white px-3 py-1 rounded">
              + Add Passenger
            </button>

            <p className="font-bold mt-3">
              Total: ₹ {selectedFlight.price * passengers.length}
            </p>

            <button
              onClick={proceedToPayment}
              className="bg-green-600 text-white px-4 py-2 mt-3 rounded w-full"
            >
              Proceed to Pay
            </button>
          </div>
        </div>
      )}

      {/* PAYMENT */}
      {showPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">

          <div className="bg-white p-6 rounded w-[350px]">

            <h2 className="text-lg font-bold mb-3">Payment</h2>

            <p>Total: ₹ {selectedFlight.price * passengers.length}</p>

            <input placeholder="Card Number" className="border p-2 w-full my-2" />
            <input placeholder="MM/YY" className="border p-2 w-full my-2" />
            <input placeholder="CVV" className="border p-2 w-full my-2" />

            <button
              onClick={handlePayment}
              className="bg-green-600 text-white w-full py-2 mt-3"
            >
              {paymentLoading ? 'Processing...' : 'Pay Now'}
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default Flights;