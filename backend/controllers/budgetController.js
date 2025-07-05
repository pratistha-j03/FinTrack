const Budget = require('../models/budgetModel');

// Create a new budget
const createBudget = async (req, res) => {
    const { category, amount, endDate, startDate } = req.body;

    if (!category || !amount || !endDate) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const budget = await Budget.create({
            user: req.user._id,
            category,
            amount,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            month: new Date(startDate).getMonth() + 1,
            year: new Date(startDate).getFullYear()
        });

        if (new Date(startDate) > new Date(endDate)) {
            return res.status(400).json({ message: 'Start date cannot be after end date' });
        }

        res.status(201).json(budget);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get all budgets for logged-in user
const getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({ user: req.user._id }).sort({ startDate: -1 });
        res.json(budgets);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Update a budget
const updateBudget = async (req, res) => {
    const { id } = req.params;
    const { category, amount, startDate, endDate } = req.body;

    try {
        const updated = await Budget.findOneAndUpdate(
            { _id: id, user: req.user._id },
            { category, amount, startDate, endDate },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Delete a budget
const deleteBudget = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await Budget.findOneAndDelete({ _id: id, user: req.user._id });

        if (!deleted) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        res.json({ message: 'Budget deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = {
    createBudget,
    getBudgets,
    updateBudget,
    deleteBudget
};
