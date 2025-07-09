import React, { useEffect, useState } from 'react';
import { DollarSign, ArrowDown, ArrowUp, PiggyBank } from 'lucide-react';

const DashboardCards = ({ selectedMonth, selectedYear }) => {
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [savingsRate, setSavingsRate] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:4000/api/transactions', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        // All-time balance
        const totalIncome = data
          .filter((tx) => tx.type === 'Income')
          .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
        const totalExpenses = data
          .filter((tx) => tx.type === 'Expense')
          .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
        setTotalBalance(totalIncome - totalExpenses);

        // Monthly filtered income and expense
        const filtered = data.filter((tx) => {
          const date = new Date(tx.date);
          return (
            date.getFullYear() === selectedYear &&
            date.getMonth() === selectedMonth
          );
        });

        const monthIncome = filtered
          .filter((tx) => tx.type === 'Income')
          .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

        const monthExpenses = filtered
          .filter((tx) => tx.type === 'Expense')
          .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

        setIncome(monthIncome);
        setExpenses(monthExpenses);

        // Savings rate
        const rate =
          monthIncome > 0
            ? (((monthIncome - monthExpenses) / monthIncome) * 100).toFixed(1)
            : 0;
        setSavingsRate(rate);
      } catch (error) {
        console.error('Error fetching transactions:', error.message);
      }
    };

    fetchData();
  }, [selectedMonth, selectedYear]);

  const data = [
    {
      title: 'Total Balance',
      value: `₹${totalBalance.toLocaleString()}`,
      change: '+0%', // Optional: you can add logic for comparing to last month
      color: 'text-green-500',
      icon: DollarSign,
      iconBg: 'bg-gray-100',
    },
    {
      title: 'Monthly Income',
      value: `₹${income.toLocaleString()}`,
      change: '+0%',
      color: 'text-green-500',
      icon: ArrowDown,
      iconBg: 'bg-green-100',
    },
    {
      title: 'Monthly Expenses',
      value: `₹${expenses.toLocaleString()}`,
      change: '-0%',
      color: 'text-red-500',
      icon: ArrowUp,
      iconBg: 'bg-red-100',
    },
    {
      title: 'Savings Rate',
      value: `${savingsRate}%`,
      change: '+0%',
      color: 'text-green-500',
      icon: PiggyBank,
      iconBg: 'bg-gray-100',
    },
  ];

  //   return (
  //     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 p-4">
  //       {data.map((card, index) => {
  //         const IconComponent = card.icon;
  //         const isPositiveChange = card.change.startsWith('+');

  //         return (
  //           <div key={index} className="bg-white p-4 rounded-xl shadow-md flex flex-col justify-between">
  //             <div className="flex justify-between items-center mb-2">
  //               <h2 className="text-sm font-semibold text-gray-700">{card.title}</h2>
  //               <div className={`w-8 h-8 rounded-full flex items-center justify-center ${card.iconBg}`}>
  //                 <IconComponent
  //                   size={18}
  //                   className={`${isPositiveChange ? 'text-green-600' : 'text-red-600'} ${
  //                     card.title === 'Total Balance' || card.title === 'Savings Rate' ? 'text-gray-600' : ''
  //                   }`}
  //                 />
  //               </div>
  //             </div>
  //             <p className="text-2xl font-bold text-gray-900">{card.value}</p>

  //           </div>
  //         );
  //       })}
  //     </div>
  //   );
  // };

 return (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 p-4">
    {data.map((card, index) => {
      const IconComponent = card.icon;
      const isPositiveChange = card.change.startsWith('+');

      return (
        <div
          key={index}
          className="bg-white text-black p-4 rounded-xl shadow-md 
          flex flex-col justify-between transition-all duration-300 
          transform hover:scale-105 hover:shadow-[0_0_10px_2px_rgba(0,0,0,0.1)] group"
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-semibold text-gray-800 group-hover:text-black transition-colors duration-300">
              {card.title}
            </h2>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 group-hover:bg-black group-hover:text-white transition-colors duration-300`}
            >
              <IconComponent
                size={18}
                className={`${
                  isPositiveChange ? 'text-green-500' : 'text-red-500'
                } ${
                  card.title === 'Total Balance' || card.title === 'Savings Rate'
                    ? 'text-gray-600'
                    : ''
                } group-hover:text-white transition-colors duration-300`}
              />
            </div>
          </div>
          <p className="text-2xl font-bold text-black group-hover:text-gray-900 transition-colors duration-300">
            {card.value}
          </p>
        </div>
      );
    })}
  </div>
);


}
  export default DashboardCards;
