const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  studentName: { type: String, required: true },
  level: { type: String, default: '' },
  subject: { type: String, default: '' },
  teacher: { type: String, default: '' },
  phone: { type: String, default: '' },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  status: { type: String, enum: ['absent', 'present', 'late'], default: 'absent' },
  reason: { type: String, default: 'بدون عذر' },
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
