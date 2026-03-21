import { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';


const Register = ({showAlert}) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post('/users/register', form);
      showAlert('User Registered Successfully', 'success');
      navigate('/');
      console.log(res.data);
    } catch (err) {
      showAlert(err.response?.data?.message || 'Invalid credentials', 'danger');
    }
  };

  return (
  <div style={{ maxWidth: '400px', margin: '50px auto' }}>
    <h2 style={{ textAlign: 'center' }}>Register</h2>

    <form onSubmit={handleSubmit}>
      <input
        name="name"
        placeholder="Name"
        onChange={handleChange}
        style={{
          width: '100%',
          margin: '10px 0',
          padding: '10px',
          borderRadius: '5px',
          border: '1px solid #ccc'
        }}
      />

      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
        style={{
          width: '100%',
          margin: '10px 0',
          padding: '10px',
          borderRadius: '5px',
          border: '1px solid #ccc'
        }}
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
        style={{
          width: '100%',
          margin: '10px 0',
          padding: '10px',
          borderRadius: '5px',
          border: '1px solid #ccc'
        }}
      />

      <button
        type="submit"
        style={{
          width: '100%',
          padding: '10px',
          background: '#28a745',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Register
      </button>
    </form>
  </div>
);
};

export default Register;