import React, { Profiler } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import Transaction from './pages/Transaction'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Budget from './pages/Budget'
import SignUp from './pages/SignUp'
import { Sidebar } from 'lucide-react'



const App = () => {
   return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Budget" element={<Budget />} />
        <Route path="/Transaction" element={<Transaction />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App
