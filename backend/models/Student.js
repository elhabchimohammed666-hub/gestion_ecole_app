const mongoose = require('mongoose');

const SubjectTeacherSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  teacher: { type: String, required: true },
  fee: { type: Number, default: 0 }
});

const StudentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  level: { type: String, required: true },
  phone: { type: String, required: true },
  monthlyFee: { type: Number, required: true, default: 500 },
  subjects: [SubjectTeacherSchema],
  status: { type: String, enum: ['active', 'departed'], default: 'active' },
  departureReason: { type: String, default: '' },
  departureDate: { type: Date, default: null },
  registrationDate: { type: Date, default: Date.now },
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
