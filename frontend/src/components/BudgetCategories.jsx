import React, { useEffect, useState } from 'react';
import {
  FaHome,
  FaUtensils,
  FaCar,
  FaFileInvoice,
  FaLock,
  FaHeart,
} from 'react-icons/fa';

// Icon mapping
const iconMap = {
  Home: <FaHome />,
  Food: <FaUtensils />,
  Transport: <FaCar />,
  Bills: <FaFileInvoice />,
  Lock: <FaLock />,
  Entertainment: <FaHeart />,
};

const BudgetCategoryItem = ({ icon, name, spent, total, colorClass, bgColorClass }) => {
  const percentage = total > 0 ? (spent / total) * 100 : 100; // If no budget, show full bar

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
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
      </div>
      <div className="text-right ml-5">
        <div className="font-bold text-gray-900">
          ₹{spent.toLocaleString()} / ₹{total?.toLocaleString() || '0'}
        </div>
        <div className="text-sm text-gray-600">
          {total > 0 ? `${Math.round(percentage)}% of budget` : 'No budget set'}
        </div>
      </div>
    </div>
  );
};

const BudgetCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchBudgetsAndTransactions = async () => {
      try {
        const token = localStorage.getItem('token');

        const [budgetsRes, transactionsRes] = await Promise.all([
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

        if (!budgetsRes.ok || !transactionsRes.ok) {
          throw new Error('Failed to fetch budgets or transactions');
        }

        const budgets = await budgetsRes.json();
        const transactions = await transactionsRes.json();
        console.log('Transactions:', transactions);

        const spentMap = {};
        transactions.forEach((tx) => {
          const txCategory = tx.category?.trim().toLowerCase();
          if (tx.type?.toLowerCase() === 'expense') {
            spentMap[txCategory] = (spentMap[txCategory] || 0) + Math.abs(tx.amount);
          }
        });

        const budgetMap = {};
        budgets.forEach((budget) => {
          const cat = budget.category?.trim().toLowerCase();
          budgetMap[cat] = budget.amount;
        });

        const allCategories = Array.from(new Set([...Object.keys(spentMap), ...Object.keys(budgetMap)]));

        const colors = ['bg-gray-800', 'bg-gray-700', 'bg-gray-600', 'bg-gray-500', 'bg-gray-400', 'bg-gray-300'];
        console.log('Spent Map:', spentMap);
        console.log('Budget Map:', budgetMap);

        const formatted = Object.entries(budgetMap).map(([catKey, amount], index) => {
          const originalKey = Object.keys(iconMap).find(
            (iconKey) => iconKey.toLowerCase() === catKey
          ) || catKey;

          return {
            icon: iconMap[originalKey] || <FaLock />,
            name: originalKey.charAt(0).toUpperCase() + originalKey.slice(1), // Capitalized name
            spent: spentMap[catKey] || 0,
            total: amount,
            colorClass: colors[index % colors.length],
            bgColorClass: 'bg-gray-100',
          };
        });

        setCategories(formatted);
      } catch (err) {
        console.error('Failed to fetch budgets or transactions:', err.message);
      }
    };

    fetchBudgetsAndTransactions();
  }, []);

  return (
    <div className="bg-white rounded-lg p-5 shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold text-gray-900">Budget Categories</h2>
      </div>

      <div>
        {categories.length > 0 ? (
          categories.map((category, index) => (
            <BudgetCategoryItem key={index} {...category} />
          ))
        ) : (
          <p className="text-gray-500 text-sm">No categories found.</p>
        )}
      </div>
    </div>
  );
};

export default BudgetCategories;
