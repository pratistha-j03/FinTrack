import React from 'react'
import { useState, useEffect } from 'react'
import { Search, Bell, ChevronDown } from 'lucide-react'

const Header = () => {

   const [user, setUser] = useState({});
    useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
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
       <header className="flex p-4 mb-4 relative right-0 bg-white shadow-md rounded-bl-xl rounded-br-xl">
            <div className="flex relative right-0 items-center space-x-2 ">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user.firstName?.charAt(0) ?? ''}{user.lastName?.charAt(0) ?? ''}
              </div>
              <span className="font-medium text-gray-800">{user.firstName+" "+user.lastName}</span>
            </div>
        
        </header>
    </div>
  )
}

export default Header
