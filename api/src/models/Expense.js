const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: [true, 'Please add a positive amount'],
        min: [0, 'Amount must be positive']
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        trim: true
    },
    date: {
        type: Date,
        required: [true, 'Please add a date'],
        default: Date.now
    },
    idempotencyKey: {
        type: String,
        unique: true,
        sparse: true // Allows null/undefined values to not conflict, though we should enforce it in controller
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Expense', ExpenseSchema);
