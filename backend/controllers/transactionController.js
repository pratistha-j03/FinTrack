const Transaction = require('../models/transactionModel');
const User = require('../models/userModel');

const addTransaction = async (req, res) => {
  const { description, amount, category, type } = req.body;

  if (!description || !amount || !category || !type) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const transaction = await Transaction.create({
      user: req.user._id,
      description,
      amount,
      category,
      type,
      date: new Date()
    });

    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { transactions: transaction._id } }
    );

    console.log("Transaction created:", transaction);
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Serversss error', error: err.message });
  }
};

const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { description, amount, category, type } = req.body;

  try {
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    transaction.description = description;
    transaction.amount = amount;
    transaction.category = category;
    transaction.type = type;

    const updated = await transaction.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


module.exports = { addTransaction, getTransactions, updateTransaction };


