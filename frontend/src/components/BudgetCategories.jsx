import React, { useEffect, useState } from 'react';
import {
  FaHome,
  FaUtensils,
  FaCar,
  FaFileInvoice,
  FaLock,
  FaHeart,
} from 'react-icons/fa';
import { FiTrash2 } from 'react-icons/fi';

// Icon mapping
const iconMap = {
  Home: <FaHome />,
  Food: <FaUtensils />,
  Transport: <FaCar />,
  Stationary: <FaFileInvoice />,
  Lock: <FaLock />,
  Entertainment: <FaHeart />,
};

const BudgetCategoryItem = ({ icon, name, spent, total, colorClass, bgColorClass, onDelete }) => {
  const percentage = total > 0 ? (spent / total) * 100 : 100;

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
      <button
        onClick={onDelete}
        className="ml-4 text-red-500 hover:text-red-700"
        title="Delete Budget"
      >
        <FiTrash2 />
      </button>
    </div>
  );
};

const BudgetCategories = ({ selectedMonth, selectedYear }) => {
  const [categories, setCategories] = useState([]);



  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!id) return;
    const confirmDelete = window.confirm("Are you sure you want to delete this budget?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/budgets/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to delete');
      }

    } catch (err) {
      alert("Error deleting budget: " + err.message);
    }
  };

  useEffect(() => {
    const fetchBudgetsAndTransactions = async () => {
      try {
        const token = localStorage.getItem('token');

        const [budgetsRes, transactionsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/budgets`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${import.meta.env.VITE_API_URL}/api/transactions`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!budgetsRes.ok || !transactionsRes.ok) {
          throw new Error('Failed to fetch budgets or transactions');
        }

        const budgets = await budgetsRes.json();
        const transactions = await transactionsRes.json();

        const filteredTransactions = transactions.filter((tx) => {
          const txDate = new Date(tx.date);
          return (
            txDate.getFullYear() === selectedYear &&
            txDate.getMonth() === selectedMonth &&
            tx.type?.toLowerCase() === 'expense'
          );
        });

        const spentMap = {};
        filteredTransactions.forEach((tx) => {
          const txCategory = tx.category?.trim().toLowerCase();
          spentMap[txCategory] = (spentMap[txCategory] || 0) + Math.abs(tx.amount);
        });

        const filteredBudgets = budgets.filter((budget) => {
          const bDate = new Date(budget.startDate || budget.createdAt);
          return bDate.getFullYear() === selectedYear && bDate.getMonth() === selectedMonth;
        });

        const budgetMap = {};
        filteredBudgets.forEach((budget) => {
          const cat = budget.category?.trim().toLowerCase();
          budgetMap[cat] = budget.amount;
        });

        const colors = ['bg-gray-800', 'bg-gray-700', 'bg-gray-600', 'bg-gray-500', 'bg-gray-400', 'bg-gray-300'];

        const formatted = Object.entries(budgetMap).map(([catKey, amount], index) => {
          const originalKey = Object.keys(iconMap).find(
            (iconKey) => iconKey.toLowerCase() === catKey
          ) || catKey;

          const matchingBudget = filteredBudgets.find(b => b.category?.toLowerCase() === catKey);

          return {
            icon: iconMap[originalKey] || <FaLock />,
            name: originalKey.charAt(0).toUpperCase() + originalKey.slice(1),
            spent: spentMap[catKey] || 0,
            total: amount,
            colorClass: colors[index % colors.length],
            bgColorClass: 'bg-gray-100',
            id: matchingBudget ? matchingBudget._id.toString() : null,
          };
        });

        setCategories(formatted);
      } catch (err) {
        console.error('Failed to fetch budgets or transactions:', err.message);
      }
    };

    fetchBudgetsAndTransactions();
  }, [selectedMonth, selectedYear]);

  return (
    <div className="bg-white rounded-lg p-5 shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold text-gray-900">Budget Categories</h2>
      </div>

      <div>
        {categories.length > 0 ? (
          categories.map((category, index) => (
            <BudgetCategoryItem key={index} {...category} onDelete = {
            ()=> handleDelete(category.id)}/>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No categories found.</p>
        )}
      </div>
    </div>
  );
};

export default BudgetCategories;
