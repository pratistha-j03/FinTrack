import React from 'react';

const ScrollingBanner = () => {
  return (
    <div className="overflow-hidden bg-black/80 text-white border-y border-gray-800 py-3">
      <div
        className="flex gap-16 font-bold text-lg uppercase whitespace-nowrap tracking-wider"
        style={{
          animation: 'scroll-left 20s linear infinite',
          // display: 'inline-block',
        }}
      >
        <span>Track</span>
        <span>Spend</span>
        <span>Save</span>
        <span>Plan</span>
        <span>Invest</span>
        <span>Budget</span>
        <span>Credit</span>
        <span>Expense</span>
        <span>Balance</span>
        <span>Goals</span>
        <span>Track</span>
        <span>Spend</span>
        <span>Save</span>
        <span>Plan</span>
        <span>Invest</span>
      </div>

      <style>
        {`
          @keyframes scroll-left {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
        `}
      </style>
    </div>
  );
};

export default ScrollingBanner;
