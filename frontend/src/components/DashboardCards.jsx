import React, { useEffect, useState } from 'react';
import { DollarSign, ArrowDown, ArrowUp, PiggyBank } from 'lucide-react';

const DashboardCards = ({ selectedMonth, selectedYear }) => {
  const [summary, setSummary] = useState({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    savingsRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/analytics/dashboard?month=${selectedMonth + 1
          }&year=${selectedYear}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch dashboard summary');
        const data = await res.json();
        setSummary(data);
      } catch (error) {
        console.error('Error fetching transactions:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth, selectedYear]);

  const data = [
    {
      title: 'Total Balance',
      value: `₹${summary.totalBalance.toLocaleString()}`,
      change: '+0%', 
      color: 'text-green-500',
      icon: DollarSign,
      iconBg: 'bg-gray-100',
    },
    {
      title: 'Monthly Income',
      value: `₹${summary.monthlyIncome.toLocaleString()}`,
      change: '+0%',
      color: 'text-green-500',
      icon: ArrowDown,
      iconBg: 'bg-green-100',
    },
    {
      title: 'Monthly Expenses',
      value: `₹${summary.monthlyExpenses.toLocaleString()}`,
      change: '-0%',
      color: 'text-red-500',
      icon: ArrowUp,
      iconBg: 'bg-red-100',
    },
    {
      title: 'Savings Rate',
      value: `${summary.savingsRate}%`,
      change: '+0%',
      color: 'text-green-500',
      icon: PiggyBank,
      iconBg: 'bg-gray-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 p-4">
      {data.map((card, index) => {
        const IconComponent = card.icon;
        const isPositiveChange = card.change.startsWith('+');

        return (
          <div
            key={index}
            className="bg-white text-black p-4 rounded-xl shadow-md 
          flex flex-col justify-between transition-all duration-300 
          transform hover:scale-105 hover:shadow-[0_0_10px_2px_rgba(0,0,0,0.1)] group"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-semibold text-gray-800 group-hover:text-black transition-colors duration-300">
                {card.title}
              </h2>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 group-hover:bg-black group-hover:text-white transition-colors duration-300`}
              >
                <IconComponent
                  size={18}
                  className={`${isPositiveChange ? 'text-green-500' : 'text-red-500'
                    } ${card.title === 'Total Balance' || card.title === 'Savings Rate'
                      ? 'text-gray-600'
                      : ''
                    } group-hover:text-white transition-colors duration-300`}
                />
              </div>
            </div>
            <p className="text-2xl font-bold text-black group-hover:text-gray-900 transition-colors duration-300">
              {loading? '-': card.value}
            </p>
          </div>
        );
      })}
    </div>
  );

}
export default DashboardCards;
