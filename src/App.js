import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Flights from './pages/Flights';
import MyBookings from './pages/MyBookings';
import ForgotPassword from './pages/ForgotPassword';
import About from './pages/About';
import AdminDashboard from './pages/AdminDashboard';

import { useState, useEffect } from 'react';
import Alert from './components/Alert';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const ErrorFallback = () => (
  <div className="h-screen flex items-center justify-center text-center">
    <div>
      <h2 className="text-2xl font-bold text-red-600">Something went wrong</h2>
      <p className="text-gray-500 mt-2">Please refresh the page</p>
    </div>
  </div>
);

const Layout = () => {

  const [alert, setAlert] = useState(null);
  const location = useLocation();

  const hideNavbarRoutes = ['/login', '/register', '/forgot-password'];

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 1500);
  };

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && (
        <Navbar
          showAlert={showAlert}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      )}

      <Alert alert={alert} />

      <Routes>

        <Route path="/login" element={<Login showAlert={showAlert} />} />
        <Route path="/register" element={<Register showAlert={showAlert} />} />
        <Route path="/forgot-password" element={<ForgotPassword showAlert={showAlert} />} />

        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/flights" element={<PrivateRoute><Flights showAlert={showAlert} /></PrivateRoute>} />
        <Route path="/my-bookings" element={<PrivateRoute><MyBookings showAlert={showAlert} /></PrivateRoute>} />
        <Route path="/about" element={<PrivateRoute><About /></PrivateRoute>} />

        <Route path="/admin" element={
          <ProtectedAdminRoute>
            <AdminDashboard showAlert={showAlert} />
          </ProtectedAdminRoute>
        } />

        <Route path="*" element={<ErrorFallback />} />

      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;