const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
  centerName: { type: String, default: 'مركز أوميغا للدعم والتقوية واللغات' },
  subtitle: { type: String, default: 'Omega Center for Tutoring and Languages' },
  phone: { type: String, default: '0705782737' },
  email: { type: String, default: 'contact@centreomega.ma' },
  address: { type: String, default: 'شارع الحسن الثاني، العمارة 14، الطابق 2' },
  receiptPrefix: { type: String, default: 'N' },
  defaultLanguage: { type: String, default: 'ar' },
  currency: { type: String, default: 'درهم' }
}, { timestamps: true });

module.exports = mongoose.model('Setting', SettingSchema);
