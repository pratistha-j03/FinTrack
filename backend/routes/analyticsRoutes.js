const express = require('express');
const router = express.Router();
const { getMonthlyTrends, getCategoryBreakdown, getYearOverYear, getDashboardSummary, getSpendingComparison} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/trends', getMonthlyTrends);
router.get('/categories', getCategoryBreakdown);
router.get('/yoy', getYearOverYear);
router.get('/dashboard', getDashboardSummary);
router.get('/spending-comparison', getSpendingComparison);

module.exports = router;