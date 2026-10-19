const fs = require('fs');
const path = require('path');
const { isConnected } = require('../config/db');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Payment = require('../models/Payment');
const Expense = require('../models/Expense');
const Attendance = require('../models/Attendance');
const Timetable = require('../models/Timetable');
const Setting = require('../models/Setting');
const initialData = require('../seed/initialData');

const DATA_DIR = path.join(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Initialiser le stockage JSON si le fichier n'existe pas encore
function loadLocalData() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf8');
    return initialData;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return initialData;
  }
}

function saveLocalData(data) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

const storage = {
  // === ÉLÈVES ===
  async getStudents(filter = {}) {
    if (isConnected()) {
      return await Student.find(filter).sort({ createdAt: -1 });
    }
    const data = loadLocalData();
    let res = data.students || [];
    if (filter.status) {
      res = res.filter(s => s.status === filter.status);
    }
    return res;
  },

  async getStudentById(id) {
    if (isConnected()) {
      return await Student.findById(id);
    }
    const data = loadLocalData();
    return (data.students || []).find(s => s._id === id);
  },

  async createStudent(studentData) {
    if (isConnected()) {
      const s = await Student.create(studentData);
      // Créer automatiquement l'entrée de paiement pour le mois en cours
      await storage.ensureStudentPayment(s);
      return s;
    }
    const data = loadLocalData();
    const newStudent = {
      _id: 's_' + Date.now(),
      ...studentData,
      status: studentData.status || 'active',
      registrationDate: studentData.registrationDate || new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    data.students.unshift(newStudent);
    
    // Créer paiement associé
    const payment = {
      _id: 'p_' + Date.now(),
      studentId: newStudent._id,
      studentName: newStudent.fullName,
      level: newStudent.level,
      phone: newStudent.phone,
      month: 'يناير 2026',
      totalDue: newStudent.monthlyFee || 400,
      amountPaid: 0,
      remaining: newStudent.monthlyFee || 400,
      status: 'unpaid',
      receiptNumber: '',
      paymentDate: null,
      notes: ''
    };
    data.payments.unshift(payment);

    saveLocalData(data);
    return newStudent;
  },

  async updateStudent(id, updateData) {
    if (isConnected()) {
      return await Student.findByIdAndUpdate(id, updateData, { new: true });
    }
    const data = loadLocalData();
    const idx = data.students.findIndex(s => s._id === id);
    if (idx === -1) return null;
    data.students[idx] = { ...data.students[idx], ...updateData };
    
    // Mettre à jour aussi le nom dans les paiements si changé
    if (updateData.fullName || updateData.level || updateData.monthlyFee) {
      data.payments.forEach(p => {
        if (p.studentId === id) {
          if (updateData.fullName) p.studentName = updateData.fullName;
          if (updateData.level) p.level = updateData.level;
          if (updateData.phone) p.phone = updateData.phone;
        }
      });
    }

    saveLocalData(data);
    return data.students[idx];
  },

  async deleteStudent(id) {
    if (isConnected()) {
      await Payment.deleteMany({ studentId: id });
      await Attendance.deleteMany({ studentId: id });
      return await Student.findByIdAndDelete(id);
    }
    const data = loadLocalData();
    data.students = data.students.filter(s => s._id !== id);
    data.payments = data.payments.filter(p => p.studentId !== id);
    data.attendances = (data.attendances || []).filter(a => a.studentId !== id);
    saveLocalData(data);
    return { success: true };
  },

  // === PAIEMENTS ===
  async getPayments(month = 'يناير 2026') {
    if (isConnected()) {
      return await Payment.find(month ? { month } : {}).sort({ updatedAt: -1 });
    }
    const data = loadLocalData();
    return (data.payments || []).filter(p => !month || p.month === month);
  },

  async updatePayment(id, paymentData) {
    if (isConnected()) {
      return await Payment.findByIdAndUpdate(id, paymentData, { new: true });
    }
    const data = loadLocalData();
    const idx = data.payments.findIndex(p => p._id === id);
    if (idx === -1) return null;
    data.payments[idx] = { ...data.payments[idx], ...paymentData };
    saveLocalData(data);
    return data.payments[idx];
  },

  async recordPayment(id, { amountPaid, status, notes }) {
    const data = loadLocalData();
    const p = data.payments.find(x => x._id === id);
    if (!p) return null;

    const paid = Number(amountPaid);
    const total = Number(p.totalDue);
    const remaining = Math.max(0, total - paid);
    
    let calcStatus = status || (remaining === 0 ? 'paid' : (paid > 0 ? 'partial' : 'unpaid'));
    const receiptNumber = p.receiptNumber || ('N' + Math.floor(5600 + Math.random() * 4000));

    const updated = {
      ...p,
      amountPaid: paid,
      remaining,
      status: calcStatus,
      receiptNumber: calcStatus !== 'unpaid' ? receiptNumber : '',
      paymentDate: calcStatus !== 'unpaid' ? new Date().toISOString() : null,
      notes: notes || p.notes
    };

    if (isConnected()) {
      return await Payment.findByIdAndUpdate(id, updated, { new: true });
    }

    const idx = data.payments.findIndex(x => x._id === id);
    data.payments[idx] = updated;
    saveLocalData(data);
    return updated;
  },

  // === PROFESSEURS ===
  async getTeachers() {
    if (isConnected()) {
      return await Teacher.find().sort({ fullName: 1 });
    }
    const data = loadLocalData();
    return data.teachers || [];
  },

  async createTeacher(teacherData) {
    if (isConnected()) {
      return await Teacher.create(teacherData);
    }
    const data = loadLocalData();
    const newT = {
      _id: 't_' + Date.now(),
      ...teacherData,
      createdAt: new Date().toISOString()
    };
    data.teachers.push(newT);
    saveLocalData(data);
    return newT;
  },

  async updateTeacher(id, updateData) {
    if (isConnected()) {
      return await Teacher.findByIdAndUpdate(id, updateData, { new: true });
    }
    const data = loadLocalData();
    const idx = data.teachers.findIndex(t => t._id === id);
    if (idx === -1) return null;
    data.teachers[idx] = { ...data.teachers[idx], ...updateData };
    saveLocalData(data);
    return data.teachers[idx];
  },

  async deleteTeacher(id) {
    if (isConnected()) {
      return await Teacher.findByIdAndDelete(id);
    }
    const data = loadLocalData();
    data.teachers = data.teachers.filter(t => t._id !== id);
    saveLocalData(data);
    return { success: true };
  },

  // === DÉPENSES (EXPENSES) ===
  async getExpenses(month) {
    if (isConnected()) {
      const q = month ? { month } : {};
      return await Expense.find(q).sort({ date: -1 });
    }
    const data = loadLocalData();
    if (!month) return data.expenses || [];
    return (data.expenses || []).filter(e => e.month === month);
  },

  async createExpense(expenseData) {
    if (isConnected()) {
      return await Expense.create(expenseData);
    }
    const data = loadLocalData();
    const newExp = {
      _id: 'e_' + Date.now(),
      ...expenseData,
      date: expenseData.date || new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    data.expenses.unshift(newExp);
    saveLocalData(data);
    return newExp;
  },

  async deleteExpense(id) {
    if (isConnected()) {
      return await Expense.findByIdAndDelete(id);
    }
    const data = loadLocalData();
    data.expenses = data.expenses.filter(e => e._id !== id);
    saveLocalData(data);
    return { success: true };
  },

  // === ABSENCES (ATTENDANCE) ===
  async getAttendances(date) {
    if (isConnected()) {
      const q = date ? { date } : {};
      return await Attendance.find(q).sort({ createdAt: -1 });
    }
    const data = loadLocalData();
    if (!date) return data.attendances || [];
    return (data.attendances || []).filter(a => a.date === date);
  },

  async createAttendance(attData) {
    if (isConnected()) {
      return await Attendance.create(attData);
    }
    const data = loadLocalData();
    if (!data.attendances) data.attendances = [];
    const newAtt = {
      _id: 'a_' + Date.now(),
      ...attData,
      createdAt: new Date().toISOString()
    };
    data.attendances.unshift(newAtt);
    saveLocalData(data);
    return newAtt;
  },

  async deleteAttendance(id) {
    if (isConnected()) {
      return await Attendance.findByIdAndDelete(id);
    }
    const data = loadLocalData();
    data.attendances = (data.attendances || []).filter(a => a._id !== id);
    saveLocalData(data);
    return { success: true };
  },

  // === EMPLOI DU TEMPS (TIMETABLE) ===
  async getTimetable() {
    if (isConnected()) {
      return await Timetable.find().sort({ startTime: 1 });
    }
    const data = loadLocalData();
    return data.timetable || [];
  },

  async createTimetable(ttData) {
    if (isConnected()) {
      return await Timetable.create(ttData);
    }
    const data = loadLocalData();
    if (!data.timetable) data.timetable = [];
    const newTT = {
      _id: 'tt_' + Date.now(),
      ...ttData,
      createdAt: new Date().toISOString()
    };
    data.timetable.push(newTT);
    saveLocalData(data);
    return newTT;
  },

  async updateTimetable(id, updateData) {
    if (isConnected()) {
      return await Timetable.findByIdAndUpdate(id, updateData, { new: true });
    }
    const data = loadLocalData();
    const idx = (data.timetable || []).findIndex(t => t._id === id);
    if (idx === -1) return null;
    data.timetable[idx] = { ...data.timetable[idx], ...updateData };
    saveLocalData(data);
    return data.timetable[idx];
  },

  async deleteTimetable(id) {
    if (isConnected()) {
      return await Timetable.findByIdAndDelete(id);
    }
    const data = loadLocalData();
    data.timetable = (data.timetable || []).filter(t => t._id !== id);
    saveLocalData(data);
    return { success: true };
  },

  // === STATISTIQUES & RAPPORTS ===
  async getDashboardStats(month = 'يناير 2026') {
    const data = loadLocalData();
    const students = data.students || [];
    const activeStudents = students.filter(s => s.status === 'active');
    const departedStudents = students.filter(s => s.status === 'departed');
    const teachers = data.teachers || [];
    const payments = (data.payments || []).filter(p => !month || p.month === month);
    const expenses = (data.expenses || []).filter(e => !month || e.month === month);
    const attendances = data.attendances || [];

    const paidCount = payments.filter(p => p.status === 'paid').length;
    const partialCount = payments.filter(p => p.status === 'partial').length;
    const unpaidCount = payments.filter(p => p.status === 'unpaid').length;

    const totalRevenue = payments.reduce((sum, p) => sum + (Number(p.amountPaid) || 0), 0);
    const expectedRevenue = payments.reduce((sum, p) => sum + (Number(p.totalDue) || 0), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    const netProfit = totalRevenue - totalExpenses;

    // Répartition par niveau
    const levelCounts = {};
    activeStudents.forEach(s => {
      const lvl = s.level || 'غير محدد';
      levelCounts[lvl] = (levelCounts[lvl] || 0) + 1;
    });

    // Répartition par matière
    const subjectCounts = {};
    activeStudents.forEach(s => {
      (s.subjects || []).forEach(sub => {
        const name = sub.subject || 'أخرى';
        subjectCounts[name] = (subjectCounts[name] || 0) + 1;
      });
    });

    // Répartition par professeur
    const teacherStudentCounts = {};
    teachers.forEach(t => { teacherStudentCounts[t.fullName] = 0; });
    activeStudents.forEach(s => {
      (s.subjects || []).forEach(sub => {
        if (sub.teacher && teacherStudentCounts[sub.teacher] !== undefined) {
          teacherStudentCounts[sub.teacher]++;
        } else if (sub.teacher) {
          teacherStudentCounts[sub.teacher] = (teacherStudentCounts[sub.teacher] || 0) + 1;
        }
      });
    });

    // Répartition des dépenses par catégorie
    const expensesByCategory = {};
    expenses.forEach(e => {
      const cat = e.category || 'مصاريف أخرى';
      expensesByCategory[cat] = (expensesByCategory[cat] || 0) + (Number(e.amount) || 0);
    });

    // Évolution des inscriptions (par mois)
    const monthlyRegistrations = [
      { month: 'شتنبر', count: 95 },
      { month: 'أكتوبر', count: 48 },
      { month: 'نونبر', count: 32 },
      { month: 'دجنبر', count: 18 },
      { month: 'يناير', count: 11 }
    ];

    // Comparaison des revenus avec les mois précédents
    const monthlyFinancials = [
      { month: 'أكتوبر 2025', revenue: 32000, expenses: 18500, profit: 13500 },
      { month: 'نونبر 2025', revenue: 35500, expenses: 19200, profit: 16300 },
      { month: 'دجنبر 2025', revenue: 36800, expenses: 20100, profit: 16700 },
      { month: 'يناير 2026', revenue: totalRevenue, expenses: totalExpenses, profit: netProfit }
    ];

    return {
      month,
      totalStudents: activeStudents.length,
      departedCount: departedStudents.length,
      totalTeachers: teachers.length,
      paidCount,
      partialCount,
      unpaidCount,
      totalRevenue,
      expectedRevenue,
      totalExpenses,
      netProfit,
      absencesCount: attendances.length,
      recentPayments: payments.slice(0, 7),
      newRegistrations: activeStudents.slice(0, 5),
      lateStudents: payments.filter(p => p.status === 'unpaid').slice(0, 15),
      levelCounts,
      subjectCounts,
      teacherStudentCounts,
      expensesByCategory,
      monthlyRegistrations,
      monthlyFinancials
    };
  },

  // === PARAMÈTRES (SETTINGS) ===
  async getSettings() {
    if (isConnected()) {
      let s = await Setting.findOne();
      if (!s) s = await Setting.create(initialData.settings);
      return s;
    }
    const data = loadLocalData();
    return data.settings || initialData.settings;
  },

  async updateSettings(newSettings) {
    if (isConnected()) {
      let s = await Setting.findOne();
      if (!s) return await Setting.create(newSettings);
      return await Setting.findByIdAndUpdate(s._id, newSettings, { new: true });
    }
    const data = loadLocalData();
    data.settings = { ...data.settings, ...newSettings };
    saveLocalData(data);
    return data.settings;
  }
};

module.exports = storage;
