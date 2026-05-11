import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#000000', '#3d3d3d', '#5a5a5a', '#777777', '#999999', '#bfbfbf'];

const SpendingPieChart = ({ selectedMonth, selectedYear }) => {
  const [spendingData, setSpendingData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/analytics/categories?month=${selectedMonth + 1
          }&year=${selectedYear}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

        if (!res.ok) throw new Error('Failed to fetch categories');
        const { categories } = await res.json();

        const data = categories.map((c, index) => ({
          name: c.category,
          value: c.total,
          color: COLORS[index % COLORS.length],
          percentage: c.percentage,
        }));

        setSpendingData(data);
      } catch (err) {
        console.error('Error fetching transactions:', err.message);
      }
      finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [selectedMonth, selectedYear]);

  if (loading) return <p className="text-sm text-gray-400 text-center py-8">Loading...</p>;
  if (!spendingData.length)
    return <p className="text-sm text-gray-400 text-center py-8">No expense data for this month.</p>;

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
          <Tooltip formatter={(val) => `₹${val.toLocaleString()}`} />
        </PieChart>
      </ResponsiveContainer>

      <div className="sm:ml-8 mt-4 sm:mt-0">
        {spendingData.map((entry, index) => (
          <p key={`legend-${index}`} className="flex items-center text-sm text-gray-700 mb-1">
            <span
              className="inline-block w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: entry.color }}
            />
            {entry.name} (₹{entry.value.toLocaleString()} — {entry.percentage}%)
          </p>
        ))}
      </div>
    </div>
  );
};

export default SpendingPieChart;
