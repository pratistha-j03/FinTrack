import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import TransactionFormModal from '../components/TransactionForm';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const App = () => {
  const [activeMenuItem, setActiveMenuItem] = useState('Transactions');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [timeFilter, setTimeFilter] = useState('This Month');
  const [transactions, setTransactions] = useState([]);
  const [showAddTransactionModal, setShowAddTransactionModal] = useState(false);
  const [showEditTransactionModal, setShowEditTransactionModal] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [type, setType] = useState('Expense');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchTransactions = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:4000/api/transactions', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setTransactions(data);
      } else {
        alert(data.message || 'Failed to load transactions');
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleMenuItemClick = (item) => {
    setActiveMenuItem(item);

  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = (transaction.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'All' || (transaction.type || '').toLowerCase() === activeFilter.toLowerCase();


    const date = new Date(transaction.date);
    const currentMonth = new Date().getMonth();
    const matchesTime =
      timeFilter === 'This Month'
        ? date.getMonth() === currentMonth
        : true;

    return matchesSearch && matchesFilter && matchesTime;
  });


  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);


  const handleAddTransaction = async (newTransaction) => {
    // setTransactions(prev => [...prev, { ...newTransaction, id: prev.length + 1, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }]);
    // setShowAddTransactionModal(false);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:4000/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newTransaction)
      });
      const data = await res.json();
      setTransactions(prev => [data, ...prev]); // update UI
      setShowAddTransactionModal(false);
    } catch (error) {
      console.error("Add transaction error:", error);
    }
  };

  const handleEditTransaction = async (updatedTransaction) => {
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`http://localhost:4000/api/transactions/${updatedTransaction._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedTransaction),
      });

      const data = await res.json();

      if (res.ok) {
        setTransactions(prev =>
          prev.map(t => t._id === data._id ? data : t)
        );
        setShowEditTransactionModal(false);
        setCurrentTransaction(null);
      } else {
        console.error(data.message);
        alert(data.message || "Update failed");
      }
    } catch (err) {
      console.error("Edit transaction error:", err);
      alert("Something went wrong");
    }
  };


  const handleDeleteTransaction = async (id) => {
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`http://localhost:4000/api/transactions/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setTransactions(prev => prev.filter(t => t._id !== id));
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete");
      }
    } catch (err) {
      console.error("Delete transaction error:", err);
      alert("Something went wrong");
    }
  };


  const openEditModal = (transaction) => {
    setCurrentTransaction(transaction);
    setShowEditTransactionModal(true);
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
                onClick={() => setActiveFilter('Expense')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200
                  ${activeFilter === 'Expense' ? 'bg-black text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Expenses
              </button>
            </div>

            <div className="flex space-x-2">
              <select
                // value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option>This Month</option>
                <option>Last Month</option>
                <option>This Year</option>
                <option>All Time</option>
              </select>

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
                {paginatedTransactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${transaction.type === 'Income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                      >
                        {transaction.category}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.amount >= 0 ? '+' : ''}₹{transaction.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => openEditModal(transaction)} className="text-black mr-3">
                        <FiEdit size={16}/>
                      </button>
                      <button onClick={() => handleDeleteTransaction(transaction._id)} className="text-red-600 hover:text-red-900">
                        <FiTrash2 size={16}/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-6">
            <span className="text-sm text-gray-600">
              Showing {filteredTransactions.length === 0 ? 0 : startIndex + 1} to {Math.min(endIndex, filteredTransactions.length)} of {filteredTransactions.length} results
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button className="px-4 py-2 border border-black bg-black text-white rounded-lg">
                {currentPage}
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
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
