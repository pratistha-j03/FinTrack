import React from 'react';

const BudgetOverview = () => {
  const totalBudget = 5000;
  const spent = 3250;
  const remaining = totalBudget - spent;
  const dailyAverage = 105;
  const dailyTarget = 125;
  const savingsGoal = 1000;
  const saved = 450;
  const toGo = savingsGoal - saved;

  const spentPercentage = (spent / totalBudget) * 100;
  const savedPercentage = (saved / savingsGoal) * 100;
  // For daily progress, we'll use a specific gray, not necessarily calculated percentage for the bar itself,
  // but for the text indicating "under target".
  const dailyProgressPercentage = (dailyAverage / dailyTarget) * 100;


  return (
    <div className="bg-white rounded-lg p-5 shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Budget Overview</h2>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-700"></span> Spent
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-300"></span> Remaining
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-5">May 1 - May 31, 2023</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Total Budget */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-base font-medium text-gray-700 mb-2">Total Budget</h3>
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-3xl font-bold text-gray-900">${totalBudget.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden mb-1">
            <div
              className="bg-gray-700 h-full rounded-full"
              style={{ width: `${spentPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>${spent.toLocaleString()} spent</span>
            <span>${remaining.toLocaleString()}</span>
          </div>
        </div>

        {/* Daily Average */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-base font-medium text-gray-700 mb-2">Daily Average</h3>
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-3xl font-bold text-gray-900">${dailyAverage} / day</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden mb-1">
            <div
              className="bg-gray-600 h-full rounded-full" // A slightly different gray for visual distinction
              style={{ width: `${dailyProgressPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span className="text-gray-700 font-semibold">${dailyTarget - dailyAverage} under daily target</span> {/* Emphasize with darker gray */}
            <span>Target: ${dailyTarget}</span>
          </div>
        </div>

        {/* Savings Goal */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-base font-medium text-gray-700 mb-2">Savings Goal</h3>
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-3xl font-bold text-gray-900">${savingsGoal.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden mb-1">
            <div
              className="bg-gray-500 h-full rounded-full" // Another shade of gray
              style={{ width: `${savedPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>${saved.toLocaleString()} saved</span>
            <span>${toGo.toLocaleString()} to go</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetOverview;