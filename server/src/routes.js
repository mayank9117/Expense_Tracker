const express = require('express');
const router = express.Router();
const Expense = require('./models/Expense');

// @desc    Get all expenses
// @route   GET /expenses
router.get('/', async (req, res) => {
    try {
        const { category, sort } = req.query;
        let query = {};

        if (category) {
            query.category = category;
        }

        let expenses = Expense.find(query);

        if (sort === 'date_desc') {
            expenses = expenses.sort({ date: -1 });
        } else {
            // Default sort by date descending as per requirements
            expenses = expenses.sort({ date: -1 });
        }

        const results = await expenses;
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// @desc    Create an expense
// @route   POST /expenses
router.post('/', async (req, res) => {
    try {
        const { amount, category, description, date, idempotencyKey } = req.body;

        // improved validation
        if (!amount || !category || !description || !date) {
            return res.status(400).json({ error: 'Please include all fields' });
        }

        // Idempotency check
        if (idempotencyKey) {
            const existingExpense = await Expense.findOne({ idempotencyKey });
            if (existingExpense) {
                return res.status(200).json(existingExpense);
            }
        }

        const expense = await Expense.create({
            amount,
            category,
            description,
            date,
            idempotencyKey
        });

        res.status(201).json(expense);
    } catch (err) {
        console.error(err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: err.message });
        }
        // Handle duplicate key error if somehow race condition happens on idempotencyKey
        if (err.code === 11000) {
            const existing = await Expense.findOne({ idempotencyKey: req.body.idempotencyKey });
            if (existing) return res.status(200).json(existing);
        }
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
