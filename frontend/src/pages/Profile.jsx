import React, { useState, useEffect } from 'react';
import { Search, Bell, ChevronDown, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

function App() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState(' ');
  const [lastName, setLastName] = useState(' ');
  const [email, setEmail] = useState(' ');
  const [phoneNumber, setPhoneNumber] = useState(' ');
  const [currency, setCurrency] = useState('INR');
  const [memberSince, setMemberSince] = useState(' ');
  const [totalTransactions, setTotalTransactions] = useState(0);

  useEffect(() => {
    const getProfile = async () => {
      const token = localStorage.getItem('token');

      try {
        const res = await fetch('http://localhost:4000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();
        console.log('Profile data:', data);

        setFirstName(data.firstName || ' ');
        setLastName(data.lastName || ' ');
        setEmail(data.email || ' ');
        setPhoneNumber(data.phoneNumber || '');
        setMemberSince(data.createdAt ? new Date(data.createdAt).toLocaleDateString() : ' ');
        setTotalTransactions(data.transactions ? data.transactions.length : 0);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };

    getProfile();
  }, []);

  const handleSaveChanges = async () => {
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://localhost:4000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName,
          lastName,
          phoneNumber,
          
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert('Profile updated!');
      } else {
        alert(data.message || 'Update failed');
      }
    } catch (err) {
      console.error('Update failed:', err);
      alert('Something went wrong');
    }
  };

  const handleChangePassword = () => {
    console.log('Changing password...');

  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
      if (!confirmDelete) return;

  try {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:4000/api/users/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to delete account');
    }

    localStorage.removeItem('token');
    alert('Account deleted successfully.');
    navigate('/login');
  } catch (error) {
    console.error('Error deleting account:', error.message);
    alert(`Error: ${error.message}`);
  }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/login');
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans">

      <Sidebar />


      <div className="flex-1 flex flex-col overflow-hidden">

        <main className="flex-1 overflow-auto p-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
            <p className="text-gray-500 mt-1">Manage your account settings</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

              <div className="md:col-span-2 bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="emailAddress" className="block text-sm font-medium text-gray-700 mb-1">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="emailAddress"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    readOnly
                  />
                </div>

                <div className="mt-4">
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>

                <div className="mt-4">
                  <label htmlFor="defaultCurrency" className="block text-sm font-medium text-gray-700 mb-1">
                    Default currency
                  </label>
                  <div className="relative">
                    <select
                      id="defaultCurrency"
                      className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                    >
                      <option value="INR">INR - Indian Rupee</option>

                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSaveChanges}
                    className="px-6 py-2 bg-black text-white rounded-lg shadow-md hover:bg-gray-800 transition-colors duration-200"
                  >
                    Save Changes
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
                  {firstName[0]+lastName[0]}
                </div>
                <h4 className="text-lg font-semibold text-gray-800">{firstName+" "+lastName}</h4>
                <p className="text-gray-500 text-sm mb-4">{email}</p>

                <div className="w-full space-y-3 text-left text-gray-700 text-sm">
                  <p>
                    <span className="font-medium">Member since:</span> {memberSince}
                  </p>
                  <p>
                    <span className="font-medium">Total transactions:</span> {totalTransactions}
                  </p>
                  {/* <p>
                    <span className="font-medium">Last login:</span> {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                  </p> */}
                </div>

                <div className="w-full mt-6 space-y-3">
                  <button
                    onClick={handleChangePassword}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-gray-800 font-medium"
                  >
                    Change Password
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-gray-800 font-medium"
                  >
                    Logout
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="w-full px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200 font-medium"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}


export default App;
