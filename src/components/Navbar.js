import { Link, useNavigate } from 'react-router-dom';



const Navbar = () => {
  const navigate = useNavigate();
  

  const user = JSON.parse(localStorage.getItem('user'));

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center max-w-6xl mx-auto">

      {/* LOGO */}
      <h2
        onClick={() => navigate('/')}
        className="text-xl font-bold text-blue-600 cursor-pointer"
      >
        ✈️ Skytix
      </h2>

      {/* LINKS */}
      <div className="flex items-center gap-6 text-gray-700 font-medium">

        <Link to="/" className="no-underline hover:text-blue-600">
          Home
        </Link>

        <Link to="/flights" className="no-underline hover:text-blue-600">
          Flights
        </Link>

        <Link to="/my-bookings" className="no-underline hover:text-blue-600">
          My Bookings
        </Link>

        <Link to="/about" className="no-underline hover:text-blue-600">
          About
        </Link>

        {/* ADMIN */}
        {user?.role === 'admin' && (
          <Link to="/admin" className="no-underline hover:text-blue-600">
            Admin
          </Link>
        )}

        {/* USER NAME */}
        {user && (
          <span className="text-sm text-gray-500">
            {user.name}
          </span>
        )}

        {/* LOGOUT */}
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>

      </div>
    </nav>
  );
};

export default Navbar;