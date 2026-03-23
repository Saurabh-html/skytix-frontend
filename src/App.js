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

import { useState } from 'react';
import Alert from './components/Alert';


// 🔐 PRIVATE ROUTE
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};


const Layout = () => {
  const [alert, setAlert] = useState(null);
  const location = useLocation();

  const hideNavbarRoutes = ['/login', '/register', '/forgot-password'];

  const showAlert = (message, type) => {
    setAlert({ message, type });

    setTimeout(() => {
      setAlert(null);
    }, 1500);
  };

  return (
    <>
      {/* NAVBAR */}
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}

      <Alert alert={alert} />

      <Routes>

        {/* PUBLIC */}
        <Route path="/login" element={<Login showAlert={showAlert} />} />
        <Route path="/register" element={<Register showAlert={showAlert} />} />
        <Route path="/forgot-password" element={<ForgotPassword showAlert={showAlert} />} />

        {/* PRIVATE */}
        <Route path="/" element={
          <PrivateRoute>
            <Home showAlert={showAlert} />
          </PrivateRoute>
        } />

        <Route path="/flights" element={
          <PrivateRoute>
            <Flights showAlert={showAlert} />
          </PrivateRoute>
        } />

        <Route path="/my-bookings" element={
          <PrivateRoute>
            <MyBookings showAlert={showAlert} />
          </PrivateRoute>
        } />

        <Route path="/about" element={
          <PrivateRoute>
            <About />
          </PrivateRoute>
        } />

        {/* 🔥 ADMIN (SECURE) */}
        <Route path="/admin" element={
          <ProtectedAdminRoute>
            <AdminDashboard showAlert={showAlert} />
          </ProtectedAdminRoute>
        } />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />

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