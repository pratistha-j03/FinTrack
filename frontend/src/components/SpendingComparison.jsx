import React, { useEffect, useState } from 'react';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,} from 'recharts';

const SpendingComparison = ({ selectedMonth, selectedYear }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/analytics/spending-comparison?month=${
            selectedMonth + 1
          }&year=${selectedYear}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error('Failed to fetch spending comparison');
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedMonth, selectedYear]);

  if (loading)
    return (
      <div className="bg-white p-6 rounded-xl shadow-md animate-pulse">
        <div className="h-5 w-48 bg-gray-200 rounded mb-4" />
        <div className="h-64 bg-gray-100 rounded" />
      </div>
    );

  if (error)
    return (
      <div className="bg-white p-6 rounded-xl shadow-md text-red-500 text-sm">
        Could not load comparison data.
      </div>
    );

  if (!data || data.comparison.length === 0)
    return (
      <div className="bg-white p-6 rounded-xl shadow-md text-gray-500 text-sm">
        Not enough data for a spending comparison this month.
      </div>
    );

  const chartData = data.comparison.map((c) => ({
    category: c.category,
    'My Spend': Math.round(c.mySpend),
    'Community Avg': Math.round(c.communityAvg),
  }));

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      {/* Header */}
      <div className="flex justify-between items-start mb-1">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Spending Comparison</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Your spending vs. anonymous community average •{' '}
            {new Date(selectedYear, selectedMonth).toLocaleString('default', {
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
          🔒 Anonymous
        </span>
      </div>
\
      <div className="flex gap-4 my-4">
        <div className="flex-1 bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500 mb-1">My Total</p>
          <p className="text-xl font-bold text-gray-900">₹{data.myTotal.toLocaleString()}</p>
        </div>
        <div className="flex-1 bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500 mb-1">Community Avg</p>
          <p className="text-xl font-bold text-gray-500">
            ₹{Math.round(data.communityAvgTotal).toLocaleString()}
          </p>
        </div>
        <div
          className={`flex-1 rounded-lg p-3 text-center ${
            data.myTotal <= data.communityAvgTotal ? 'bg-green-50' : 'bg-red-50'
          }`}
        >
          <p className="text-xs text-gray-500 mb-1">Difference</p>
          <p
            className={`text-xl font-bold ${
              data.myTotal <= data.communityAvgTotal ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {data.myTotal <= data.communityAvgTotal ? '−' : '+'}₹
            {Math.abs(Math.round(data.myTotal - data.communityAvgTotal)).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Bar chart */}
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis
            dataKey="category"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6B7280' }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6B7280' }}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            formatter={(val, name) => [`₹${val.toLocaleString()}`, name]}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
          />
          <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px', fontSize: '13px' }} />
          <Bar dataKey="My Spend" fill="#1f2937" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Community Avg" fill="#d1d5db" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {/* Per-category delta table */}
      <div className="mt-4 space-y-2">
        {data.comparison.map((c) => {
          const over = c.delta > 0;
          return (
            <div key={c.category} className="flex items-center justify-between text-sm">
              <span className="text-gray-700 w-28 truncate">{c.category}</span>
              <div className="flex-1 mx-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${over ? 'bg-gray-700' : 'bg-gray-400'}`}
                  style={{
                    width: `${Math.min(
                      100,
                      c.communityAvg > 0
                        ? (c.mySpend / Math.max(c.mySpend, c.communityAvg)) * 100
                        : 100
                    )}%`,
                  }}
                />
              </div>
              <span className={`text-xs font-semibold w-20 text-right ${over ? 'text-red-500' : 'text-green-600'}`}>
                {over ? '+' : '−'}₹{Math.abs(Math.round(c.delta)).toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-gray-400 mt-3 text-center">
        Community average is computed anonymously across all FinTrack users.
        Individual data is never shared.
      </p>
    </div>
  );
};

export default SpendingComparison;