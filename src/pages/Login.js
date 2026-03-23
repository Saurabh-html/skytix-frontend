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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post('/users/login', form);

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));

      showAlert('Login successful', 'success');

      navigate('/');

    } catch (err) {
      showAlert(err.response?.data?.message || 'Error', 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#f5f5f5'
    }}>
      <div style={{
        background: '#fff',
        padding: '30px',
        borderRadius: '10px',
        width: '350px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
      }}>
        <h2 style={{ textAlign: 'center' }}>✈️ Skytix Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            style={{ width: '100%', margin: '10px 0', padding: '10px' }}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            style={{ width: '100%', margin: '10px 0', padding: '10px' }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
            <Link to="/register">New user? Register</Link>
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button
            disabled={loading}
            style={{
              width: '100%',
              marginTop: '15px',
              padding: '10px',
              background: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;