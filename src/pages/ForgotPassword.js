import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const ForgotPassword = ({showAlert})=> {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    //  Check password match
    if (password !== confirmPassword) {
      showAlert('Passwords do not match', 'danger' );

    try {
      await API.put('/users/reset-password', {
        email,
        newPassword: password
      });

      showAlert('Password Updated Successfully', 'success');

      //  Redirect to login
      setTimeout(() => {
        navigate('/login');
      }, 1000);

    } catch (err) {
      showAlert(err.response?.data?.message || 'Error', 'danger');
    }
  };
  }
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ textAlign: 'center' }}>Reset Password</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />

          <input
            type="password"
            placeholder="Enter New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={inputStyle}
            required
          />

          <button
            type="submit"
            disabled={password !== confirmPassword}
            style={{
              ...buttonStyle,
              background: password !== confirmPassword ? '#ccc' : '#28a745'
            }}
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

/*  Styles */

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  background: '#f5f5f5'
};

const cardStyle = {
  background: '#fff',
  padding: '30px',
  borderRadius: '10px',
  width: '350px',
  boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
};

const inputStyle = {
  width: '100%',
  margin: '10px 0',
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc'
};

const buttonStyle = {
  width: '100%',
  padding: '10px',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};

export default ForgotPassword;