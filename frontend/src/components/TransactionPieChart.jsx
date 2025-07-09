import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#000000', '#3d3d3d', '#5a5a5a', '#777777', '#999999', '#bfbfbf'];

const SpendingPieChart = ({selectedMonth, selectedYear}) => {
  const [spendingData, setSpendingData] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:4000/api/transactions', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch transactions');
        const transactions = await res.json();

        const filtered = transactions.filter((tx) => {
          const date = new Date(tx.date);
          return (
            date.getMonth() === selectedMonth &&
            date.getFullYear() === selectedYear &&
            tx.type.toLowerCase() === 'expense'
          );
        });

        const expenseByCategory = {};

        filtered.forEach(tx => {
            const category = tx.category || 'Others';
            const amount = Math.abs(tx.amount);   
            expenseByCategory[category] = (expenseByCategory[category] || 0) + amount;
        });

        const totalSpent = Object.values(expenseByCategory).reduce((sum, val) => sum + val, 0);

        const data = Object.entries(expenseByCategory).map(([name, value], index) => ({
          name,
          value,
          color: COLORS[index % COLORS.length],
          percentage: ((value / totalSpent) * 100).toFixed(1),
        }));

        setSpendingData(data);
      } catch (err) {
        console.error('Error fetching transactions:', err.message);
      }
    };

    fetchTransactions();
  }, [selectedMonth, selectedYear]);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={spendingData}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {spendingData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <div className="sm:ml-8 mt-4 sm:mt-0">
        {spendingData.map((entry, index) => (
          <p key={`legend-${index}`} className="flex items-center text-sm text-gray-700 mb-1">
            <span
              className="inline-block w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: entry.color }}
            ></span>
            {entry.name} (₹{entry.value.toLocaleString()} - {entry.percentage}%)
          </p>
        ))}
      </div>
    </div>
  );
};

export default SpendingPieChart;
