import { Navigate } from 'react-router-dom';

const ProtectedAdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  // ❌ Not logged in
  if (!token) {
    return <Navigate to="/login" />;
  }

  // ❌ Not admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  // ✅ Admin access
  return children;
};

export default ProtectedAdminRoute;