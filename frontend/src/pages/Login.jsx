import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    console.log('Signing in with:', { email, password });
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        console.log("Login successful, token:", data.token);
        navigate('/');
      }
      else {
        alert(data.message || "Login failed");
      }
    }
    catch (err) {
      console.error("Login error:", err.message);
      alert("Login failed. Please check your credentials.");
    }

  }

  const navigateToSignUp = () => {
    navigate('/SignUp');
  }

  return (
    <div className="relative min-h-screen bg-gray-100 flex items-center justify-center font-sans overflow-hidden">
      {/* 💸 Floating Currency Background - Structured Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none grid grid-cols-4 gap-20 justify-items-center items-center">
        {['₹', '$', '€', '₿', '¥', '£', '₽', '₩', '₦', '₺', '₪', '₴'].map((symbol, i) => (
          <span
            key={i}
            className="text-gray-500 text-4xl opacity-30 animate-float-slow"
          >
            {symbol}
          </span>
        ))}
      </div>


      {/* Login Card */}
      <div className="relative z-10 bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">FinTrack</h1>
          <p className="text-gray-500 mt-2">Your personal finance tracker</p>
        </div>

        <form className="space-y-6" onSubmit={handleSignIn}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-900">
              <input type="checkbox" className="h-4 w-4 text-black border-gray-300 rounded mr-2" />
              Remember me
            </label>
            <a href="#" className="text-sm font-medium text-black hover:underline">
              Forgot your password?
            </a>
          </div>

          <button
            type="submit" 
            className="w-full py-2 px-4 bg-black text-white rounded-lg text-lg font-medium hover:bg-gray-800 transition"
          >
            Sign in
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/signup" className="font-medium text-black hover:underline">
            Sign up
          </a>
        </div>
      </div>

      {/* ✨ Float animation keyframes */}
      <style>
        {`
        @keyframes float-slow {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
      }

      .animate-float-slow {
        animation: float-slow 5s ease-in-out infinite;
      }
      `}
      </style>

    </div>
  );
}

export default App;
