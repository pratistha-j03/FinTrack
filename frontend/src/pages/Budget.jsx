import React from 'react';
import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import BudgetOverview from '../components/BudgetOverview';
import BudgetCategories from '../components/BudgetCategories';
import BudgetDistribution from '../components/BudgetDistribution';
import BudgetForm from '../components/BudgetForm';

const BudgetPage = () => {
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);
  const [showEditBudgetModal, setShowEditBudgetModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // const handleMonthChange = (e) => {
  //   setSelectedMonth(Number(e.target.value));
  // };
  // const handleYearChange = (e) => {
  //   setSelectedYear(Number(e.target.value));
  // };
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-grow">
        <Header />
        <main className="p-5 overflow-y-auto">
          <button onClick={() => setShowAddBudgetModal(true)} className="bg-black text-white font-bold py-2 px-4 rounded-lg mb-5 position-relative left-0 ">
            Add Budget
          </button>
          {/* <div className="flex items-center gap-4 mb-5">
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              className="border border-gray-300 rounded px-2 py-1"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={handleYearChange}
              className="border border-gray-300 rounded px-2 py-1"
            >
              {[2024, 2025, 2026].map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div> */}
          <div className="mb-4">
            <label className="text-sm text-gray-600 mr-2">Select Month:</label>
            <input
              type="month"
              className="border border-gray-300 rounded px-2 py-1 text-sm"
              value={`${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`}
              onChange={(e) => {
                const [year, month] = e.target.value.split('-').map(Number);
                setSelectedYear(year);
                setSelectedMonth(month - 1); // JS months are 0-indexed
              }}
            />
          </div>


          <BudgetOverview month={selectedMonth} year={selectedYear} />
          <div className="flex flex-col md:flex-row gap-5 mt-5">
            <div className="md:w-2/3">
              <BudgetCategories selectedMonth={selectedMonth} selectedYear={selectedYear} />
            </div>
            <div className="md:w-1/3">
              <BudgetDistribution selectedMonth={selectedMonth} selectedYear={selectedYear} />
            </div>
          </div>
        </main>
        <BudgetForm
          isOpen={showAddBudgetModal}
          onClose={() => setShowAddBudgetModal(false)}
        // onSubmit={handleAddBudget}
        // initialData={null}
        />

        <BudgetForm
          isOpen={showEditBudgetModal}
          onClose={() => setShowEditBudgetModal(false)}
        // onSubmit={handleEditBudget}
        // initialData={currentBudget}
        />
      </div>
    </div>
  );
};

export default BudgetPage;