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

  // From complaintfeatures
  photos: [{ type: String, default: [] }],

  // From main
  feedback: {
    text: { type: String, default: '' },
    rating: { type: Number, min: 1, max: 5 },
  },
});

module.exports = mongoose.model('Complaint', complaintSchema);
