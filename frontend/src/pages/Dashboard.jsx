import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Search, Bell, ChevronDown, Plus, DollarSign, ArrowDown, ArrowUp, PiggyBank, Mail, Lock, UserCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import DashboardCards from '../components/DashboardCards';
import Header from '../components/Header';
import TransactionPieChart from '../components/TransactionPieChart'; // Assuming this is the component for the pie chart
import ScrollingBanner from '../components/ScrollingBanner';

// const incomeExpensesData = [
//   { name: 'Jan', Income: 4000, Expenses: 2400 },
//   { name: 'Feb', Income: 3000, Expenses: 1398 },
//   { name: 'Mar', Income: 2000, Expenses: 9800 },
//   { name: 'Apr', Income: 2780, Expenses: 3908 },
//   { name: 'May', Income: 1890, Expenses: 4800 },
//   { name: 'Jun', Income: 2390, Expenses: 3800 },
//   { name: 'Jul', Income: 3490, Expenses: 4300 },
// ];

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Month');
  const [incomeExpensesData, setIncomeExpensesData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch transactions');

      const transactions = await res.json();

      const now = new Date();
      const lastSixMonths = Array.from({ length: 6 }).map((_, idx) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (5 - idx), 1);
        return {
          month: d.getMonth(), // 0-indexed
          year: d.getFullYear(),
          label: d.toLocaleString('default', { month: 'short', year: 'numeric' }), // e.g. Jul 2025
        };
      });

      const groupedData = lastSixMonths.map(({ month, year, label }) => {
        const monthTransactions = transactions.filter((tx) => {
          const date = new Date(tx.date);
          return date.getMonth() === month && date.getFullYear() === year;
        });

        const income = monthTransactions
          .filter((tx) => tx.amount > 0)
          .reduce((sum, tx) => sum + tx.amount, 0);

        const expenses = monthTransactions
          .filter((tx) => tx.amount < 0)
          .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

        return {
          name: label, // for X-axis
          Income: income,
          Expenses: expenses,
        };
      });

      console.log("Final Chart Data:", groupedData);
      setIncomeExpensesData(groupedData);
    } catch (err) {
      console.error('Error fetching transactions:', err.message);
    }
  };

  fetchTransactions();
}, []);


  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-auto p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <div className="mb-4">
              <label className="text-sm text-gray-600 mr-2">Select Month:</label>
              <input
                type="month"
                className="border border-gray-300 rounded px-2 py-1 text-sm"
                value={`${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`}
                onChange={(e) => {
                  const [year, month] = e.target.value.split('-').map(Number);
                  setSelectedYear(year);
                  setSelectedMonth(month - 1); // JS months are 0-indexed
                }}
              />
            </div>
          </div>

          <DashboardCards selectedMonth={selectedMonth} selectedYear={selectedYear} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Income vs Expenses</h3>
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
                
              </div>
              <TransactionPieChart selectedMonth={selectedMonth} selectedYear={selectedYear} />
            </div>
          </div><br/><br/>

          
          <ScrollingBanner />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
