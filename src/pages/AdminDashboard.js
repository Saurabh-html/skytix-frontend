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
    seatsAvailable: ''
  });

  const [editingId, setEditingId] = useState(null);

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
      showAlert('Unable to load flights', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await API.put(`/flights/${editingId}`, form);
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
        seatsAvailable: ''
      });

      setEditingId(null);
      fetchFlights();

    } catch {
      showAlert('Operation failed', 'danger');
    }
  };

  const handleEdit = (f) => {
    setEditingId(f._id);
    setForm({
      flightNumber: f.flightNumber,
      from: f.from,
      to: f.to,
      departureTime: f.departureTime,
      arrivalTime: f.arrivalTime,
      price: f.price,
      seatsAvailable: f.seatsAvailable
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
    <div className="max-w-6xl mx-auto p-6">

      <h2 className="text-3xl font-bold mb-6">Admin Panel</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 mb-6">

        <input placeholder="Flight No"
          value={form.flightNumber}
          onChange={e => setForm({...form, flightNumber:e.target.value})}
          className="border p-2 rounded"
        />

        <input placeholder="From"
          value={form.from}
          onChange={e => setForm({...form, from:e.target.value})}
          className="border p-2 rounded"
        />

        <input placeholder="To"
          value={form.to}
          onChange={e => setForm({...form, to:e.target.value})}
          className="border p-2 rounded"
        />

        <input placeholder="Departure"
          value={form.departureTime}
          onChange={e => setForm({...form, departureTime:e.target.value})}
          className="border p-2 rounded"
        />

        <input placeholder="Arrival"
          value={form.arrivalTime}
          onChange={e => setForm({...form, arrivalTime:e.target.value})}
          className="border p-2 rounded"
        />

        <input placeholder="Price"
          value={form.price}
          onChange={e => setForm({...form, price:e.target.value})}
          className="border p-2 rounded"
        />

        <input placeholder="Seats"
          value={form.seatsAvailable}
          onChange={e => setForm({...form, seatsAvailable:e.target.value})}
          className="border p-2 rounded"
        />

        <button className="col-span-2 bg-blue-600 text-white py-2 rounded">
          {editingId ? 'Update Flight' : 'Create Flight'}
        </button>

      </form>

      {/* LIST */}
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="space-y-4">

          {flights.map(f => (
            <div key={f._id} className="border p-4 rounded flex justify-between items-center">

              <div>
                <p className="font-bold">{f.flightNumber}</p>
                <p>{f.from} → {f.to}</p>
                <p>₹ {f.price}</p>
              </div>

              <div className="flex gap-4 text-lg">

                <FaEdit
                  className="cursor-pointer text-blue-600"
                  onClick={() => handleEdit(f)}
                />

                <FaTrash
                  className="cursor-pointer text-red-600"
                  onClick={() => handleDelete(f._id)}
                />

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default AdminDashboard;