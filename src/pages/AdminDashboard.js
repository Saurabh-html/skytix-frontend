import { useEffect, useState } from 'react';
import API from '../services/api';
import { FaEdit, FaTrash } from 'react-icons/fa';

const AdminDashboard = ({ showAlert }) => {

  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const [editingFlight, setEditingFlight] = useState(null);

  useEffect(() => {
    fetchFlights();
  //eslint-disable-next-line
  }, []);

  const fetchFlights = async () => {
    try {
      setLoading(true);
      const res = await API.get('/flights');
      setFlights(res.data.flights || []);
    } catch {
      showAlert('Unable to fetch flights', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingFlight) {
        await API.put(`/flights/${editingFlight._id}`, form);
        showAlert('Flight updated', 'success');
      } else {
        await API.post('/flights', form);
        showAlert('Flight created', 'success');
      }

      setForm({
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

      setEditingFlight(null);
      fetchFlights();

    } catch {
      showAlert('Operation failed', 'danger');
    }
  };

  const handleEdit = (flight) => {
    setEditingFlight(flight);
    setForm({
      ...flight,
      price: flight.price || '',
      seatsAvailable: flight.seatsAvailable || ''
    });
  };

  const handleDelete = async (id) => {
    try {
      const scrollY = window.scrollY;

      await API.delete(`/flights/${id}`);

      setFlights(prev => prev.filter(f => f._id !== id));

      setTimeout(() => window.scrollTo(0, scrollY), 0);

      showAlert('Flight deleted', 'success');

    } catch {
      showAlert('Delete failed', 'danger');
    }
  };

return (
  <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen">

    <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
      Admin Dashboard
    </h2>

    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 p-5 rounded shadow mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3 border dark:border-gray-700"
    >

      <input placeholder="Flight Number"
        value={form.flightNumber}
        onChange={e => setForm({ ...form, flightNumber: e.target.value })}
        className="border p-2 rounded dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
      />

      <input placeholder="From"
        value={form.from}
        onChange={e => setForm({ ...form, from: e.target.value })}
        className="border p-2 rounded dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
      />

      <input placeholder="To"
        value={form.to}
        onChange={e => setForm({ ...form, to: e.target.value })}
        className="border p-2 rounded dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
      />

      <input placeholder="Departure Time"
        value={form.departureTime}
        onChange={e => setForm({ ...form, departureTime: e.target.value })}
        className="border p-2 rounded dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
      />

      <input placeholder="Arrival Time"
        value={form.arrivalTime}
        onChange={e => setForm({ ...form, arrivalTime: e.target.value })}
        className="border p-2 rounded dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
      />

      <input placeholder="Price"
        value={form.price}
        onChange={e => setForm({ ...form, price: e.target.value })}
        className="border p-2 rounded dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
      />

      <input placeholder="Seats"
        value={form.seatsAvailable}
        onChange={e => setForm({ ...form, seatsAvailable: e.target.value })}
        className="border p-2 rounded dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
      />

      <select
        value={form.scheduleType}
        onChange={e => setForm({ ...form, scheduleType: e.target.value })}
        className="border p-2 rounded dark:bg-gray-700 dark:text-white"
      >
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
      </select>

      <button
        className="bg-blue-600 text-white py-2 rounded col-span-full hover:bg-blue-700 transition"
      >
        {editingFlight ? 'Update Flight' : 'Create Flight'}
      </button>

    </form>

    {/* LIST */}
    {loading && (
      <p className="text-center text-gray-500 dark:text-gray-400">
        Loading...
      </p>
    )}

    <div className="grid gap-4">

      {flights.map(f => (
        <div key={f._id}
          className="bg-white dark:bg-gray-800 p-4 rounded shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border dark:border-gray-700"
        >

          <div>
            <h3 className="font-bold text-blue-600 dark:text-blue-400">
              {f.flightNumber}
            </h3>

            <p className="text-gray-600 dark:text-gray-300">
              {f.from} → {f.to}
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              ₹ {f.price}
            </p>
          </div>

          <div className="flex gap-3">

            <FaEdit
              className="cursor-pointer text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
              onClick={() => handleEdit(f)}
            />

            <FaTrash
              className="cursor-pointer text-red-500 hover:text-red-700 dark:hover:text-red-400"
              onClick={() => handleDelete(f._id)}
            />

          </div>

        </div>
      ))}

    </div>

  </div>
);
};

export default AdminDashboard;