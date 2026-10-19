const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  studentName: { type: String, required: true },
  level: { type: String, default: '' },
  phone: { type: String, default: '' },
  month: { type: String, required: true }, // e.g. "يناير 2026"
  totalDue: { type: Number, required: true },
  amountPaid: { type: Number, required: true, default: 0 },
  remaining: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['paid', 'partial', 'unpaid'], 
    default: 'unpaid' 
  },
  receiptNumber: { type: String, default: '' },
  paymentDate: { type: Date, default: null },
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
