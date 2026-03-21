import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center max-w-6xl mx-auto">
      
      {/* Logo */}
      <h2 className="text-xl font-bold text-blue-600">✈️ Skytix</h2>

      {/* Links */}
      <div className="flex items-center gap-6 text-gray-700 font-medium">

        <Link to="/" className="no-underline hover:text-blue-600">
          Home
        </Link>

        <Link to="/about" className="no-underline hover:text-blue-600">
          About
        </Link>

        {/*  ADMIN LINK */}
        {user && user.role === 'admin' && (
          <Link to="/admin" className="no-underline hover:text-blue-600">
            Admin
          </Link>
        )}

        {/* ALWAYS LOGOUT */}
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