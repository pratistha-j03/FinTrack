import React from 'react';
import { AiFillHome, AiOutlineTransaction, AiOutlineSetting } from 'react-icons/ai';
import { FaMoneyBillWave, FaUserAlt } from 'react-icons/fa'; 
import { Link } from 'react-router-dom'; 
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
        <ul className="space-y-8">
          <li>
            <Link to="/" className="flex items-center space-x-3 hover:text-gray-300">
              <AiFillHome className="text-xl" />
              <span>Dashboard</span>
            </Link>
          </li>

          <li>
            <Link to="/Transaction" className="flex items-center space-x-3 hover:text-gray-300">
              <AiOutlineTransaction className="text-xl" />
              <span>Transactions</span>
            </Link>
          </li>

          <li>
            <Link to="/Budget" className="flex items-center space-x-3 hover:text-gray-300">
              <FaMoneyBillWave className="text-xl" />
              <span>Budget</span>
            </Link>
          </li>

          <li>
            <Link to="/Profile" className="flex items-center space-x-3 hover:text-gray-300 pt-4">
              <FaUserAlt className="text-xl" />
              <span>Profile</span>
            </Link>
          </li>

          <li>
            <Link to="/Settings" className="flex items-center space-x-3 hover:text-gray-300">
              <AiOutlineSetting className="text-xl" />
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </div>

      <div className="text-sm pt-6 border-t border-gray-700">
        <p>{user.firstName+" "+user.lastName}</p>
        <p className="text-gray-400">{user.email}</p>
      </div>
    </div>
  );
};

export default Sidebar;
