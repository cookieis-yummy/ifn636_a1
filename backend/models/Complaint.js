const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    completed: { type: Boolean, default: false },
    date: { type: Date },
});

module.exports = mongoose.model('Complaint', complaintSchema);