import React, { useEffect, useState } from 'react';

const BudgetOverview = ({ month, year }) => {
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchBudgetsAndTransactions = async () => {
      try {
        const token = localStorage.getItem('token');

        const [budgetRes, transactionRes] = await Promise.all([
          fetch('http://localhost:4000/api/budgets', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch('http://localhost:4000/api/transactions', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (!budgetRes.ok || !transactionRes.ok) {
          throw new Error('Failed to fetch budget or transaction data');
        }

        const [budgetData, transactionData] = await Promise.all([
          budgetRes.json(),
          transactionRes.json(),
        ]);

        // Filter by month and year
        const filteredBudgets = budgetData.filter((b) => {
          const bDate = new Date(b.startDate);
          return bDate.getMonth() === month && bDate.getFullYear() === year;
        });

        const filteredTransactions = transactionData.filter((t) => {
          const tDate = new Date(t.date);
          return tDate.getMonth() === month && tDate.getFullYear() === year;
        });

        setBudgets(filteredBudgets);
        setTransactions(filteredTransactions);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };

    fetchBudgetsAndTransactions();
  }, [month, year]);

  const totalDays = 31; // Placeholder for now

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const spent = transactions
    .filter((txn) => txn.type.toLowerCase() === 'expense')
    .reduce((sum, txn) => sum + Math.abs(txn.amount), 0);
  const remaining = totalBudget - spent;

  const dailyAverage = totalDays > 0 ? (spent / totalDays).toFixed(2) : 0;
  const dailyTarget = totalDays > 0 ? (totalBudget / totalDays).toFixed(2) : 0;
  const dailyProgressPercentage = (dailyAverage / dailyTarget) * 100;

  const spentPercentage = (spent / totalBudget) * 100;
  // const savedPercentage = (saved / savingsGoal) * 100;

  return (
    <div className="bg-white rounded-lg p-5 shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Budget Overview</h2>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-700"></span> Spent
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-300"></span> Remaining
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-5">{`${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}`}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-base font-medium text-gray-700 mb-2">Total Budget</h3>
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-3xl font-bold text-gray-900">₹{totalBudget.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden mb-1">
            <div
              className="bg-gray-700 h-full rounded-full"
              style={{ width: `${spentPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>₹{spent.toLocaleString()} spent</span>
            <span>₹{remaining.toLocaleString()}</span>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-base font-medium text-gray-700 mb-2">Daily Average</h3>
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-3xl font-bold text-gray-900">₹{dailyAverage} / day</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden mb-1">
            <div
              className="bg-gray-600 h-full rounded-full"
              style={{ width: `${dailyProgressPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span className="text-gray-700 font-semibold">
              ₹{Math.max(0, dailyTarget - dailyAverage).toFixed(2)} under daily target
            </span>
            <span>Target: ₹{dailyTarget}</span>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default BudgetOverview;
