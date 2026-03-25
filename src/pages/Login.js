import { useState } from 'react';
import API from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

const Login = ({ showAlert }) => {

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const safeError = () => 'Unable to login. Please check your credentials.';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      showAlert('Enter email and password', 'warning');
      return;
    }

    try {
      setLoading(true);

      const res = await API.post('/users/login', form);

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));

      showAlert('Login successful', 'success');

      navigate('/');

    } catch {
      showAlert(safeError(), 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">

      <div className="bg-white p-6 rounded-lg w-80 shadow-lg">

        <h2 className="text-center text-xl font-bold mb-4">
          Skytix Login
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-2 mb-3 border rounded"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-2 mb-3 border rounded"
          />

          <div className="flex justify-between text-sm mb-2">
            <Link to="/register">Register</Link>
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

        </form>
      </div>

    </div>
  );
};

export default Login;