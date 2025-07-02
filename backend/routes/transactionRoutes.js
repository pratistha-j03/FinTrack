const express = require('express');
const router = express.Router();
const { addTransaction, getTransactions, updateTransaction } = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');


router.post('/', protect, addTransaction);        
router.get('/', protect, getTransactions); 
router.put('/:id', protect, updateTransaction);


module.exports = router;
