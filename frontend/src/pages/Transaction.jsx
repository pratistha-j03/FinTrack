import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const App = () => {
  const [activeMenuItem, setActiveMenuItem] = useState('Transactions');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All'); 
  const [timeFilter, setTimeFilter] = useState('This Month');
  const [transactions, setTransactions] = useState([]);
  const [showAddTransactionModal, setShowAddTransactionModal] = useState(false);
  const [showEditTransactionModal, setShowEditTransactionModal] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);

  useEffect(() => {
    const mockTransactions = [
      { id: 1, date: 'Jun 15, 2023', description: 'Salary Deposit', category: 'Income', amount: 5250.00, type: 'income' },
      { id: 2, date: 'Jun 14, 2023', description: 'Grocery Shopping', category: 'Food', amount: -85.75, type: 'expense' },
      { id: 3, date: 'Jun 12, 2023', description: 'Online Shopping', category: 'Shopping', amount: -124.99, type: 'expense' },
      { id: 4, date: 'Jun 10, 2023', description: 'Birthday Gift', category: 'Gifts', amount: -19.99, type: 'expense' },
      { id: 5, date: 'Jun 8, 2023', description: 'Utility Bill', category: 'Utilities', amount: -78.50, type: 'expense' },
      { id: 6, date: 'Jun 7, 2023', description: 'Freelance Payment', category: 'Income', amount: 300.00, type: 'income' },
      { id: 7, date: 'Jun 6, 2023', description: 'Restaurant Dinner', category: 'Food', amount: -45.00, type: 'expense' },
      { id: 8, date: 'Jun 5, 2023', description: 'Subscription Service', category: 'Entertainment', amount: -15.00, type: 'expense' },
    ];
    setTransactions(mockTransactions);
  }, []);

  const handleMenuItemClick = (item) => {
    setActiveMenuItem(item);
    
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'All' || transaction.type === activeFilter.toLowerCase();
  
    const matchesTime = timeFilter === 'This Month' ? transaction.date.includes('Jun') : true; 

    return matchesSearch && matchesFilter && matchesTime;
  });

  const handleAddTransaction = (newTransaction) => {
    setTransactions(prev => [...prev, { ...newTransaction, id: prev.length + 1, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }]);
    setShowAddTransactionModal(false);
  };

  const handleEditTransaction = (updatedTransaction) => {
    setTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
    setShowEditTransactionModal(false);
    setCurrentTransaction(null);
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const openEditModal = (transaction) => {
    setCurrentTransaction(transaction);
    setShowEditTransactionModal(true);
  };

  const TransactionFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [description, setDescription] = useState(initialData?.description || '');
    const [amount, setAmount] = useState(initialData?.amount || '');
    const [category, setCategory] = useState(initialData?.category || '');
    const [type, setType] = useState(initialData?.type || 'expense');

    const handleSubmit = (e) => {
      e.preventDefault();
      const newAmount = type === 'expense' ? -Math.abs(parseFloat(amount)) : Math.abs(parseFloat(amount));
      onSubmit({ ...initialData, description, amount: newAmount, category, type });
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl w-96 max-w-full">
          <h2 className="text-xl font-bold mb-4">{initialData ? 'Edit Transaction' : 'Add New Transaction'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description</label>
              <input
                type="text"
                id="description"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="amount" className="block text-gray-700 text-sm font-bold mb-2">Amount</label>
              <input
                type="number"
                id="amount"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={Math.abs(amount)}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">Category</label>
              <input
                type="text"
                id="category"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="type" className="block text-gray-700 text-sm font-bold mb-2">Type</label>
              <select
                id="type"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-black cursor-pointer text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
              >
                {initialData ? 'Update' : 'Add'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };


  return (
    <div className="flex font-inter">
  
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <Sidebar activeItem={activeMenuItem} onMenuItemClick={handleMenuItemClick} />

      <div className="flex-1 p-8 bg-gray-100 min-h-screen rounded-l-lg shadow-inner">
        
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Transactions</h2>
          <p className="text-gray-600 mb-6">Manage your income and expenses</p>

          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveFilter('All')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200
                  ${activeFilter === 'All' ? 'bg-black text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter('Income')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200
                  ${activeFilter === 'Income' ? 'bg-black text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Income
              </button>
              <button
                onClick={() => setActiveFilter('Expenses')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200
                  ${activeFilter === 'Expenses' ? 'bg-black text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Expenses
              </button>
            </div>

            <div className="flex space-x-2">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option>This Month</option>
                <option>Last Month</option>
                <option>This Year</option>
                <option>All Time</option>
              </select>
              <button className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 flex items-center space-x-2 hover:bg-gray-50">
                <span>▼</span>
                <span>Filter</span>
              </button>
              <button
                onClick={() => setShowAddTransactionModal(true)}
                className="bg-black text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 shadow-md transition-all duration-200"
              >
                <span>+</span>
                <span>Add Transaction</span>
              </button>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Transactions</h3>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DATE</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DESCRIPTION</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CATEGORY</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AMOUNT</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                      >
                        {transaction.category}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.amount >= 0 ? '+' : ''}${transaction.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => openEditModal(transaction)} className="text-black mr-3">
                        ✏️
                      </button>
                      <button onClick={() => handleDeleteTransaction(transaction.id)} className="text-red-600 hover:text-red-900">
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-6">
            <span className="text-sm text-gray-600">Showing 1 to 5 of {filteredTransactions.length} results</span>
            <div className="flex space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                Previous
              </button>
              <button className="px-4 py-2 border border-black bg-black text-white rounded-lg">
                1
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </section>

        <TransactionFormModal
          isOpen={showAddTransactionModal}
          onClose={() => setShowAddTransactionModal(false)}
          onSubmit={handleAddTransaction}
          initialData={null}
        />

        <TransactionFormModal
          isOpen={showEditTransactionModal}
          onClose={() => setShowEditTransactionModal(false)}
          onSubmit={handleEditTransaction}
          initialData={currentTransaction}
        />

      </div>
    </div>
  );
};

export default App;
