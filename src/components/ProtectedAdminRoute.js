import { Navigate } from 'react-router-dom';

const ProtectedAdminRoute = ({ children }) => {
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch {
    user = null;
  }

  const token = localStorage.getItem('token');

  if (!token) return <Navigate to="/login" />;

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedAdminRoute;