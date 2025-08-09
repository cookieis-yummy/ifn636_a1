const express = require('express');
const { getComplaints, addComplaint, updateComplaint, deleteComplaint } = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getComplaints).post(protect, addComplaint);
router.route('/:id').put(protect, updateComplaint).delete(protect, deleteComplaint);

module.exports = router;