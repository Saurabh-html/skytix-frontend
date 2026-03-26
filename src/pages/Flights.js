import { useState, useEffect } from 'react';
import API from '../services/api';
import { FaTimes } from 'react-icons/fa';

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

  const [seatClass, setSeatClass] = useState('economy');

  const [passengers, setPassengers] = useState([
    { name: '', age: '', gender: '', seat: '' }
  ]);

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [activePassengerIndex, setActivePassengerIndex] = useState(0);

  const [airports, setAirports] = useState([]);
  const [filteredAirports, setFilteredAirports] = useState([]);
  const [activeField, setActiveField] = useState(null);

  const safeError = () => 'Unable to process request. Please try again.';

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const res = await API.get('/airports');
        setAirports(res.data || []);
      } catch {}
    };
    fetchAirports();
  }, []);

  const handleSearchInput = (value, field) => {
    if (field === 'from') setFrom(value);
    else setTo(value);

    setActiveField(field);

    if (!value) {
      setFilteredAirports([]);
      return;
    }

    const filtered = airports.filter(a =>
      a.city.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredAirports(filtered);
  };

  const today = new Date();
  const maxDate = new Date();
  maxDate.setMonth(today.getMonth() + 2);

  const formatDate = (d) => d.toISOString().split('T')[0];

  const searchFlights = async () => {
    if (!from || !to || !date) {
      showAlert('Please enter all fields', 'warning');
      return;
    }

    try {
      setLoading(true);

      const res = await API.get(`/flights?from=${from}&to=${to}&date=${date}`);
      setFlights(res.data.flights || []);
      setSearched(true);

    } catch {
      showAlert(safeError(), 'danger');
    } finally {
      setLoading(false);
    }
  };

  const bookFlight = (flight) => {
    const seats = flight.seatsAvailable?.[seatClass] ?? flight.seatsAvailable;

    if (!seats || seats === 0) {
      showAlert(`No ${seatClass} seats available`, 'danger');
      return;
    }

    setSelectedFlight(flight);
    setPassengers([{ name: '', age: '', gender: '', seat: '' }]);
    setSelectedSeats([]);
    setActivePassengerIndex(0);
    setShowPayment(false);
  };

  const addPassenger = () => {
    setPassengers(prev => [...prev, { name: '', age: '', gender: '', seat: '' }]);
  };

  const removePassenger = (index) => {
    const updatedPassengers = [...passengers];
    const removedSeat = updatedPassengers[index].seat;

    const newPassengers = updatedPassengers.filter((_, i) => i !== index);
    setPassengers(newPassengers);

    if (removedSeat) {
      setSelectedSeats(prev => prev.filter(s => s !== removedSeat));
    }

    if (activePassengerIndex >= newPassengers.length) {
      setActivePassengerIndex(0);
    }
  };

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const generateSeats = () => {
    const rows = 5;
    const cols = ['A', 'B', 'C', 'D'];
    let seats = [];

    for (let i = 1; i <= rows; i++) {
      cols.forEach(c => seats.push(`${c}${i}`));
    }

    return seats;
  };

  const allSeats = generateSeats();

  const selectSeat = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(prev => prev.filter(s => s !== seat));

      const updated = passengers.map(p =>
        p.seat === seat ? { ...p, seat: '' } : p
      );

      setPassengers(updated);
      return;
    }

    if (selectedSeats.length >= passengers.length) {
      showAlert('Only 1 seat per passenger', 'warning');
      return;
    }

    const updated = [...passengers];
    const oldSeat = updated[activePassengerIndex].seat;

    if (oldSeat) {
      setSelectedSeats(prev => prev.filter(s => s !== oldSeat));
    }

    updated[activePassengerIndex].seat = seat;

    setPassengers(updated);
    setSelectedSeats(prev => [...prev, seat]);
  };

  const proceedToPayment = () => {
    for (let p of passengers) {
      if (!p.name || !p.age || !p.gender || !p.seat) {
        showAlert('Fill all passenger & seat details', 'warning');
        return;
      }
    }
    setShowPayment(true);
  };

