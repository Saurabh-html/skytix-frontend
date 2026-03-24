import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-100 min-h-[calc(100vh-70px)]">

      {/* HERO */}
      <div className="flex flex-col items-center justify-center text-center px-4 py-20">

        <h1 className="text-5xl font-bold text-blue-600 mb-4">
          Welcome to Skytix ✈️
        </h1>

        <p className="text-gray-600 mb-8 text-lg max-w-xl">
          Book flights effortlessly, manage your journeys, and experience smarter travel with Skytix.
        </p>

        <div className="flex gap-6 flex-wrap justify-center">
          <button
            onClick={() => navigate('/flights')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow"
          >
            ✈️ Explore Flights
          </button>

          <button
            onClick={() => navigate('/my-bookings')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition shadow"
          >
            📄 My Bookings
          </button>
        </div>

      </div>

      {/* FEATURES */}
      <div className="max-w-5xl mx-auto px-6 pb-16 grid md:grid-cols-3 gap-6">

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow text-center">
          <h3 className="font-semibold text-lg mb-2">Smart Search</h3>
          <p className="text-gray-500 text-sm">
            Find flights instantly with date-based availability and real-time seat updates.
          </p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow text-center">
          <h3 className="font-semibold text-lg mb-2">Easy Booking</h3>
          <p className="text-gray-500 text-sm">
            Book multiple passengers with smooth experience just like real airline apps.
          </p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow text-center">
          <h3 className="font-semibold text-lg mb-2">Flexible Cancellation</h3>
          <p className="text-gray-500 text-sm">
            Cancel individual tickets easily and manage bookings effortlessly.
          </p>
        </div>

      </div>

    </div>
  );
};

export default Home;