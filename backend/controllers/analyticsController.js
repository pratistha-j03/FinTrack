const Transaction = require('../models/transactionModel');
const User = require('../models/userModel');

const getMonthlyTrends = async (req, res) => {
  try {
    const months = parseInt(req.query.months) || 6;
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - (months - 1));
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const trends = await Transaction.aggregate([
      // 1. Only this user's transactions from the date range
      {
        $match: {
          user: req.user._id,
          date: { $gte: startDate },
        },
      },
      // 2. Group by year + month + type
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type',
          },
          total: { $sum: { $abs: '$amount' } },
        },
      },
      // 3. Reshape into { year, month, income, expenses }
      {
        $group: {
          _id: { year: '$_id.year', month: '$_id.month' },
          income: {
            $sum: {
              $cond: [{ $eq: ['$_id.type', 'Income'] }, '$total', 0],
            },
          },
          expenses: {
            $sum: {
              $cond: [{ $eq: ['$_id.type', 'Expense'] }, '$total', 0],
            },
          },
        },
      },
      // 4. Add a savings field
      {
        $addFields: {
          savings: { $subtract: ['$income', '$expenses'] },
          label: {
            $dateToString: {
              format: '%b %Y',
              date: {
                $dateFromParts: {
                  year: '$_id.year',
                  month: '$_id.month',
                },
              },
            },
          },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json(trends);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/analytics/categories?month=4&year=2025

const getCategoryBreakdown = async (req, res) => {
  try {
    const month = parseInt(req.query.month); // 1-indexed (1=Jan)
    const year = parseInt(req.query.year) || new Date().getFullYear();

    // Build date range filter
    let matchStage = { user: req.user._id, type: 'Expense' };
    if (!isNaN(month) && !isNaN(year)) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1);
      matchStage.date = { $gte: start, $lt: end };
    }

    const breakdown = await Transaction.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$category',
          total: { $sum: { $abs: '$amount' } },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          total: 1,
          count: 1,
        },
      },
      { $sort: { total: -1 } },
    ]);

    // Compute percentages
    const grandTotal = breakdown.reduce((s, b) => s + b.total, 0);
    const withPercent = breakdown.map((b) => ({
      ...b,
      percentage: grandTotal > 0 ? +((b.total / grandTotal) * 100).toFixed(1) : 0,
    }));

    res.json({ categories: withPercent, total: grandTotal });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/analytics/yoy?year=2025

const getYearOverYear = async (req, res) => {
  try {
    const currentYear = parseInt(req.query.year) || new Date().getFullYear();
    const previousYear = currentYear - 1;

    const data = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          date: {
            $gte: new Date(`${previousYear}-01-01`),
            $lt: new Date(`${currentYear + 1}-01-01`),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type',
          },
          total: { $sum: { $abs: '$amount' } },
        },
      },
      {
        $group: {
          _id: { year: '$_id.year', month: '$_id.month' },
          income: {
            $sum: {
              $cond: [{ $eq: ['$_id.type', 'Income'] }, '$total', 0],
            },
          },
          expenses: {
            $sum: {
              $cond: [{ $eq: ['$_id.type', 'Expense'] }, '$total', 0],
            },
          },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Separate into two year buckets, fill missing months with 0
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const bucket = (yr) =>
      months.map((m) => {
        const found = data.find((d) => d._id.year === yr && d._id.month === m);
        return {
          month: m,
          income: found ? found.income : 0,
          expenses: found ? found.expenses : 0,
        };
      });

    res.json({
      currentYear: { year: currentYear, data: bucket(currentYear) },
      previousYear: { year: previousYear, data: bucket(previousYear) },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/analytics/dashboard?month=4&year=2025

const getDashboardSummary = async (req, res) => {
  try {
    const month = parseInt(req.query.month); // 1-indexed
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const [monthlyResult, allTimeResult] = await Promise.all([
      // Monthly income + expenses
      Transaction.aggregate([
        {
          $match: {
            user: req.user._id,
            date: { $gte: start, $lt: end },
          },
        },
        {
          $group: {
            _id: '$type',
            total: { $sum: { $abs: '$amount' } },
          },
        },
      ]),
      // All-time balance
      Transaction.aggregate([
        { $match: { user: req.user._id } },
        {
          $group: {
            _id: '$type',
            total: { $sum: { $abs: '$amount' } },
          },
        },
      ]),
    ]);

    const pick = (arr, type) =>
      arr.find((r) => r._id === type)?.total || 0;

    const monthlyIncome = pick(monthlyResult, 'Income');
    const monthlyExpenses = pick(monthlyResult, 'Expense');
    const allIncome = pick(allTimeResult, 'Income');
    const allExpenses = pick(allTimeResult, 'Expense');

    res.json({
      totalBalance: allIncome - allExpenses,
      monthlyIncome,
      monthlyExpenses,
      savingsRate:
        monthlyIncome > 0
          ? +((((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100).toFixed(1))
          : 0,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/analytics/spending-comparison?month=4&year=2025

const getSpendingComparison = async (req, res) => {
  try {
    const month = parseInt(req.query.month);
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const dateFilter = { date: { $gte: start, $lt: end }, type: 'Expense' };

    const [mySpending, communitySpending] = await Promise.all([
      // This user's spending by category
      Transaction.aggregate([
        { $match: { user: req.user._id, ...dateFilter } },
        {
          $group: {
            _id: '$category',
            total: { $sum: { $abs: '$amount' } },
          },
        },
      ]),

      // Average spending per category across ALL OTHER users
      Transaction.aggregate([
        {
          $match: {
            user: { $ne: req.user._id }, // exclude the current user
            ...dateFilter,
          },
        },
        // Per-user totals per category first
        {
          $group: {
            _id: { user: '$user', category: '$category' },
            userCategoryTotal: { $sum: { $abs: '$amount' } },
          },
        },
        // Then average those per-user totals across users
        {
          $group: {
            _id: '$_id.category',
            avgSpend: { $avg: '$userCategoryTotal' },
            userCount: { $sum: 1 },
          },
        },
      ]),
    ]);

    // Merge: for each of this user's categories, attach community avg
    const myMap = Object.fromEntries(mySpending.map((d) => [d._id, d.total]));
    const communityMap = Object.fromEntries(
      communitySpending.map((d) => [d._id, { avg: d.avgSpend, users: d.userCount }])
    );

    // Union of all categories seen
    const allCategories = [
      ...new Set([...Object.keys(myMap), ...Object.keys(communityMap)]),
    ];

    const comparison = allCategories.map((cat) => ({
      category: cat,
      mySpend: myMap[cat] || 0,
      communityAvg: communityMap[cat]?.avg || 0,
      sampleSize: communityMap[cat]?.users || 0,
      // positive = I spend MORE than average
      delta: (myMap[cat] || 0) - (communityMap[cat]?.avg || 0),
    }));

    comparison.sort((a, b) => b.mySpend - a.mySpend);

    res.json({
      month,
      year,
      comparison,
      // Total spend numbers for context
      myTotal: comparison.reduce((s, c) => s + c.mySpend, 0),
      communityAvgTotal: comparison.reduce((s, c) => s + c.communityAvg, 0),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  getMonthlyTrends,
  getCategoryBreakdown,
  getYearOverYear,
  getDashboardSummary,
  getSpendingComparison,
};