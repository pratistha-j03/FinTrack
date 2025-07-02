import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Search, Bell, ChevronDown, Plus, DollarSign, ArrowDown, ArrowUp, PiggyBank, Mail, Lock, UserCircle } from 'lucide-react'; 
import Sidebar from '../components/Sidebar'; 
import DashboardCards from '../components/DashboardCards'; 
import Header from '../components/Header'; 

const incomeExpensesData = [
  { name: 'Jan', Income: 4000, Expenses: 2400 },
  { name: 'Feb', Income: 3000, Expenses: 1398 },
  { name: 'Mar', Income: 2000, Expenses: 9800 },
  { name: 'Apr', Income: 2780, Expenses: 3908 },
  { name: 'May', Income: 1890, Expenses: 4800 },
  { name: 'Jun', Income: 2390, Expenses: 3800 },
  { name: 'Jul', Income: 3490, Expenses: 4300 },
];

const spendingData = [
  { name: 'Housing', value: 30, color: '#4A5568' },       
  { name: 'Food', value: 20, color: '#718096' },          
  { name: 'Transportation', value: 15, color: '#A0AEC0' }, 
  { name: 'Entertainment', value: 10, color: '#CBD5E0' }, 
  { name: 'Other', value: 25, color: '#E2E8F0' },        
];

const COLORS = spendingData.map(d => d.color); 

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Month');

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-auto p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            {/* <button className="flex items-center px-4 py-2 bg-black text-white rounded-lg shadow-md hover:bg-gray-800 transition-colors duration-200">
                <Plus className="mr-2" size={16} />
                Add Transaction
            </button> */}
          </div>

          <DashboardCards /> 

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
       
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Income vs Expenses</h3>
                <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                  {['Week', 'Month', 'Year'].map((period) => (
                    <button
                      key={period}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                        selectedPeriod === period
                          ? 'bg-black text-white shadow-sm'
                          : 'text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => setSelectedPeriod(period)}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={incomeExpensesData}
                  margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-sm text-gray-500" />
                  <YAxis axisLine={false} tickLine={false} className="text-sm text-gray-500" />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                    labelStyle={{ color: '#4A5568' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '10px' }} iconType="circle" />
                  <Line type="monotone" dataKey="Income" stroke="#4B5563" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} /> {/* Darker gray */}
                  <Line type="monotone" dataKey="Expenses" stroke="#9CA3AF" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} /> {/* Lighter gray */}
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Spending by Category</h3>
                <div className="relative">
                  <select
                    className="appearance-none bg-gray-100 border border-gray-300 text-gray-700 py-1 pl-3 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500 text-sm"
                  >
                    <option>This Month</option>
                    <option>Last Month</option>
                    <option>This Year</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={spendingData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {spendingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="sm:ml-8 mt-4 sm:mt-0">
                  {spendingData.map((entry, index) => (
                    <p key={`legend-${index}`} className="flex items-center text-sm text-gray-700 mb-1">
                      <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
                      {entry.name} ({entry.value} %)
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
      
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
