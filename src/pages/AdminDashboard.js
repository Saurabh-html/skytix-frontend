import API from '../services/api';
import { useEffect, useState, useCallback } from 'react';

const AdminDashboard = ({ showAlert }) => {

  const [flights, setFlights] = useState([]);
  const [cancelDates, setCancelDates] = useState({});

  const [form, setForm] = useState({
    flightNumber: '',
    airline: 'Skytix',
    from: '',
    to: '',
    departureTime: '',
    arrivalTime: '',
    price: '',
    seatsAvailable: '',
    scheduleType: 'daily',
    daysOfWeek: ''
  });

  //  BULK FORM
  const [bulkForm, setBulkForm] = useState({
    baseFlightNumber: '',
    count: '',
    from: '',
    to: '',
    departureTime: '',
    arrivalTime: '',
    price: '',
    seatsAvailable: ''
  });

const fetchFlights = useCallback(async () => {
  try {
    const res = await API.get('/flights');
    setFlights(res.data.flights);
  } catch {
    showAlert('Error fetching flights', 'danger');
  }
}, [showAlert]);

useEffect(() => {
  fetchFlights();
}, [fetchFlights]);

  const user = JSON.parse(localStorage.getItem('user'));

  if (!user || user.role !== 'admin') {
    return <h2 className="text-center mt-20 text-red-500">Access Denied 🚫</h2>;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // CREATE SINGLE
  const createFlight = async (e) => {
    e.preventDefault();

    try {
      await API.post('/flights', {
        ...form,
        price: Number(form.price),
        seatsAvailable: Number(form.seatsAvailable),
        daysOfWeek:
          form.scheduleType === 'weekly'
            ? form.daysOfWeek.split(',').map(Number)
            : []
      });

      showAlert('Flight created', 'success');
      fetchFlights();

    } catch {
      showAlert('Error creating flight', 'danger');
    }
  };

  // BULK CREATE
  const createBulkFlights = async (e) => {
    e.preventDefault();

    try {
      await API.post('/flights/bulk', {
        ...bulkForm,
        count: Number(bulkForm.count),
        price: Number(bulkForm.price),
        seatsAvailable: Number(bulkForm.seatsAvailable)
      });

      showAlert('Bulk flights created', 'success');
      fetchFlights();

    } catch {
      showAlert('Error creating bulk flights', 'danger');
    }
  };

  const deleteFlight = async (id) => {
    await API.delete(`/flights/${id}`);
    showAlert('Deleted', 'success');
    fetchFlights();
  };

  const cancelByDate = async (id) => {
    const date = cancelDates[id];

    if (!date) {
      showAlert('Select date first', 'warning');
      return;
    }

    await API.put(`/flights/${id}/cancel-date`, { date });
    showAlert('Cancelled for date', 'success');
    fetchFlights();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">

      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>

      {/*  BULK CREATE */}
      <form onSubmit={createBulkFlights} className="bg-white p-4 mb-6 shadow rounded">
        <h3 className="font-bold mb-3">Bulk Create Flights</h3>

        <div className="grid grid-cols-2 gap-2">
          <input placeholder="Base Flight No" onChange={(e)=>setBulkForm({...bulkForm, baseFlightNumber:e.target.value})}/>
          <input placeholder="Count" onChange={(e)=>setBulkForm({...bulkForm, count:e.target.value})}/>
          <input placeholder="From" onChange={(e)=>setBulkForm({...bulkForm, from:e.target.value})}/>
          <input placeholder="To" onChange={(e)=>setBulkForm({...bulkForm, to:e.target.value})}/>
          <input placeholder="Departure" onChange={(e)=>setBulkForm({...bulkForm, departureTime:e.target.value})}/>
          <input placeholder="Arrival" onChange={(e)=>setBulkForm({...bulkForm, arrivalTime:e.target.value})}/>
          <input placeholder="Price" onChange={(e)=>setBulkForm({...bulkForm, price:e.target.value})}/>
          <input placeholder="Seats" onChange={(e)=>setBulkForm({...bulkForm, seatsAvailable:e.target.value})}/>
        </div>

        <button className="mt-3 bg-green-600 text-white px-4 py-2 rounded">
          Create Bulk Flights
        </button>
      </form>

      {/* EXISTING CREATE FORM */}
      <form onSubmit={createFlight} className="bg-white p-4 mb-6 shadow rounded">
        <h3>Add Flight</h3>
        <input name="flightNumber" placeholder="Flight Number" onChange={handleChange}/>
        <input name="from" placeholder="From" onChange={handleChange}/>
        <input name="to" placeholder="To" onChange={handleChange}/>
        <input name="price" placeholder="Price" onChange={handleChange}/>
        <input name="seatsAvailable" placeholder="Seats" onChange={handleChange}/>
        <button>Add</button>
      </form>

      {/* FLIGHTS */}
      {flights.map(f => (
        <div key={f._id} className="bg-white p-3 mb-2 shadow flex justify-between">

          <div>
            <h3>{f.flightNumber}</h3>
            <p>{f.from} → {f.to}</p>
          </div>

          <div>
            <input
              type="date"
              onChange={(e)=>setCancelDates({...cancelDates, [f._id]:e.target.value})}
            />

            <button onClick={()=>cancelByDate(f._id)}>Cancel Date</button>
            <button onClick={()=>deleteFlight(f._id)}>Delete</button>
          </div>

        </div>
      ))}

    </div>
  );
};

export default AdminDashboard;