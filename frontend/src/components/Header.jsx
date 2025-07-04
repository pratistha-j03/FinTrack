import React from 'react'
import { useState, useEffect } from 'react'
import { Search, Bell, ChevronDown } from 'lucide-react'

const Header = () => {

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
    <div>
       <header className="flex items-center justify-between p-4 mb-4 bg-white shadow-md rounded-bl-xl rounded-br-xl">
          <div className="relative flex items-center w-1/3">
            <Search className="absolute left-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="text-gray-600 cursor-pointer" size={20} />
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user.firstName?.charAt(0) ?? ''}{user.lastName?.charAt(0) ?? ''}
              </div>
              <span className="font-medium text-gray-800">{user.firstName+" "+user.lastName}</span>
              <ChevronDown className="text-gray-600" size={16} />
            </div>
          </div>
        </header>
    </div>
  )
}

export default Header
