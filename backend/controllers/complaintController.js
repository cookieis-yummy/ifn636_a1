const Complaint = require('../models/Complaint');

// Get Complaints (READ)
const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user.id });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add Complaint (CREATE)
const addComplaint = async (req, res) => {
  const { title, description, date } = req.body;
  try {
    const complaint = await Complaint.create({
      userId: req.user.id,
      title,
      description,
      date, // status defaults in schema
    });
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Complaint (UPDATE)
const updateComplaint = async (req, res) => {
  const { title, description, completed, date } = req.body;
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    complaint.title = title || complaint.title;
    complaint.description = description || complaint.description;
    complaint.completed = (typeof completed === 'boolean') ? completed : complaint.completed;
    complaint.date = date || complaint.date;

    const updated = await complaint.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Complaint (DELETE)
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    await complaint.remove();
    res.json({ message: 'Complaint deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// List all closed complaints
const getClosedComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      userId: req.user.id,
      status: 'closed',
    }).sort({ date: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Save / Update feedback
const saveFeedback = async (req, res) => {
  try {
    const { text, rating } = req.body;

    const complaint = await Complaint.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    // Ensure subdoc exists
    complaint.feedback = complaint.feedback || {};

    if (rating !== undefined) {
      const num = Number(rating);
      if (!Number.isInteger(num) || num < 1 || num > 5) {
        return res.status(400).json({ message: 'Rating must be an integer between 1 and 5' });
      }
      complaint.feedback.rating = num;
    }

    if (text !== undefined) {
      complaint.feedback.text = String(text);
    }

    const updated = await complaint.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete feedback
const deleteFeedback = async (req, res) => {
  try {
    const complaint = await Complaint.findOne({ _id: req.params.id, userId: req.user.id });
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    complaint.feedback = undefined;
    const updated = await complaint.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getComplaints,
  addComplaint,
  updateComplaint,
  deleteComplaint,
  getClosedComplaints,
  saveFeedback,
  deleteFeedback,
};
