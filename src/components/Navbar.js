import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ProfileSidebar from './ProfileSidebar';

const Navbar = ({ showAlert }) => {
  const navigate = useNavigate();

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch {
      return null;
    }
  })();

  const [openProfile, setOpenProfile] = useState(false);

  return (
    <>
      <nav className="bg-white shadow-md px-4 sm:px-6 py-3 flex justify-between items-center max-w-6xl mx-auto">

        <h2
          onClick={() => navigate('/')}
          className="text-xl font-bold text-blue-600 cursor-pointer"
        >
          Skytix
        </h2>

        <div className="flex items-center gap-3 sm:gap-4 text-gray-700 text-sm sm:text-base">

          <Link to="/" className="no-underline hover:text-blue-600">Home</Link>
          <Link to="/flights" className="no-underline hover:text-blue-600">Flights</Link>
          <Link to="/my-bookings" className="no-underline hover:text-blue-600">Bookings</Link>
          <Link to="/about" className="no-underline hover:text-blue-600">About</Link>

          {user?.role === 'admin' && (
            <Link to="/admin" className="no-underline hover:text-blue-600">Admin</Link>
          )}

          {user && (
            <button
              onClick={() => setOpenProfile(true)}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              You
            </button>
          )}

        </div>
      </nav>

      <ProfileSidebar
        isOpen={openProfile}
        onClose={() => setOpenProfile(false)}
        showAlert={showAlert}
      />
    </>
  );
};

export default Navbar;