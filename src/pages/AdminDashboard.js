import { useEffect, useState } from 'react';
import API from '../services/api';

const AdminDashboard = ({ showAlert }) => {

  const user = JSON.parse(localStorage.getItem('user'));

  // ❗ ALWAYS KEEP HOOKS ABOVE RETURN
  const [flights, setFlights] = useState([]);
  const [form, setForm] = useState({
    flightNumber: '',
    from: '',
    to: '',
    departureTime: '',
    arrivalTime: '',
    price: '',
    seatsAvailable: '',
    scheduleType: 'daily',
    daysOfWeek: []
  });

  const [bulkForm, setBulkForm] = useState({
    baseFlightNumber: '',
    count: 1,
    from: '',
    to: '',
    departureTime: '',
    arrivalTime: '',
    price: '',
    seatsAvailable: '',
    scheduleType: 'daily',
    daysOfWeek: []
  });

// ✅ HOOKS FIRST (NO CONDITIONS ABOVE)
useEffect(() => {
  
  fetchFlights();
  //eslint-disable-next-line
}, []);

// ✅ NOW CONDITION
if (!user || user.role !== 'admin') {
  return <h2 className="text-center mt-10">Access Denied</h2>;
}

  // 🔄 FETCH FLIGHTS
  const fetchFlights = async () => {
    try {
      const res = await API.get('/flights');
      setFlights(res.data.flights);
    } catch {
      showAlert('Error fetching flights', 'danger');
    }
  };

  // 🔁 HANDLE CHANGE
  const handleChange = (e, isBulk = false) => {
    const { name, value } = e.target;

    if (isBulk) {
      setBulkForm({ ...bulkForm, [name]: value });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // ✅ HANDLE DAYS (WEEKLY)
  const toggleDay = (day, isBulk = false) => {
    const state = isBulk ? bulkForm : form;
    const setState = isBulk ? setBulkForm : setForm;

    const updatedDays = state.daysOfWeek.includes(day)
      ? state.daysOfWeek.filter(d => d !== day)
      : [...state.daysOfWeek, day];

    setState({ ...state, daysOfWeek: updatedDays });
  };

  // ✈️ CREATE SINGLE FLIGHT
  const createFlight = async () => {
    try {
      await API.post('/flights', form);
      showAlert('Flight created', 'success');
      fetchFlights();
    } catch (err) {
      showAlert('Error creating flight', 'danger');
    }
  };

  // 🚀 BULK CREATE
  const createBulk = async () => {
    try {
      await API.post('/flights/bulk', bulkForm);
      showAlert('Bulk flights created', 'success');
      fetchFlights();
    } catch {
      showAlert('Bulk creation failed', 'danger');
    }
  };

  // ❌ DELETE
  const deleteFlight = async (id) => {
    try {
      await API.delete(`/flights/${id}`);
      showAlert('Flight deleted', 'success');
      fetchFlights();
    } catch {
      showAlert('Delete failed', 'danger');
    }
  };

  // 📅 CANCEL DATE
  const cancelDate = async (id, date) => {
    if (!date) return showAlert('Select date', 'warning');

    try {
      await API.put(`/flights/${id}/cancel-date`, { date });
      showAlert('Cancelled for date', 'success');
    } catch {
      showAlert('Cancel failed', 'danger');
    }
  };

  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">

      <h2 className="text-3xl font-bold">Admin Dashboard</h2>

      {/* ✈️ ADD FLIGHT */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-4">Add Flight</h3>

        <div className="grid grid-cols-2 gap-4">

          <input name="flightNumber" placeholder="Flight No" onChange={handleChange} className="border p-2 rounded" />
          <input name="from" placeholder="From" onChange={handleChange} className="border p-2 rounded" />

          <input name="to" placeholder="To" onChange={handleChange} className="border p-2 rounded" />
          <input name="departureTime" placeholder="Departure (HH:mm)" onChange={handleChange} className="border p-2 rounded" />

          <input name="arrivalTime" placeholder="Arrival (HH:mm)" onChange={handleChange} className="border p-2 rounded" />
          <input name="price" placeholder="Price" onChange={handleChange} className="border p-2 rounded" />

          <input name="seatsAvailable" placeholder="Seats" onChange={handleChange} className="border p-2 rounded" />

          {/* SCHEDULE TYPE */}
          <select name="scheduleType" onChange={handleChange} className="border p-2 rounded">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>

        </div>

        {/* WEEK DAYS */}
        {form.scheduleType === 'weekly' && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {days.map((d, i) => (
              <button
                key={i}
                onClick={() => toggleDay(i)}
                className={`px-3 py-1 rounded ${
                  form.daysOfWeek.includes(i)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={createFlight}
          className="mt-4 bg-green-600 text-white px-5 py-2 rounded"
        >
          Add Flight
        </button>
      </div>

      {/* 🚀 BULK CREATE */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-4">Bulk Create Flights</h3>

        <div className="grid grid-cols-2 gap-4">

          <input name="baseFlightNumber" placeholder="Base Flight No" onChange={(e) => handleChange(e, true)} className="border p-2 rounded" />
          <input name="count" placeholder="Count" onChange={(e) => handleChange(e, true)} className="border p-2 rounded" />

          <input name="from" placeholder="From" onChange={(e) => handleChange(e, true)} className="border p-2 rounded" />
          <input name="to" placeholder="To" onChange={(e) => handleChange(e, true)} className="border p-2 rounded" />

          <input name="departureTime" placeholder="Departure" onChange={(e) => handleChange(e, true)} className="border p-2 rounded" />
          <input name="arrivalTime" placeholder="Arrival" onChange={(e) => handleChange(e, true)} className="border p-2 rounded" />

          <input name="price" placeholder="Price" onChange={(e) => handleChange(e, true)} className="border p-2 rounded" />
          <input name="seatsAvailable" placeholder="Seats" onChange={(e) => handleChange(e, true)} className="border p-2 rounded" />

        </div>

        <button
          onClick={createBulk}
          className="mt-4 bg-blue-600 text-white px-5 py-2 rounded"
        >
          Create Bulk Flights
        </button>
      </div>

      {/* 📋 FLIGHTS LIST */}
      <div className="space-y-4">
        {flights.map(f => (
          <div key={f._id} className="bg-white p-4 rounded shadow flex justify-between items-center">

            <div>
              <h3 className="font-bold text-lg">{f.flightNumber}</h3>
              <p>{f.from} → {f.to}</p>
            </div>

            <div className="flex items-center gap-3">

              <input type="date" id={`date-${f._id}`} className="border p-1 rounded" />

              <button
                onClick={() => cancelDate(f._id, document.getElementById(`date-${f._id}`).value)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Cancel Date
              </button>

              <button
                onClick={() => deleteFlight(f._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default AdminDashboard;