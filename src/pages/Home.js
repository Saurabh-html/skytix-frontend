import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="h-[calc(100vh-70px)] bg-gray-100 flex flex-col items-center justify-center text-center px-4 overflow-hidden">

      <h1 className="text-4xl font-bold text-blue-600 mb-4">
        Welcome to Skytix ✈️
      </h1>

      <p className="text-gray-600 mb-8">
        Book flights, manage bookings and travel smarter.
      </p>

      <div className="flex gap-6">
        <button
          onClick={() => navigate('/flights')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          ✈️ View Flights
        </button>

        <button
          onClick={() => navigate('/my-bookings')}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
        >
          📄 My Bookings
        </button>
      </div>
    </div>
  );
};

export default Home;