const { FindCursor } = require('mongodb');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        // trim: true
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
    Transactions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Transaction'
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    Budgets: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Budget'
        }
    ],

});
const User = mongoose.model('User', UserSchema);

module.exports = User;