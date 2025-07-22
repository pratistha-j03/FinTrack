import React, { useState, useEffect } from 'react';
import {
  FaHome,
  FaUtensils,
  FaCar,
  FaFileInvoice,
  FaLock,
  FaHeart,
  FaPlus
} from 'react-icons/fa';

const icons = [
  { label: 'Home', icon: <FaHome /> },
  { label: 'Food', icon: <FaUtensils /> },
  { label: 'Car', icon: <FaCar /> },
  { label: 'Bills', icon: <FaFileInvoice /> },
  { label: 'Lock', icon: <FaLock /> },
  { label: 'Heart', icon: <FaHeart /> },
];


const BudgetForm = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    category: '',
    newCategory: '',
    icon: '',
    amount: '',
    period: 'Monthly',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleIconSelect = (icon) => {
    setFormData({ ...formData, icon });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();

    const payload = {
      category: formData.newCategory || formData.category,
      icon: formData.icon, // You can handle this as string or icon name
      amount: parseFloat(formData.amount),
      period: formData.period,
      startDate: formData.startDate,
      endDate: formData.endDate,
    };

    try {
      const res = await fetch('http://localhost:4000/api/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });
      console.log('Response Status:', res.status);
      if (!res.ok) throw new Error('Failed to create budget');

      const data = await res.json();
      console.log('Budget created:', data);
      onSubmit?.(data); // send to parent if needed
      onClose();
    } catch (err) {
      console.error('Error submitting budget:', err);
      alert('Error submitting budget');
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto space-y-4 relative">
        <h2 className="text-xl font-semibold">Add New Budget</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select a category</option>
              <option value="Home">Home</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Bills">Bills</option>
            </select>
          </div>

          {/* New Category */}
          <div>
            <label className="block text-sm font-medium mb-1">Create New Category</label>
            <input
              type="text"
              name="newCategory"
              value={formData.newCategory}
              onChange={handleChange}
              placeholder="Category name"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Icon Picker */}
          <div>
            <label className="block text-sm font-medium mb-1">Icon</label>
            <div className="flex flex-wrap gap-2">
              {icons.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleIconSelect(item.icon)}
                  className={`p-2 rounded border text-xl ${
                    formData.icon === item.icon ? 'bg-gray-200' : ''
                  }`}
                >
                  {item.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Budget Amount */}
          <div>
            <label className="block text-sm font-medium mb-1">Budget Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="$ 0.00"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Time Period */}
          <div>
            <label className="block text-sm font-medium mb-1">Time Period</label>
            <select
              name="period"
              value={formData.period}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="Monthly">Monthly</option>
              <option value="Weekly">Weekly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              Create Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetForm;
