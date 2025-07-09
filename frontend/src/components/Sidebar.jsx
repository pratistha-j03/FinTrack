import React from 'react';
import { AiFillHome, AiOutlineTransaction, AiOutlineSetting } from 'react-icons/ai';
import { FaMoneyBillWave, FaUserAlt } from 'react-icons/fa'; 
import { NavLink } from 'react-router-dom'; 
import { useEffect, useState } from 'react';


const Sidebar = () => {

  const [user, setUser] = useState({});
  useEffect(() => {
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4000/api/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch user');
      }

      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error('User fetch error:', err.message);
    }
  };

  fetchUser();
}, []);

return (
  <div className="w-64 min-h-screen bg-black text-white flex flex-col justify-between p-4">
    <div>
      <h1 className="text-3xl font-bold mt-2 mb-14">FinTrack</h1>
      <ul className="space-y-3">
        {/* Reusable link styling */}
        {[
          { to: '/', label: 'Dashboard', icon: <AiFillHome className="text-xl" /> },
          { to: '/Transaction', label: 'Transactions', icon: <AiOutlineTransaction className="text-xl" /> },
          { to: '/Budget', label: 'Budget', icon: <FaMoneyBillWave className="text-xl" /> },
          { to: '/Profile', label: 'Profile', icon: <FaUserAlt className="text-xl" /> },
        ].map(({ to, label, icon }) => (
          <li key={label}>
            <NavLink
              to={to}
              end
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300 ${
                  isActive
                    ? 'bg-gray-100 text-black shadow-inner'
                    : 'hover:bg-gray-800 hover:text-gray-200'
                }`
              }
            >
              {icon}
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>

    <div className="text-sm pt-6 border-t border-gray-700">
      <p>{user.firstName + ' ' + user.lastName}</p>
      <p className="text-gray-400">{user.email}</p>
    </div>
  </div>
);

};

export default Sidebar;
