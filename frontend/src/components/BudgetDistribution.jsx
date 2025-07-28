import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const colorPalette = [
  '#262626', // gray-900
  '#4b5563', // gray-700
  '#6b7280', // gray-600
  '#9ca3af', // gray-400
  '#d1d5db', // gray-300
  '#e5e7eb', // gray-200
];

const twColorClasses = [
  'bg-gray-900',
  'bg-gray-700',
  'bg-gray-600',
  'bg-gray-400',
  'bg-gray-300',
  'bg-gray-200',
];

const BudgetDistribution = ({ selectedMonth, selectedYear }) => {
  const [budgetData, setBudgetData] = useState([]);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/budgets`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        // Filter by selectedMonth and selectedYear
        const filtered = data.filter(budget => {
          const bDate = new Date(budget.startDate || budget.createdAt);
          return (
            bDate.getFullYear() === selectedYear &&
            bDate.getMonth() === selectedMonth
          );
        });

        setBudgetData(filtered);
      } catch (error) {
        console.error('Error fetching budgets:', error);
      }
    };

    fetchBudgets();
  }, [selectedMonth, selectedYear]);


  const totalBudget = budgetData.reduce((acc, b) => acc + b.amount, 0);

  const labels = budgetData.map(b => b.category);
  const values = budgetData.map(b => b.amount);
  const percentages = budgetData.map(b =>
    totalBudget > 0 ? ((b.amount / totalBudget) * 100).toFixed(1) : 0
  );

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colorPalette.slice(0, values.length),
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '80%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed;
            const percent = totalBudget > 0 ? ((value / totalBudget) * 100).toFixed(1) : 0;
            return `${context.label}: ${percent}%`;
          },
        },
      },
    },
  };

  const legendItems = labels.map((label, index) => ({
    name: label,
    percentage: `${percentages[index]}%`,
    colorClass: twColorClasses[index % twColorClasses.length],
  }));

  return (
    <div className="bg-white rounded-lg p-5 shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-5">Budget Distribution</h2>

      {budgetData.length === 0 ? (
        <p className="text-gray-500 text-sm">No budget data available.</p>
      ) : (
        <>
          <div className="h-64 mb-5">
            <Doughnut data={chartData} options={options} />
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {legendItems.map((item, index) => (
              <div key={index} className="flex items-center text-sm text-gray-700">
                <span className={`w-2.5 h-2.5 rounded-full ${item.colorClass} mr-2`}></span>
                {item.name}
                <span className="ml-auto font-semibold">{item.percentage}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BudgetDistribution;
