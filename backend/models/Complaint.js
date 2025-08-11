const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false },
  date: { type: Date },
  status: {
    type: String,
    enum: ['received', 'resolving', 'closed'],
    default: 'received',
  },
  photos: [{ type: String }],
});

module.exports = mongoose.model('Complaint', complaintSchema);
