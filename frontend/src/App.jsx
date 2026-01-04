import React, { Profiler } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import Transaction from './pages/Transaction'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Budget from './pages/Budget'
import SignUp from './pages/SignUp'
import { Sidebar } from 'lucide-react'
import ProtectedRoute from './components/ProtectedRoute'

const App = () => {
   return (
    <Router>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/Profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/Budget" element={<ProtectedRoute><Budget /></ProtectedRoute>} />
        <Route path="/Transaction" element={<ProtectedRoute><Transaction /></ProtectedRoute>} />
        <Route path="/Login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App
