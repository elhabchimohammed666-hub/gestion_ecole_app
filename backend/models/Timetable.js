const mongoose = require('mongoose');

const TimetableSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  teacher: { type: String, required: true },
  level: { type: String, required: true },
  day: { 
    type: String, 
    required: true,
    enum: ['الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد']
  },
  startTime: { type: String, required: true }, // e.g. "10:00"
  endTime: { type: String, required: true },   // e.g. "12:00"
  room: { type: String, default: 'قاعة 1' },
  color: { type: String, default: '#0f766e' }
}, { timestamps: true });

module.exports = mongoose.model('Timetable', TimetableSchema);
