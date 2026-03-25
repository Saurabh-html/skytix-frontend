const About = () => {
  return (
  <div className="max-w-5xl mx-auto p-4 sm:p-6 bg-gray-100 text-gray-800 min-h-screen">

    <div className="bg-white rounded-lg shadow-md p-6 sm:p-10 border">

      <h1 className="text-3xl font-bold text-blue-600 mb-4 text-center">
        About Skytix ✈️
      </h1>

      <p className="text-gray-600 text-center mb-8">
        A modern airline booking platform designed for seamless travel experience.
      </p>

      {/* FEATURES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="p-4 border rounded bg-gray-50">
          <h3 className="font-bold mb-2 text-gray-800">✈️ Flight Booking</h3>
          <p className="text-gray-600 text-sm">
            Search and book flights with real-time seat availability and pricing.
          </p>
        </div>

        <div className="p-4 border rounded bg-gray-50">
          <h3 className="font-bold mb-2 text-gray-800">📄 Smart Bookings</h3>
          <p className="text-gray-600 text-sm">
            Manage bookings, cancel passengers selectively, and download tickets.
          </p>
        </div>

        <div className="p-4 border rounded bg-gray-50">
          <h3 className="font-bold mb-2 text-gray-800">📊 Admin Dashboard</h3>
          <p className="text-gray-600 text-sm">
            Powerful admin tools for managing flights and monitoring analytics.
          </p>
        </div>

        <div className="p-4 border rounded bg-gray-50">
          <h3 className="font-bold mb-2 text-gray-800">⚡ Real-Time System</h3>
          <p className="text-gray-600 text-sm">
            Date-wise seat tracking, instant updates, and accurate availability.
          </p>
        </div>

      </div>

      {/* FOOTER */}
      <div className="mt-10 text-center text-gray-500 text-sm">
        Built with ❤️ using MERN Stack • Designed for real-world scalability
      </div>

    </div>
  </div>
);
};

export default About;