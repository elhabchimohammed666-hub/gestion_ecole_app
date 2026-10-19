const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: [
      'إيجار المركز', 
      'أجور الأساتذة', 
      'أجور العمال', 
      'الماء والكهرباء', 
      'اشتراك الإنترنت', 
      'مصاريف أخرى'
    ]
  },
  amount: { type: Number, required: true },
  month: { type: String, required: true }, // e.g. "يناير 2026"
  date: { type: Date, default: Date.now },
  recipient: { type: String, default: '' },
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Expense', ExpenseSchema);
