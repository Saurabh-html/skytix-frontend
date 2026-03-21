
import API from '../services/api';
import { useEffect, useState } from 'react';

const AdminDashboard = ({ showAlert }) => {


  const [flights, setFlights] = useState([]);

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

  const fetchFlights = async () => {
    try {
      const res = await API.get('/flights');
      setFlights(res.data.flights);
    } catch {
      showAlert('Error fetching flights', 'danger');
    }
  };

  useEffect(() => {
    fetchFlights();
    //eslint-disable-next-line
  }, []);

  const user = JSON.parse(localStorage.getItem('user'));

  if (!user || user.role !== 'admin') {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold text-red-500">
          Access Denied 🚫
        </h2>
      </div>
    );
  }

  //  INPUT CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //  CREATE FLIGHT
  const createFlight = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        seatsAvailable: Number(form.seatsAvailable),
        daysOfWeek:
          form.scheduleType === 'weekly'
            ? form.daysOfWeek.split(',').map(Number)
            : []
      };

      await API.post('/flights', payload);

      showAlert('Flight created', 'success');

      // RESET FORM
      setForm({
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

      fetchFlights();

    } catch (err) {
      showAlert(err.response?.data?.message || 'Error creating flight', 'danger');
    }
  };

  //  DELETE FLIGHT
  const deleteFlight = async (id) => {
    try {
      await API.delete(`/flights/${id}`);
      showAlert('Flight deleted', 'success');
      fetchFlights();
    } catch {
      showAlert('Error deleting flight', 'danger');
    }
  };

  //  CANCEL FLIGHT
  const cancelFlight = async (id) => {
    try {
      await API.put(`/flights/${id}/cancel`);
      showAlert('Flight cancelled', 'warning');
      fetchFlights();
    } catch {
      showAlert('Error cancelling flight', 'danger');
    }
  };

  //  UI
  return (
    <div className="max-w-6xl mx-auto p-6">

      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>

      {/*  CREATE FLIGHT */}
      <form onSubmit={createFlight} className="bg-white p-5 rounded shadow mb-6">

        <h3 className="font-semibold mb-3">Add Flight</h3>

        <div className="grid grid-cols-2 gap-3">

          <input name="flightNumber" placeholder="Flight Number" value={form.flightNumber} onChange={handleChange} className="border p-2" />
          <input name="from" placeholder="From" value={form.from} onChange={handleChange} className="border p-2" />
          <input name="to" placeholder="To" value={form.to} onChange={handleChange} className="border p-2" />
          <input name="departureTime" placeholder="Departure Time (10:00)" value={form.departureTime} onChange={handleChange} className="border p-2" />
          <input name="arrivalTime" placeholder="Arrival Time (12:00)" value={form.arrivalTime} onChange={handleChange} className="border p-2" />
          <input name="price" placeholder="Price" value={form.price} onChange={handleChange} className="border p-2" />
          <input name="seatsAvailable" placeholder="Seats" value={form.seatsAvailable} onChange={handleChange} className="border p-2" />

          <select name="scheduleType" value={form.scheduleType} onChange={handleChange} className="border p-2">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>

          {form.scheduleType === 'weekly' && (
            <input
              name="daysOfWeek"
              placeholder="Days (e.g. 1,3,5)"
              value={form.daysOfWeek}
              onChange={handleChange}
              className="border p-2 col-span-2"
            />
          )}

        </div>

        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
          Add Flight
        </button>

      </form>

      {/*  FLIGHTS */}
      <div className="grid gap-4">

        {flights.map((f) => (
          <div key={f._id} className="bg-white p-4 rounded shadow flex justify-between items-center">

            <div>
              <h3 className="font-semibold">{f.flightNumber}</h3>
              <p>{f.from} → {f.to}</p>
              <p className="text-sm text-gray-500">
                {f.scheduleType === 'daily'
                  ? 'Daily'
                  : `Days: ${f.daysOfWeek.join(',')}`}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => cancelFlight(f._id)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Cancel
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