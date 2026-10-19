const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  subject: { type: String, required: true },
  phone: { type: String, required: true },
  hourlyRate: { type: Number, default: 150 },
  hoursPerWeek: { type: Number, default: 4 },
  percentage: { type: Number, default: 50 }, // percentage of student fees or fixed hourly
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Teacher', TeacherSchema);
