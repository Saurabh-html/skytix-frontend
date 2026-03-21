import { useEffect, useState } from 'react';
import API from '../services/api';
import jsPDF from 'jspdf';

const MyBookings = ({ showAlert }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

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
    doc.text(
      `${i + 1}. ${p.name} (${p.age}, ${p.gender})`,
      20,
      100 + i * 10
    );
  });

  doc.save('ticket.pdf');
};

  const cancelBooking = async (id) => {
    try {
      await API.delete(`/bookings/${id}`);

      showAlert('Booking Cancelled', 'success');

      fetchBookings();
    } catch (err) {
      showAlert(
        err.response?.data?.message || 'Error cancelling ticket',
        'danger'
      );
    }
  };

  return (
  <div className="max-w-5xl mx-auto p-6">

    <h2 className="text-3xl font-bold mb-6 text-gray-700">
      My Bookings
    </h2>

    {/*  LOADING */}
    {loading && (
      <p className="text-center text-gray-500">Loading bookings...</p>
    )}

    {/*  NO BOOKINGS */}
    {!loading && bookings.length === 0 && (
      <p className="text-center text-gray-500">
        No bookings found.
      </p>
    )}

    {/*  BOOKINGS */}
    <div className="grid gap-5">
      {bookings.map((b) => (
        
        <div
          key={b._id}
          className="bg-white rounded-xl shadow-lg overflow-hidden border flex flex-col md:flex-row"
        >

          {/*  LEFT PANEL (BOARDING STYLE) */}
          <div className="bg-blue-600 text-white p-5 flex flex-col justify-center items-center md:w-1/4">
            <h2 className="text-xl font-bold">
              {b.flight.flightNumber}
            </h2>

            <p className="text-sm mt-2">
              {new Date(b.date).toLocaleDateString()}
            </p>
          </div>

          {/*  RIGHT PANEL */}
          <div className="p-5 flex-1">

            {/* ROUTE + PRICE */}
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">
                {b.flight.from} → {b.flight.to}
              </h3>

              <span className="font-bold text-gray-700">
                ₹ {b.totalPrice}
              </span>
            </div>

            {/*  PASSENGERS */}
            <div className="mb-3">
              <p className="font-semibold mb-1">Passengers:</p>

              {b.passengers.map((p, index) => (
                <div
                  key={index}
                  className="text-sm text-gray-600 ml-2"
                >
                  • {p.name} ({p.age}, {p.gender})
                </div>
              ))}
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 mt-4">

              <button
                onClick={() => cancelBooking(b._id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Cancel
              </button>

              <button
                onClick={() => downloadTicket(b)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Download Ticket
              </button>

            </div>

          </div>
        </div>

      ))}
    </div>
  </div>
);
};

export default MyBookings;