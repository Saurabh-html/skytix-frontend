import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import API from '../services/api';

const ProfileSidebar = ({ isOpen, onClose, showAlert }) => {
  const navigate = useNavigate();

  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem('user')) || {};
    } catch {
      return {};
    }
  };

  const [userData, setUserData] = useState(getUser());
  const [form, setForm] = useState({ name: '', age: '', gender: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({
      name: userData.name || '',
      age: userData.age || '',
      gender: userData.gender || ''
    });
  }, [userData]);

  useEffect(() => {
    if (isOpen) {
      setUserData(getUser());
    }
  }, [isOpen]);

  const safeError = () => 'Unable to process request. Please try again.';

  const handleUpdate = async () => {
    if (!form.name.trim()) {
      showAlert('Name cannot be empty', 'warning');
      return;
    }

    if (form.age && (isNaN(form.age) || Number(form.age) < 1)) {
      showAlert('Enter valid age', 'warning');
      return;
    }

    try {
      setLoading(true);

      const res = await API.put('/users/profile', form);

      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUserData(res.data.user);

      showAlert('Profile updated', 'success');
      onClose();

    } catch {
      showAlert(safeError(), 'danger');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-80 bg-white dark:bg-gray-900 z-50 shadow-lg transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-5 flex flex-col h-full text-gray-800 dark:text-gray-200">

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Profile</h2>
            <FaTimes className="cursor-pointer" onClick={onClose} />
          </div>

          <p className="text-sm text-gray-500 mb-3">{userData.email}</p>

          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 mb-3 rounded dark:bg-gray-800"
            placeholder="Name"
          />

          <input
            type="number"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
            className="border p-2 mb-3 rounded dark:bg-gray-800"
            placeholder="Age"
          />

          <select
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
            className="border p-2 mb-4 rounded dark:bg-gray-800"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <button
            onClick={handleUpdate}
            disabled={loading}
            className="bg-blue-600 text-white py-2 rounded mb-auto"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>

          <button
            onClick={logout}
            className="bg-red-500 text-white py-2 rounded mt-6"
          >
            Logout
          </button>

        </div>
      </div>
    </>
  );
};

export default ProfileSidebar;