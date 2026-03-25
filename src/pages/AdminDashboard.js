import { useEffect, useState, useCallback } from 'react';
import API from '../services/api';
import { FaTimes, FaEdit, FaTrash } from 'react-icons/fa';

const AdminDashboard = ({ showAlert }) => {

  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState({
    totalFlights: 0,
    totalBookings: 0,
    totalRevenue: 0
  });

  const [editFlight, setEditFlight] = useState(null);

  const [form, setForm] = useState({
    flightNumber: '',
    from: '',
    to: '',
    departureTime: '',
    arrivalTime: ''
  });

  const [bulk, setBulk] = useState({
    baseFlightNumber: '',
    count: 1
  });

  const safeError = () => 'Unable to process request. Please try again.';

  const fetchFlights = useCallback(async () => {
    try {
      setLoading(true);

      const res = await API.get('/flights');
      const data = res.data.flights || [];

      setFlights(data);

      setStats(prev => ({
        ...prev,
        totalFlights: data.length
      }));

    } catch {
      showAlert(safeError(), 'danger');
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  const fetchBookingsStats = async () => {
    try {
      const res = await API.get('/bookings/stats');

      const bookings = res.data.bookings || [];
      const revenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);

      setStats(prev => ({
        ...prev,
        totalBookings: bookings.length,
        totalRevenue: revenue
      }));

    } catch {}
  };

  useEffect(() => {
    fetchFlights();
    fetchBookingsStats();
  }, [fetchFlights]);

  const createFlight = async () => {
    if (!form.flightNumber || !form.from || !form.to) {
      showAlert('Fill all required fields', 'warning');
      return;
    }

    try {
      await API.post('/flights', form);
      showAlert('Flight created', 'success');
      fetchFlights();
    } catch {
      showAlert(safeError(), 'danger');
    }
  };

  const createBulk = async () => {
    if (!bulk.baseFlightNumber) {
      showAlert('Enter base flight number', 'warning');
      return;
    }

    try {
      await API.post('/flights/bulk', { ...bulk, ...form });
      showAlert('Bulk flights created', 'success');
      fetchFlights();
    } catch {
      showAlert(safeError(), 'danger');
    }
  };

  const deleteFlight = async (id) => {
    try {
      await API.delete(`/flights/${id}`);
      showAlert('Flight deleted', 'success');
      fetchFlights();
    } catch {
      showAlert(safeError(), 'danger');
    }
  };

  const cancelDate = async (id) => {
    const date = prompt('Enter date (YYYY-MM-DD)');
    if (!date) return;

    try {
      await API.put(`/flights/${id}/cancel-date`, { date });
      showAlert('Cancelled for date', 'success');
    } catch {
      showAlert(safeError(), 'danger');
    }
  };

  const updateFlight = async () => {
    try {
      await API.put(`/flights/${editFlight._id}`, editFlight);
      showAlert('Flight updated', 'success');
      setEditFlight(null);
      fetchFlights();
    } catch {
      showAlert(safeError(), 'danger');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <StatCard title="Flights" value={stats.totalFlights} />
        <StatCard title="Bookings" value={stats.totalBookings} />
        <StatCard title="Revenue" value={`₹${stats.totalRevenue}`} />
      </div>

      {/* CREATE */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="font-bold mb-3">Add Flight</h2>

        <div className="grid grid-cols-2 gap-2">
          {Object.keys(form).map((key) => (
            <input
              key={key}
              placeholder={key}
              className="border p-2"
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          ))}
        </div>

        <button onClick={createFlight} className="bg-blue-600 text-white px-4 py-2 mt-3">
          Create Flight
        </button>

        <div className="mt-4 flex gap-2">
          <input placeholder="Base Flight Number" className="border p-2"
            onChange={(e)=>setBulk({...bulk, baseFlightNumber:e.target.value})} />

          <input type="number" value={bulk.count} className="border p-2"
            onChange={(e)=>setBulk({...bulk, count:e.target.value})} />

          <button onClick={createBulk} className="bg-purple-600 text-white px-3 py-2">
            Bulk Create
          </button>
        </div>
      </div>

      {/* LIST */}
      {loading ? <p>Loading...</p> : (
        <div className="grid gap-4">
          {flights.map(f => (
            <div key={f._id} className="bg-white p-4 shadow rounded flex justify-between items-center">

              <div>
                <h3>{f.flightNumber}</h3>
                <p>{f.from} → {f.to}</p>
              </div>

              <div className="flex gap-3 text-lg">
                <FaEdit className="cursor-pointer" onClick={()=>setEditFlight(f)} />
                <FaTrash className="cursor-pointer text-red-500" onClick={()=>deleteFlight(f._id)} />
                <button onClick={()=>cancelDate(f._id)} className="bg-yellow-500 text-white px-2 py-1">
                  Cancel
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* EDIT */}
      {editFlight && (
        <Modal onClose={()=>setEditFlight(null)}>
          <h3 className="mb-3 font-bold">Edit Flight</h3>

          {['flightNumber','from','to'].map(field => (
            <input key={field}
              className="border p-2 w-full mb-2"
              value={editFlight[field]}
              onChange={(e)=>setEditFlight({...editFlight,[field]:e.target.value})}
            />
          ))}

          <button onClick={updateFlight} className="bg-blue-600 text-white w-full py-2">
            Save
          </button>
        </Modal>
      )}

    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white p-4 text-center shadow rounded">
    <h3>{title}</h3>
    <p className="text-xl">{value}</p>
  </div>
);

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-5 rounded relative w-80">
      <FaTimes className="absolute top-2 right-2 cursor-pointer" onClick={onClose}/>
      {children}
    </div>
  </div>
);

export default AdminDashboard;