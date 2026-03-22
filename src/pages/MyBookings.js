import { useEffect, useState } from 'react';
import API from '../services/api';
import jsPDF from 'jspdf';

const MyBookings = ({ showAlert }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedPassengers, setSelectedPassengers] = useState({});
  const [cancelMode, setCancelMode] = useState({}); //  NEW

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await API.get('/bookings/my');
      setBookings(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      showAlert('Error Fetching Bookings', 'danger');
    }
  };

  // ENTER CANCEL MODE
  const enableCancelMode = (bookingId) => {
    setCancelMode((prev) => ({
      ...prev,
      [bookingId]: true
    }));
  };

  const togglePassenger = (bookingId, index) => {
    setSelectedPassengers((prev) => {
      const current = prev[bookingId] || [];

      if (current.includes(index)) {
        return {
          ...prev,
          [bookingId]: current.filter((i) => i !== index)
        };
      } else {
        return {
          ...prev,
          [bookingId]: [...current, index]
        };
      }
    });
  };

  const downloadTicket = (booking) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Skytix Flight Ticket', 20, 20);

    doc.setFontSize(12);
    doc.text(`Flight: ${booking.flight.flightNumber}`, 20, 40);
    doc.text(`Route: ${booking.flight.from} → ${booking.flight.to}`, 20, 50);
    doc.text(`Date: ${new Date(booking.date).toLocaleDateString()}`, 20, 60);
    doc.text(`Total Price: ₹ ${booking.totalPrice}`, 20, 70);

    doc.text('Passengers:', 20, 90);

    booking.passengers.forEach((p, i) => {
      doc.text(`${i + 1}. ${p.name} (${p.age}, ${p.gender})`, 20, 100 + i * 10);
    });

    doc.save('ticket.pdf');
  };

  const cancelBooking = async (bookingId) => {
    const indexes = selectedPassengers[bookingId] || [];

    if (indexes.length === 0) {
      showAlert('Select passengers to cancel', 'warning');
      return;
    }

    try {
      await API.delete(`/bookings/${bookingId}`, {
        data: { passengerIndexes: indexes }
      });

      showAlert('Tickets cancelled successfully', 'success');

      fetchBookings();
      setSelectedPassengers({});
      setCancelMode({}); // RESET MODE

    } catch (err) {
      showAlert(err.response?.data?.message || 'Error cancelling', 'danger');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">

      <h2 className="text-3xl font-bold mb-6 text-gray-700">
        My Bookings
      </h2>

      {loading && (
        <p className="text-center text-gray-500">Loading bookings...</p>
      )}

      {!loading && bookings.length === 0 && (
        <p className="text-center text-gray-500">
          No bookings found.
        </p>
      )}

      <div className="grid gap-5">
        {bookings.map((b) => {

          const isCancelMode = cancelMode[b._id];

          return (
            <div
              key={b._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden border flex flex-col md:flex-row"
            >

              {/* LEFT PANEL */}
              <div className="bg-blue-600 text-white p-5 flex flex-col justify-center items-center md:w-1/4">
                <h2 className="text-xl font-bold">
                  {b.flight.flightNumber}
                </h2>

                <p className="text-sm mt-2">
                  {new Date(b.date).toLocaleDateString()}
                </p>
              </div>

              {/* RIGHT PANEL */}
              <div className="p-5 flex-1">

                {/* ROUTE */}
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold">
                    {b.flight.from} → {b.flight.to}
                  </h3>

                  <span className="font-bold text-gray-700">
                    ₹ {b.totalPrice}
                  </span>
                </div>

                {/* PASSENGERS */}
                <div className="mb-3">
                  <p className="font-semibold mb-2">Passengers:</p>

                  {b.passengers.map((p, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">

                      {/* SHOW CHECKBOX ONLY IN CANCEL MODE */}
                      {isCancelMode && (
                        <input
                          type="checkbox"
                          onChange={() => togglePassenger(b._id, index)}
                        />
                      )}

                      <span>
                        {p.name} ({p.age}, {p.gender})
                      </span>
                    </div>
                  ))}
                </div>

                {/* BUTTONS */}
                <div className="flex gap-3 mt-4">

                  {!isCancelMode ? (
                    <>
                      {/* NORMAL MODE */}
                      <button
                        onClick={() => enableCancelMode(b._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                      >
                        Cancel Ticket
                      </button>

                      <button
                        onClick={() => downloadTicket(b)}
                        className="bg-green-600 text-white px-4 py-2 rounded"
                      >
                        Download Ticket
                      </button>
                    </>
                  ) : (
                    <>
                      {/* CANCEL MODE */}
                      <button
                        onClick={() => cancelBooking(b._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                      >
                        Cancel Selected
                      </button>
                    </>
                  )}

                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyBookings;