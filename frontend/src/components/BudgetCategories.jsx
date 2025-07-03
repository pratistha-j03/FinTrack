import React from 'react';

const BudgetCategoryItem = ({ icon, name, spent, total, colorClass, bgColorClass }) => {
  const percentage = (spent / total) * 100;

  return (
    <div className="flex items-center py-4 border-b border-gray-200 last:border-b-0">
      <div className={`w-10 h-10 rounded-lg ${bgColorClass} flex items-center justify-center text-2xl mr-4`}>
        {icon}
      </div>
      <div className="flex-grow">
        <h4 className="text-base font-medium text-gray-900 mb-1">{name}</h4>
        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
          <div
            className={`${colorClass} h-full rounded-full`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
      <div className="text-right ml-5">
        <div className="font-bold text-gray-900">${spent.toLocaleString()} / ${total.toLocaleString()}</div>
        <div className="text-sm text-gray-600">{percentage.toFixed(0)}% of budget</div>
      </div>
    </div>
  );
};

const BudgetCategories = () => {
  // Using different shades of gray for visual distinction in categories
  const categories = [
    { icon: '🏠', name: 'Housing', spent: 1500, total: 1500, colorClass: 'bg-gray-800', bgColorClass: 'bg-gray-100' },
    { icon: '🍔', name: 'Food', spent: 650, total: 800, colorClass: 'bg-gray-700', bgColorClass: 'bg-gray-100' },
    { icon: '🚗', name: 'Transportation', spent: 320, total: 400, colorClass: 'bg-gray-600', bgColorClass: 'bg-gray-100' },
    { icon: '🛍️', name: 'Shopping', spent: 200, total: 300, colorClass: 'bg-gray-500', bgColorClass: 'bg-gray-100' },
    { icon: '💡', name: 'Utilities', spent: 150, total: 200, colorClass: 'bg-gray-400', bgColorClass: 'bg-gray-100' },
    { icon: '🎭', name: 'Entertainment', spent: 100, total: 200, colorClass: 'bg-gray-300', bgColorClass: 'bg-gray-100' },
  ];

  return (
    <div className="bg-white rounded-lg p-5 shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold text-gray-900">Budget Categories</h2>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300">
            Filter
          </button>
          <button className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300">
            Sort
          </button>
        </div>
      </div>
      <div>
        {categories.map((category, index) => (
          <BudgetCategoryItem key={index} {...category} />
        ))}
      </div>
    </div>
  );
};

export default BudgetCategories;