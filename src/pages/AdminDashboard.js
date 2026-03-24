import { useEffect, useState, useCallback } from 'react';
import API from '../services/api';

const AdminDashboard = ({ showAlert }) => {

  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState({
    totalFlights: 0,
    totalBookings: 0,
    totalRevenue: 0
  });

  // 🔥 UPDATED FORM (CLASS SUPPORT)
  const [form, setForm] = useState({
    flightNumber: '',
    from: '',
    to: '',
    departureTime: '',
    arrivalTime: '',
    scheduleType: 'daily',

    // NEW
    economyPrice: '',
    businessPrice: '',
    firstPrice: '',

    economySeats: '',
    businessSeats: '',
    firstSeats: ''
  });

  const [bulk, setBulk] = useState({
    baseFlightNumber: '',
    count: 1
  });

  // =========================
  // FETCH FLIGHTS
  // =========================
  const fetchFlights = useCallback(async () => {
    try {
      setLoading(true);

      const res = await API.get('/flights');
      setFlights(res.data.flights || []);

      setStats(prev => ({
        ...prev,
        totalFlights: res.data.flights.length
      }));

    } catch {
      showAlert('Error fetching flights', 'danger');
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  // =========================
  // FETCH BOOKINGS
  // =========================
  const fetchBookingsStats = async () => {
    try {
      const res = await API.get('/bookings/stats');

      const bookings = res.data.bookings || [];

      let revenue = 0;
      bookings.forEach(b => revenue += b.totalPrice);

      setStats(prev => ({
        ...prev,
        totalBookings: bookings.length,
        totalRevenue: revenue
      }));

    } catch {
      console.log('Stats fetch failed');
    }
  };

  useEffect(() => {
    fetchFlights();
    fetchBookingsStats();
  }, [fetchFlights]);

  // =========================
  // CREATE FLIGHT
  // =========================
  const createFlight = async () => {
    try {
      await API.post('/flights', {
        flightNumber: form.flightNumber,
        from: form.from,
        to: form.to,
        departureTime: form.departureTime,
        arrivalTime: form.arrivalTime,
        scheduleType: form.scheduleType,

        // 🔥 CLASS CONFIG
        priceConfig: {
          economy: Number(form.economyPrice),
          business: Number(form.businessPrice),
          first: Number(form.firstPrice)
        },

        seatConfig: {
          economy: Number(form.economySeats),
          business: Number(form.businessSeats),
          first: Number(form.firstSeats)
        }
      });

      showAlert('Flight created', 'success');
      fetchFlights();

    } catch (err) {
      showAlert(err.response?.data?.message || 'Error', 'danger');
    }
  };

  // =========================
  // BULK CREATE
  // =========================
  const createBulk = async () => {
    try {
      await API.post('/flights/bulk', {
        ...bulk,

        from: form.from,
        to: form.to,
        departureTime: form.departureTime,
        arrivalTime: form.arrivalTime,
        scheduleType: form.scheduleType,

        priceConfig: {
          economy: Number(form.economyPrice),
          business: Number(form.businessPrice),
          first: Number(form.firstPrice)
        },

        seatConfig: {
          economy: Number(form.economySeats),
          business: Number(form.businessSeats),
          first: Number(form.firstSeats)
        }
      });

      showAlert('Bulk flights created', 'success');
      fetchFlights();

    } catch (err) {
      showAlert(err.response?.data?.message || 'Error', 'danger');
    }
  };

  // =========================
  // DELETE
  // =========================
  const deleteFlight = async (id) => {
    try {
      await API.delete(`/flights/${id}`);
      showAlert('Flight deleted', 'success');
      fetchFlights();
    } catch {
      showAlert('Error deleting flight', 'danger');
    }
  };

  // =========================
  // CANCEL DATE
  // =========================
  const cancelDate = async (id) => {
    const date = prompt('Enter date (YYYY-MM-DD)');
    if (!date) return;

    try {
      await API.put(`/flights/${id}/cancel-date`, { date });
      showAlert('Flight cancelled for date', 'success');
    } catch {
      showAlert('Error cancelling', 'danger');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">

      {/* 📊 STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

        <div className="bg-white p-4 shadow rounded text-center">
          <h3>Flights</h3>
          <p className="text-2xl">{stats.totalFlights}</p>
        </div>

        <div className="bg-white p-4 shadow rounded text-center">
          <h3>Bookings</h3>
          <p className="text-2xl">{stats.totalBookings}</p>
        </div>

        <div className="bg-white p-4 shadow rounded text-center">
          <h3>Revenue</h3>
          <p className="text-2xl">₹ {stats.totalRevenue}</p>
        </div>

      </div>

      {/* ✈️ FORM */}
      <div className="bg-white p-5 rounded shadow mb-6">

        <h2 className="text-xl font-bold mb-4">Add Flight</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

          <input placeholder="Flight No" onChange={(e)=>setForm({...form, flightNumber:e.target.value})} className="border p-2"/>
          <input placeholder="From" onChange={(e)=>setForm({...form, from:e.target.value})} className="border p-2"/>
          <input placeholder="To" onChange={(e)=>setForm({...form, to:e.target.value})} className="border p-2"/>

          <input placeholder="Departure" onChange={(e)=>setForm({...form, departureTime:e.target.value})} className="border p-2"/>
          <input placeholder="Arrival" onChange={(e)=>setForm({...form, arrivalTime:e.target.value})} className="border p-2"/>

          {/* 🔥 CLASS PRICES */}
          <input placeholder="Economy Price" onChange={(e)=>setForm({...form, economyPrice:e.target.value})} className="border p-2"/>
          <input placeholder="Business Price" onChange={(e)=>setForm({...form, businessPrice:e.target.value})} className="border p-2"/>
          <input placeholder="First Price" onChange={(e)=>setForm({...form, firstPrice:e.target.value})} className="border p-2"/>

          {/* 🔥 CLASS SEATS */}
          <input placeholder="Economy Seats" onChange={(e)=>setForm({...form, economySeats:e.target.value})} className="border p-2"/>
          <input placeholder="Business Seats" onChange={(e)=>setForm({...form, businessSeats:e.target.value})} className="border p-2"/>
          <input placeholder="First Seats" onChange={(e)=>setForm({...form, firstSeats:e.target.value})} className="border p-2"/>

          <select onChange={(e)=>setForm({...form, scheduleType:e.target.value})} className="border p-2">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>

          <input
            placeholder="Bulk Count"
            type="number"
            value={bulk.count}
            onChange={(e)=>setBulk({...bulk, count:e.target.value})}
            className="border p-2"
          />

        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <button onClick={createFlight} className="bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto">
            Create
          </button>

          <button onClick={createBulk} className="bg-purple-600 text-white px-4 py-2 rounded w-full sm:w-auto">
            Bulk Create
          </button>
        </div>

      </div>

      {/* LIST */}
      {loading ? <p>Loading...</p> : (
        <div className="grid gap-4">
          {flights.map(f => (
            <div key={f._id} className="bg-white p-4 shadow rounded flex flex-col sm:flex-row justify-between items-center gap-2">

              <div>
                <h3>{f.flightNumber}</h3>
                <p>{f.from} → {f.to}</p>
              </div>

              <div className="flex gap-2">
                <button onClick={()=>cancelDate(f._id)} className="bg-yellow-500 text-white px-3 py-1 rounded">
                  Cancel Date
                </button>

                <button onClick={()=>deleteFlight(f._id)} className="bg-red-500 text-white px-3 py-1 rounded">
                  Delete
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;