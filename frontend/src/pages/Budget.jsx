import React, { useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Search, Bell, ChevronDown, Plus, Home, Utensils, Car, Lightbulb, Wallet, Goal, Settings, UserCircle, SlidersHorizontal, ListFilter } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

function App() {
  
  const totalBudget = 5000;
  const spent = 3250;
  const remaining = totalBudget - spent;
  const totalBudgetPercentage = (spent / totalBudget) * 100;

  const dailyAverageSpent = 105;
  const dailyTarget = 125;
  const dailyDifference = dailyTarget - dailyAverageSpent;

  const savingsGoal = 1000;
  const saved = 450;
  const savingsPercentage = (saved / savingsGoal) * 100;
  const savingsToGo = savingsGoal - saved;


  const budgetCategories = [
    {
      id: 1,
      name: 'Housing',
      description: 'Rent, Utilities, Internet',
      spent: 1500,
      total: 1500,
      icon: Home,
      color: '#4A5568',
    },
    {
      id: 2,
      name: 'Food',
      description: 'Groceries, Dining Out',
      spent: 650,
      total: 800,
      icon: Utensils,
      color: '#718096',
    },
    {
      id: 3,
      name: 'Transportation',
      description: 'Gas, Public Transit, Car Maintenance',
      spent: 320,
      total: 400,
      icon: Car,
      color: '#A0AEC0', 
    },
    {
      id: 4,
      name: 'Entertainment',
      description: 'Movies, Hobbies, Going out',
      spent: 200,
      total: 250,
      icon: Lightbulb,
      color: '#CBD5E0', 
    },
    {
        id: 5,
        name: 'Utilities',
        description: 'Electricity, Water, Gas',
        spent: 180,
        total: 200,
        color: '#E2E8F0', 
    },
    {
        id: 6,
        name: 'Other',
        description: 'Miscellaneous expenses',
        spent: 300,
        total: 400,
        icon: Wallet,
        color: '#F7FAFC', 
    },
  ];

  const budgetDistributionData = [
    { name: 'Housing', value: 30, color: '#4A5568' },
    { name: 'Food', value: 16, color: '#718096' },
    { name: 'Transportation', value: 15, color: '#A0AEC0' },
    { name: 'Entertainment', value: 10, color: '#CBD5E0' },
    { name: 'Utilities', value: 10, color: '#E2E8F0' },
    { name: 'Other', value: 19, color: '#F7FAFC' },
  ];
  const PIE_COLORS = budgetDistributionData.map(d => d.color);

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
       <Header />

        <main className="flex-1 overflow-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Budget</h1>
            <div className="flex items-center space-x-3">
                <div className="relative">
                    <select
                        className="appearance-none bg-gray-100 border border-gray-300 text-gray-700 py-2 pl-3 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500 text-sm"
                    >
                        <option>May 2023</option>
                        <option>April 2023</option>
                        <option>June 2023</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <ChevronDown size={16} />
                    </div>
                </div>
                <button className="flex items-center px-4 py-2 bg-black text-white rounded-lg shadow-md hover:bg-gray-800 transition-colors duration-200">
                    <Plus className="mr-2" size={16} />
                    Add Budget
                </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Budget Overview</h3>
            <p className="text-gray-500 text-sm mb-4">May 1 - May 31, 2023</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-700">
          
              <div className="flex flex-col">
                <p className="text-sm font-medium">Total Budget</p>
                <div className="flex justify-between items-baseline mt-1">
                  <span className="text-xl font-bold">${spent} spent</span>
                  <span className="text-lg font-medium text-gray-500">${totalBudget}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div className="bg-black h-2.5 rounded-full" style={{ width: `${totalBudgetPercentage}%` }}></div>
                </div>
                <p className="text-sm mt-1 text-gray-500">${remaining} left</p>
              </div>

              <div className="flex flex-col">
                <p className="text-sm font-medium">Daily Average</p>
                <div className="flex justify-between items-baseline mt-1">
                  <span className="text-xl font-bold">${dailyAverageSpent}/day</span>
                  <span className="text-lg font-medium text-gray-500">Target: ${dailyTarget}</span>
                </div>
                <p className={`text-sm mt-2 ${dailyDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${Math.abs(dailyDifference)} {dailyDifference >= 0 ? 'under daily target' : 'over daily target'}
                </p>
              </div>

              <div className="flex flex-col">
                <p className="text-sm font-medium">Savings Goal</p>
                <div className="flex justify-between items-baseline mt-1">
                  <span className="text-xl font-bold">${saved} saved</span>
                  <span className="text-lg font-medium text-gray-500">${savingsGoal}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div className="bg-black h-2.5 rounded-full" style={{ width: `${savingsPercentage}%` }}></div>
                </div>
                <p className="text-sm mt-1 text-gray-500">${savingsToGo} to go</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Budget Categories</h3>
                <div className="flex space-x-2">
                  <button className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200 transition-colors duration-200 text-sm">
                    <ListFilter className="mr-1" size={16} /> Filter
                  </button>
                  <button className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200 transition-colors duration-200 text-sm">
                    <SlidersHorizontal className="mr-1" size={16} /> Sort
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {budgetCategories.map((category) => {
                  const percentageSpent = (category.spent / category.total) * 100;
                  const Icon = category.icon;
                  return (
                    <div key={category.id} className="flex items-center p-3 border border-gray-200 rounded-lg">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 text-gray-700 mr-4">
                        <Icon size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{category.name}</h4>
                        <p className="text-sm text-gray-500">{category.description}</p>
                        <div className="flex justify-between items-baseline text-sm mt-1">
                          <span className="font-semibold">${category.spent}/${category.total}</span>
                          <span className="text-gray-500">{percentageSpent.toFixed(0)}% of budget</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div
                            className="bg-black h-1.5 rounded-full"
                            style={{ width: `${percentageSpent}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Budget Distribution</h3>
              <div className="flex flex-col sm:flex-row items-center justify-center">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={budgetDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {budgetDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="sm:ml-8 mt-4 sm:mt-0">
                  {budgetDistributionData.map((entry, index) => (
                    <p key={`legend-${index}`} className="flex items-center text-sm text-gray-700 mb-1">
                      <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
                      {entry.name} ({entry.value} %)
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
