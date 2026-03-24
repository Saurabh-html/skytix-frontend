import { useEffect, useState } from 'react';
import API from '../services/api';
import jsPDF from 'jspdf';

const MyBookings = ({ showAlert }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [selectedPassengers, setSelectedPassengers] = useState({});
  const [cancelMode, setCancelMode] = useState({});

  useEffect(() => {
    fetchBookings();
    //eslint-disable-next-line
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await API.get('/bookings/my');
      setBookings(res.data.bookings);
    } catch {
      showAlert('Error fetching bookings', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const togglePassenger = (bookingId, index) => {
    setSelectedPassengers(prev => {
      const current = prev[bookingId] || [];

      return {
        ...prev,
        [bookingId]: current.includes(index)
          ? current.filter(i => i !== index)
          : [...current, index]
      };
    });
  };

  const cancelBooking = async (bookingId) => {
    const indexes = selectedPassengers[bookingId] || [];

    if (indexes.length === 0) {
      showAlert('Select passengers', 'warning');
      return;
    }

    try {
      setActionLoading(true);

      await API.delete(`/bookings/${bookingId}`, {
        data: { passengerIndexes: indexes }
      });

      showAlert('Cancelled successfully', 'success');
      fetchBookings();

      setCancelMode({});
      setSelectedPassengers({});

    } catch (err) {
      showAlert(err.response?.data?.message || 'Error', 'danger');
    } finally {
      setActionLoading(false);
    }
  };

  // 🔥 UPDATED PDF (SEAT ADDED)
  const downloadTicket = (b) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('SKYTIX BOARDING PASS', 20, 20);

    doc.setFontSize(12);
    doc.text(`Flight: ${b.flight.flightNumber}`, 20, 40);
    doc.text(`${b.flight.from} → ${b.flight.to}`, 20, 50);
    doc.text(`Date: ${new Date(b.date).toLocaleDateString()}`, 20, 60);
    doc.text(`Class: ${b.seatClass?.toUpperCase()}`, 20, 70);

    b.passengers.forEach((p, i) => {
      doc.text(
        `${p.name} | ${p.age} | ${p.gender} | Seat: ${p.seat || '-'}`,
        20,
        80 + i * 10
      );
    });

    doc.save(`ticket-${b._id}.pdf`);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">

      <h2 className="text-3xl font-bold mb-6">My Bookings</h2>

      {loading && (
        <p className="text-center text-gray-500">Loading bookings...</p>
      )}

      {!loading && bookings.length === 0 && (
        <div className="text-center text-gray-400 mt-10">
          <p className="text-lg">No bookings yet</p>
          <p>Book your first flight ✈️</p>
        </div>
      )}

      <div className="space-y-5">

        {bookings.map(b => {
          const isCancelMode = cancelMode[b._id];

          return (
            <div key={b._id} className="bg-white p-5 rounded-lg shadow-md">

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
                <h3 className="font-bold text-blue-600">
                  {b.flight.flightNumber}
                </h3>

                <span className="text-sm text-gray-500">
                  {new Date(b.date).toLocaleDateString()}
                </span>
              </div>

              <p className="mb-2">
                {b.flight.from} → {b.flight.to}
              </p>

              <p className="text-sm text-gray-600 mb-2">
                Class: {b.seatClass?.toUpperCase()}
              </p>

              {/* PASSENGERS */}
              <div className="mb-3">
                <p className="font-semibold mb-1">Passengers</p>

                {b.passengers.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded mb-1"
                  >

                    {isCancelMode && (
                      <input
                        type="checkbox"
                        onChange={() => togglePassenger(b._id, i)}
                      />
                    )}

                    <span>
                      {p.name} ({p.age}, {p.gender})
                    </span>

                    {/* 🔥 NEW SEAT DISPLAY */}
                    <span className="ml-auto text-blue-600 font-medium">
                      Seat: {p.seat || '-'}
                    </span>

                  </div>
                ))}
              </div>

              <p className="font-bold mb-3">
                Total: ₹ {b.totalPrice}
              </p>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">

                {!isCancelMode ? (
                  <>
                    <button
                      onClick={() =>
                        setCancelMode(prev => ({ ...prev, [b._id]: true }))
                      }
                      className="bg-red-500 text-white px-3 py-1 rounded w-full sm:w-auto"
                    >
                      Cancel Ticket
                    </button>

                    <button
                      onClick={() => downloadTicket(b)}
                      className="bg-green-600 text-white px-3 py-1 rounded w-full sm:w-auto"
                    >
                      Download Ticket
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      disabled={actionLoading}
                      onClick={() => cancelBooking(b._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      {actionLoading ? 'Cancelling...' : 'Confirm Cancel'}
                    </button>

                    <button
                      onClick={() =>
                        setCancelMode(prev => ({ ...prev, [b._id]: false }))
                      }
                      className="bg-gray-400 text-white px-3 py-1 rounded w-full sm:w-auto"
                    >
                      Back
                    </button>
                  </>
                )}

              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
};

export default MyBookings;