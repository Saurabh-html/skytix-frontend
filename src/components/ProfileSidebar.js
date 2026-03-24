import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const ProfileSidebar = ({ isOpen, onClose, showAlert }) => {
  const navigate = useNavigate();

  // 🔥 REACTIVE USER
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem('user')) || {}
  );

  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: ''
  });

  const [loading, setLoading] = useState(false);

  // 🔄 Sync form with user
  useEffect(() => {
    setForm({
      name: userData?.name || '',
      age: userData?.age || '',
      gender: userData?.gender || ''
    });
  }, [userData]);

  // 🔄 Sync with localStorage updates
  useEffect(() => {
    const syncUser = () => {
      const updated = JSON.parse(localStorage.getItem('user')) || {};
      setUserData(updated);
    };

    window.addEventListener('storage', syncUser);
    return () => window.removeEventListener('storage', syncUser);
  }, []);

  const handleUpdate = async () => {
    if (!form.name.trim()) {
      showAlert('Name cannot be empty', 'warning');
      return;
    }

    if (form.age && (isNaN(form.age) || form.age < 1)) {
      showAlert('Enter valid age', 'warning');
      return;
    }

    try {
      setLoading(true);

      const res = await API.put('/users/profile', form);

      // 🔥 IMPORTANT FIX
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUserData(res.data.user);

      showAlert('Profile updated', 'success');

      onClose(); // ✅ close sidebar after update

    } catch (err) {
      showAlert(err.response?.data?.message || 'Error', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login'); // ✅ SPA safe
  };

  return (
    <>
      {/* OVERLAY */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
        />
      )}

      {/* SIDEBAR */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-80 bg-white dark:bg-gray-900 z-50 shadow-lg transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>

        <div className="p-5 flex flex-col h-full text-gray-800 dark:text-gray-200">

          <h2 className="text-xl font-bold mb-4">Your Profile</h2>

          {/* EMAIL */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            {userData?.email}
          </p>

          {/* NAME */}
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 mb-3 rounded dark:bg-gray-800"
            placeholder="Name"
          />

          {/* AGE */}
          <input
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
            className="border p-2 mb-3 rounded dark:bg-gray-800"
            placeholder="Age"
          />

          {/* GENDER */}
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

          {/* UPDATE */}
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="bg-blue-600 text-white py-2 rounded mb-auto hover:bg-blue-700 transition"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>

          {/* LOGOUT */}
          <button
            onClick={logout}
            className="bg-red-500 text-white py-2 rounded mt-6 hover:bg-red-600 transition"
          >
            Logout
          </button>

        </div>
      </div>
    </>
  );
};

export default ProfileSidebar;