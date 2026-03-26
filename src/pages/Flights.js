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

  const [passengers, setPassengers] = useState([
    { name: '', age: '', gender: '' }
  ]);

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
    setSelectedFlight(flight);
    setPassengers([{ name: '', age: '', gender: '' }]);
  };

  const addPassenger = () => {
    setPassengers(prev => [...prev, { name: '', age: '', gender: '' }]);
  };

  const removePassenger = (index) => {
    setPassengers(prev => prev.filter((_, i) => i !== index));
  };

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const handleBooking = async () => {
    try {
      // ✅ validation
      for (let p of passengers) {
        if (!p.name || !p.age || !p.gender) {
          showAlert('Fill all passenger details', 'warning');
          return;
        }
      }

      const cleanPassengers = passengers.map(p => ({
        name: p.name.trim(),
        age: Number(p.age),
        gender: p.gender
      }));

      await API.post('/bookings', {
        flightId: selectedFlight._id,
        date,
        passengers: cleanPassengers
      });

      showAlert('Booking successful', 'success');

      setSelectedFlight(null);
      setPassengers([{ name: '', age: '', gender: '' }]);

      await searchFlights();

    } catch (err) {
      console.log(err.response?.data);
      showAlert(err.response?.data?.message || 'Booking failed', 'danger');
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
            className="bg-blue-600 text-white px-4 py-2 w-full sm:w-auto rounded"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>

        </div>
      </div>

      {searched && flights.length===0 && (
        <p className="text-center text-gray-500">No flights available</p>
      )}

      {/* FLIGHTS */}
      <div className="grid gap-4 md:grid-cols-2">
        {flights.map(f=>(
          <div key={f._id} className="bg-white p-4 shadow rounded border">

            <h3 className="font-bold text-blue-600">{f.flightNumber}</h3>
            <p>{f.from} → {f.to}</p>

            <button
              onClick={()=>bookFlight(f)}
              className="bg-green-600 text-white px-3 py-1 mt-2 w-full rounded"
            >
              Book Now
            </button>

          </div>
        ))}
      </div>

      {/* BOOKING MODAL */}
      {selectedFlight && (
        <div className="bg-black/50 fixed inset-0 flex justify-center items-center z-50">

          <div className="bg-white p-5 rounded w-full max-w-md relative">

            <FaTimes
              className="absolute top-2 right-2 cursor-pointer text-red-500"
              onClick={()=>setSelectedFlight(null)}
            />

            {passengers.map((p,i)=>(
              <div key={i} className="mb-3">

                <input
                  placeholder="Name"
                  className="border p-2 w-full mb-1 rounded"
                  onChange={(e)=>handlePassengerChange(i,'name',e.target.value)}
                />

                <input
                  type="number"
                  placeholder="Age"
                  className="border p-2 w-full mb-1 rounded"
                  onChange={(e)=>handlePassengerChange(i,'age',e.target.value)}
                />

                <select
                  className="border p-2 w-full rounded"
                  onChange={(e)=>handlePassengerChange(i,'gender',e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>

                {passengers.length > 1 && (
                  <button
                    onClick={()=>removePassenger(i)}
                    className="bg-red-500 text-white px-2 py-1 mt-1 rounded"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={addPassenger}
              className="bg-blue-500 text-white w-full py-1 rounded"
            >
              Add Passenger
            </button>

            <button
              onClick={handleBooking}
              className="bg-green-600 text-white w-full mt-3 py-2 rounded"
            >
              Book Now
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default Flights;