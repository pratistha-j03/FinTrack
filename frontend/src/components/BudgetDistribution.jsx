import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const BudgetDistribution = () => {
  // Define a grayscale palette for the chart segments
  const chartColors = [
    '#262626', // neutral-900 or almost black
    '#4b5563', // gray-700
    '#6b7280', // gray-600
    '#9ca3af', // gray-400
    '#d1d5db', // gray-300
    '#e5e7eb', // gray-200
  ];

  const data = {
    labels: ['Housing', 'Food', 'Transportation', 'Shopping', 'Utilities', 'Entertainment'],
    datasets: [
      {
        data: [30, 20, 16, 10, 8, 6], // Percentages from your image
        backgroundColor: chartColors,
        borderColor: '#ffffff', // White border between segments
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // We'll create a custom legend
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += context.parsed + '%';
            }
            return label;
          }
        }
      }
    },
    cutout: '80%', // Makes it a donut chart
  };

  // The legend items will also use Tailwind grayscale classes
  const legendItems = [
    { name: 'Housing', colorClass: 'bg-gray-900', percentage: '30%' },
    { name: 'Food', colorClass: 'bg-gray-700', percentage: '20%' },
    { name: 'Transportation', colorClass: 'bg-gray-600', percentage: '16%' },
    { name: 'Shopping', colorClass: 'bg-gray-400', percentage: '10%' },
    { name: 'Utilities', colorClass: 'bg-gray-300', percentage: '8%' },
    { name: 'Entertainment', colorClass: 'bg-gray-200', percentage: '6%' },
  ];

  return (
    <div className="bg-white rounded-lg p-5 shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-5">Budget Distribution</h2>
      <div className="h-64 mb-5"> {/* Fixed height for chart */}
        <Doughnut data={data} options={options} />
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {legendItems.map((item, index) => (
          <div key={index} className="flex items-center text-sm text-gray-700">
            <span className={`w-2.5 h-2.5 rounded-full ${item.colorClass} mr-2`}></span>
            {item.name} <span className="ml-auto font-semibold">{item.percentage}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetDistribution;