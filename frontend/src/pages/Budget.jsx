import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import BudgetOverview from '../components/BudgetOverview';
import BudgetCategories from '../components/BudgetCategories';
import BudgetDistribution from '../components/BudgetDistribution';

const BudgetPage = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-grow">
        <Header />
        <main className="p-5 overflow-y-auto">
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
      </div>
    </div>
  );
};

export default BudgetPage;