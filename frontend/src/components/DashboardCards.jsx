import React from 'react';
import { DollarSign, ArrowDown, ArrowUp, PiggyBank } from 'lucide-react'; 

const data = [
  { title: "Total Balance", value: "$12,560.45", change: "+12.5%", color: "text-green-500", icon: DollarSign, iconBg: "bg-gray-100" },
  { title: "Monthly Income", value: "$5,240.00", change: "+3.2%", color: "text-green-500", icon: ArrowDown, iconBg: "bg-green-100" },
  { title: "Monthly Expenses", value: "$3,850.20", change: "-8.7%", color: "text-red-500", icon: ArrowUp, iconBg: "bg-red-100" },
  { title: "Savings Rate", value: "26.5%", change: "+4.3%", color: "text-green-500", icon: PiggyBank, iconBg: "bg-gray-100" },
];

const DashboardCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 p-4"> 
      {data.map((card, index) => {
        const IconComponent = card.icon;
        const isPositiveChange = card.change.startsWith('+');

        return (
          <div key={index} className="bg-white p-4 rounded-xl shadow-md flex flex-col justify-between">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-semibold text-gray-700">{card.title}</h2>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${card.iconBg}`}>
                <IconComponent size={18} className={`${isPositiveChange ? 'text-green-600' : 'text-red-600'} ${card.title === 'Total Balance' || card.title === 'Savings Rate' ? 'text-gray-600' : ''}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className={`text-sm ${card.color} mt-1`}>
              <span className="inline-flex items-center">
                {isPositiveChange ? <ArrowUp size={12} className="mr-1" /> : <ArrowDown size={12} className="mr-1" />}
              </span>
              {card.change} from last month
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardCards;
