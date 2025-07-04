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

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-grow">
        <Header />
        <main className="p-5 overflow-y-auto">
          <button onClick={() => setShowAddBudgetModal(true)} className="bg-black text-white font-bold py-2 px-4 rounded-lg mb-5 position-relative left-0 ">
            Add Budget
          </button>
          <BudgetOverview />
          <div className="flex flex-col md:flex-row gap-5 mt-5">
            <div className="md:w-2/3"> {/* Adjust flex basis as needed */}
              <BudgetCategories />
            </div>
            <div className="md:w-1/3"> {/* Adjust flex basis as needed */}
              <BudgetDistribution />
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