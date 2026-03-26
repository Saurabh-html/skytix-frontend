import { useEffect, useState } from 'react';
import API from '../services/api';
import { FaEdit, FaTrash } from 'react-icons/fa';

const AdminDashboard = ({ showAlert }) => {

  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    flightNumber: '',
    from: '',
    to: '',
    departureTime: '',
    arrivalTime: '',
    economy: '',
    business: '',
    first: '',
    priceEconomy: '',
    priceBusiness: '',
    priceFirst: ''
  });

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

  // ✅ CREATE / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        flightNumber: form.flightNumber,
        from: form.from,
        to: form.to,
        departureTime: form.departureTime,
        arrivalTime: form.arrivalTime,

        seatConfig: {
          economy: Number(form.economy),
          business: Number(form.business),
          first: Number(form.first)
        },

        priceConfig: {
          economy: Number(form.priceEconomy),
          business: Number(form.priceBusiness),
          first: Number(form.priceFirst)
        }
      };

      if (editingId) {
        await API.put(`/flights/${editingId}`, payload);
        showAlert('Flight updated', 'success');
      } else {
        await API.post('/flights', payload);
        showAlert('Flight created', 'success');
      }

      resetForm();
      fetchFlights();

    } catch {
      showAlert('Operation failed', 'danger');
    }
  };

  const resetForm = () => {
    setForm({
      flightNumber: '',
      from: '',
      to: '',
      departureTime: '',
      arrivalTime: '',
      economy: '',
      business: '',
      first: '',
      priceEconomy: '',
      priceBusiness: '',
      priceFirst: ''
    });
    setEditingId(null);
  };

  // ✅ EDIT FIXED
  const handleEdit = (f) => {
    setEditingId(f._id);

    setForm({
      flightNumber: f.flightNumber || '',
      from: f.from || '',
      to: f.to || '',
      departureTime: f.departureTime || '',
      arrivalTime: f.arrivalTime || '',

      economy: f.seatConfig?.economy || '',
      business: f.seatConfig?.business || '',
      first: f.seatConfig?.first || '',

      priceEconomy: f.priceConfig?.economy || '',
      priceBusiness: f.priceConfig?.business || '',
      priceFirst: f.priceConfig?.first || ''
    });
  };

  // ✅ DELETE FIX (NO JUMP)
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

        <input placeholder="Flight Number"
          value={form.flightNumber}
          onChange={e => setForm({ ...form, flightNumber: e.target.value })}
          className="border p-2 rounded"
        />

        <input placeholder="From"
          value={form.from}
          onChange={e => setForm({ ...form, from: e.target.value })}
          className="border p-2 rounded"
        />

        <input placeholder="To"
          value={form.to}
          onChange={e => setForm({ ...form, to: e.target.value })}
          className="border p-2 rounded"
        />

        <input placeholder="Departure Time"
          value={form.departureTime}
          onChange={e => setForm({ ...form, departureTime: e.target.value })}
          className="border p-2 rounded"
        />

        <input placeholder="Arrival Time"
          value={form.arrivalTime}
          onChange={e => setForm({ ...form, arrivalTime: e.target.value })}
          className="border p-2 rounded"
        />

        {/* SEATS */}
        <input placeholder="Economy Seats"
          value={form.economy}
          onChange={e => setForm({ ...form, economy: e.target.value })}
          className="border p-2 rounded"
        />

        <input placeholder="Business Seats"
          value={form.business}
          onChange={e => setForm({ ...form, business: e.target.value })}
          className="border p-2 rounded"
        />

        <input placeholder="First Class Seats"
          value={form.first}
          onChange={e => setForm({ ...form, first: e.target.value })}
          className="border p-2 rounded"
        />

        {/* PRICES */}
        <input placeholder="Economy Price"
          value={form.priceEconomy}
          onChange={e => setForm({ ...form, priceEconomy: e.target.value })}
          className="border p-2 rounded"
        />

        <input placeholder="Business Price"
          value={form.priceBusiness}
          onChange={e => setForm({ ...form, priceBusiness: e.target.value })}
          className="border p-2 rounded"
        />

        <input placeholder="First Class Price"
          value={form.priceFirst}
          onChange={e => setForm({ ...form, priceFirst: e.target.value })}
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

                <p>
                  Seats: E {f.seatConfig?.economy} | B {f.seatConfig?.business} | F {f.seatConfig?.first}
                </p>

                <p>
                  ₹ E {f.priceConfig?.economy} | B {f.priceConfig?.business} | F {f.priceConfig?.first}
                </p>
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