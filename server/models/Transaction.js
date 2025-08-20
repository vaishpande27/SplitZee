const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paidBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    participants: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            share: {
                type: Number // Amount this participant owes
            }
        }
    ]
    // date: {
    //     type: Date,
    //     default: Date.now
    // }
    // type: {
    //     type: String,
    //     enum: ['expense', 'settle'],
    //     default: 'expense'
    // }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