const handlePayment = async () => {
  try {
    setPaymentLoading(true);

    await new Promise(res => setTimeout(res, 800));

    // KEEP seat (IMPORTANT)
    const cleanPassengers = passengers.map(p => ({
      name: p.name?.trim(),
      age: Number(p.age),
      gender: p.gender,
      seat: p.seat
    }));

    // STRICT VALIDATION (MATCH BACKEND)
    for (let p of cleanPassengers) {
      if (!p.name || !p.age || !p.gender || !p.seat) {
        showAlert('Invalid passenger details', 'danger');
        return;
      }
    }

    console.log("SENDING:", cleanPassengers); // debug

    await API.post('/bookings', {
      flightId: selectedFlight._id,
      date,
      passengers: cleanPassengers,
      seatClass
    });

    showAlert('Booking successful', 'success');

    setShowPayment(false);
    setSelectedFlight(null);
    setPassengers([{ name: '', age: '', gender: '', seat: '' }]);
    setSelectedSeats([]);

    await searchFlights();

  } catch (err) {
    console.log("ERROR:", err.response?.data);
    showAlert(err.response?.data?.message || 'Booking failed', 'danger');
  } finally {
    setPaymentLoading(false);
  }
};

return (
  <div className="max-w-5xl mx-auto p-4 sm:p-6 bg-gray-100 text-gray-800 min-h-screen">

    {/* SEARCH */}
    <div className="bg-white p-4 rounded shadow mb-6 border">
      <div className="flex flex-col sm:flex-row gap-3">

        <div className="relative w-full">
          <input
            value={from}
            onChange={(e)=>handleSearchInput(e.target.value,'from')}
            onFocus={()=>setActiveField('from')}
            placeholder="From"
            className="border p-2 w-full rounded"
          />

          {activeField==='from' && filteredAirports.length>0 && (
            <div className="absolute bg-white border w-full max-h-40 overflow-y-auto z-10 rounded">
              {filteredAirports.map((a,i)=>(
                <div key={i}
                  onClick={()=>{
                    setFrom(a.city);
                    setFilteredAirports([]);
                    setActiveField(null);
                  }}
                  className="p-2 hover:bg-gray-200 cursor-pointer">
                  {a.city}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative w-full">
          <input
            value={to}
            onChange={(e)=>handleSearchInput(e.target.value,'to')}
            onFocus={()=>setActiveField('to')}
            placeholder="To"
            className="border p-2 w-full rounded"
          />

          {activeField==='to' && filteredAirports.length>0 && (
            <div className="absolute bg-white border w-full max-h-40 overflow-y-auto z-10 rounded">
              {filteredAirports.map((a,i)=>(
                <div key={i}
                  onClick={()=>{
                    setTo(a.city);
                    setFilteredAirports([]);
                    setActiveField(null);
                  }}
                  className="p-2 hover:bg-gray-200 cursor-pointer">
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
          onChange={(e)=>setDate(e.target.value)}
          className="border p-2 w-full rounded"
        />

        <button
          onClick={searchFlights}
          className="bg-blue-600 text-white px-4 py-2 w-full sm:w-auto rounded hover:bg-blue-700 transition"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>

      </div>
    </div>

    {loading && <p className="text-center text-gray-500">Searching...</p>}

    {searched && flights.length===0 && (
      <p className="text-center text-gray-500">No flights available</p>
    )}

    {/* FLIGHTS */}
    <div className="grid gap-4 md:grid-cols-2">
      {flights.map(f=>(
        <div key={f._id} className="bg-white p-4 shadow rounded border">

          <h3 className="font-bold text-blue-600">{f.flightNumber}</h3>
          <p className="text-gray-700">{f.from} → {f.to}</p>

          <p className="text-gray-600">
            E ₹{f.prices?.economy} | B ₹{f.prices?.business} | F ₹{f.prices?.first}
          </p>

          <button
            onClick={()=>bookFlight(f)}
            className="bg-green-600 text-white px-3 py-1 mt-2 w-full rounded hover:bg-green-700 transition"
          >
            Book Now
          </button>

        </div>
      ))}
    </div>

    {/* BOOKING MODAL */}
    {selectedFlight && (
      <div className="bg-black/50 fixed inset-0 flex justify-center items-center z-50">

        <div className="bg-white p-5 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto border">

          <div className="bg-white p-4 rounded w-full max-w-md relative border">

            <FaTimes
              className="absolute top-2 right-2 cursor-pointer text-red-500"
              onClick={()=>setSelectedFlight(null)}
            />

            <select
              value={seatClass}
              onChange={(e)=>setSeatClass(e.target.value)}
              className="border p-2 w-full mb-3 rounded"
            >
              <option value="economy">Economy</option>
              <option value="business">Business</option>
              <option value="first">First</option>
            </select>

            {passengers.map((p,i)=>(
              <div key={i}
                onClick={()=>setActivePassengerIndex(i)}
                className={`mb-3 border p-2 cursor-pointer rounded ${
                  activePassengerIndex===i?'border-blue-500':''}`}>

                <input className="border p-2 w-full mb-1 rounded"
                  placeholder="Name"
                  onChange={(e)=>handlePassengerChange(i,'name',e.target.value)}
                />

                <input type="number"
                  placeholder="Age"
                  className="border p-2 w-full mb-1 rounded"
                  onChange={(e)=>handlePassengerChange(i,'age',e.target.value)}
                />

                <select className="border p-2 w-full mb-2 rounded"
                  onChange={(e)=>handlePassengerChange(i,'gender',e.target.value)}>
                  <option>Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>

                <p className="text-gray-600">Seat: {p.seat || 'Not selected'}</p>

                {passengers.length>1 && (
                  <button
                    onClick={(e)=>{
                      e.stopPropagation();
                      removePassenger(i);
                    }}
                    className="bg-red-500 text-white px-2 py-1 rounded">
                    Remove
                  </button>
                )}
              </div>
            ))}

            <div className="grid grid-cols-4 gap-2 mb-3">
              {allSeats.map(s=>(
                <button key={s}
                  onClick={()=>selectSeat(s)}
                  className={`p-2 border rounded ${
                    selectedSeats.includes(s)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200'
                  }`}>
                  {s}
                </button>
              ))}
            </div>

            <button onClick={addPassenger}
              className="bg-blue-500 text-white w-full rounded py-1">
              Add Passenger
            </button>

            <button onClick={proceedToPayment}
              className="bg-green-600 text-white w-full mt-3 rounded py-1">
              Continue
            </button>

          </div>
        </div>
      </div>
    )}

    {/* PAYMENT */}
    {showPayment && (
      <div className="bg-black/50 fixed inset-0 flex justify-center items-center z-50">

        <div className="bg-white p-5 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto border">

          <div className="bg-white p-4 rounded w-full max-w-sm relative border">

            <FaTimes
              className="absolute top-2 right-2 cursor-pointer text-red-500"
              onClick={()=>setShowPayment(false)}
            />

            <h2 className="font-bold mb-3 text-gray-800">Payment</h2>

            <input placeholder="Card Number" className="border p-2 w-full mb-2 rounded"/>
            <input placeholder="Expiry" className="border p-2 w-full mb-2 rounded"/>
            <input placeholder="CVV" className="border p-2 w-full mb-2 rounded"/>

            <button
              onClick={handlePayment}
              disabled={paymentLoading}
              className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700 transition"
            >
              {paymentLoading ? 'Processing...' : 'Pay Now'}
            </button>

          </div>
        </div>
      </div>
    )}

  </div>
);
};

export default Flights;