import { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const Register = ({ showAlert }) => {

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const safeError = () => 'Unable to register. Please try again.';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      showAlert('All fields are required', 'warning');
      return;
    }

    if (form.password.length < 6) {
      showAlert('Password must be at least 6 characters', 'warning');
      return;
    }

    try {
      setLoading(true);

      await API.post('/users/register', form);

      showAlert('Registration successful', 'success');

      navigate('/login');

    } catch {
      showAlert(safeError(), 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-12 bg-white p-6 shadow rounded">

      <h2 className="text-center text-xl font-bold mb-4">
        Register
      </h2>

      <form onSubmit={handleSubmit}>

        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
        />

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
          className="w-full p-2 mb-4 border rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

      </form>
    </div>
  );
};

export default Register;