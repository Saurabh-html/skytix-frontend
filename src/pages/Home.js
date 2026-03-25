import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
  <div className="bg-gray-100 text-gray-800 min-h-screen">

    <div className="flex flex-col items-center justify-center text-center px-4 py-20">

      <h1 className="text-4xl sm:text-5xl font-bold text-blue-600 mb-4">
        Welcome to Skytix
      </h1>

      <p className="text-gray-600 mb-8 text-lg max-w-xl">
        Book flights effortlessly, manage your journeys, and experience smarter travel.
      </p>

      <div className="flex gap-4 sm:gap-6 flex-wrap justify-center">
        <button
          onClick={() => navigate('/flights')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow"
        >
          Explore Flights
        </button>

        <button
          onClick={() => navigate('/my-bookings')}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition shadow"
        >
          My Bookings
        </button>
      </div>

    </div>

    <div className="max-w-5xl mx-auto px-6 pb-16 grid md:grid-cols-3 gap-6">

      <div className="bg-white p-5 rounded-lg shadow text-center border">
        <h3 className="font-semibold text-lg mb-2 text-gray-800">
          Smart Search
        </h3>
        <p className="text-gray-600 text-sm">
          Real-time flight availability with accurate seat tracking.
        </p>
      </div>

      <div className="bg-white p-5 rounded-lg shadow text-center border">
        <h3 className="font-semibold text-lg mb-2 text-gray-800">
          Easy Booking
        </h3>
        <p className="text-gray-600 text-sm">
          Smooth multi-passenger booking experience.
        </p>
      </div>

      <div className="bg-white p-5 rounded-lg shadow text-center border">
        <h3 className="font-semibold text-lg mb-2 text-gray-800">
          Flexible Cancellation
        </h3>
        <p className="text-gray-600 text-sm">
          Cancel tickets easily with seat restoration logic.
        </p>
      </div>

    </div>

  </div>
);
};

export default Home;