import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ProfileSidebar from './ProfileSidebar';

const Navbar = ({ showAlert }) => {
  const navigate = useNavigate();

  // 🔥 SAFE + REACTIVE USER
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null
  );

  const [openProfile, setOpenProfile] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );

  // 🔄 Sync user (important after profile update)
  useEffect(() => {
    const syncUser = () => {
      setUser(JSON.parse(localStorage.getItem('user')));
    };

    window.addEventListener('storage', syncUser);

    return () => window.removeEventListener('storage', syncUser);
  }, []);

  // 🌙 APPLY THEME
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <>
      <nav className="bg-white dark:bg-gray-900 shadow-md px-4 sm:px-6 py-3 flex flex-col sm:flex-row justify-between items-center gap-3 max-w-6xl mx-auto">

        {/* LOGO */}
        <h2
          onClick={() => navigate('/')}
          className="text-xl font-bold text-blue-600 cursor-pointer"
        >
          ✈️ Skytix
        </h2>

        {/* LINKS */}
        <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 text-gray-700 dark:text-gray-200 font-medium">

          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/flights" className="hover:text-blue-600">Flights</Link>
          <Link to="/my-bookings" className="hover:text-blue-600">My Bookings</Link>
          <Link to="/about" className="hover:text-blue-600">About</Link>

          {user?.role === 'admin' && (
            <Link to="/admin" className="hover:text-blue-600">Admin</Link>
          )}

          {/* DARK MODE */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="border px-2 py-1 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {darkMode ? 'Light' : 'Dark'}
          </button>

          {/* PROFILE BUTTON */}
          {user && (
            <button
              onClick={() => setOpenProfile(true)}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
            >
              You
            </button>
          )}

        </div>
      </nav>

      {/* PROFILE SIDEBAR */}
      <ProfileSidebar
        isOpen={openProfile}
        onClose={() => setOpenProfile(false)}
        showAlert={showAlert}
      />
    </>
  );
};

export default Navbar;