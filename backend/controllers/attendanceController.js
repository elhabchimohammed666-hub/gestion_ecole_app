const storage = require('../services/storageService');

exports.getAttendances = async (req, res) => {
  try {
    const { date } = req.query;
    const attendances = await storage.getAttendances(date);
    res.json(attendances);
  } catch (error) {
    res.status(500).json({ message: 'Erreur', error: error.message });
  }
};

exports.createAttendance = async (req, res) => {
  try {
    const { studentId, studentName, level, subject, teacher, phone, date, reason } = req.body;
    let sName = studentName;
    let sLevel = level;
    let sPhone = phone;

    if (studentId && (!sName || !sPhone)) {
      const student = await storage.getStudentById(studentId);
      if (student) {
        sName = sName || student.fullName;
        sLevel = sLevel || student.level;
        sPhone = sPhone || student.phone;
      }
    }

    const newAtt = await storage.createAttendance({
      studentId,
      studentName: sName,
      level: sLevel,
      subject: subject || '',
      teacher: teacher || '',
      phone: sPhone,
      date: date || new Date().toISOString().split('T')[0],
      status: 'absent',
      reason: reason || 'بدون عذر'
    });

    res.status(201).json(newAtt);
  } catch (error) {
    res.status(400).json({ message: 'Erreur', error: error.message });
  }
};

exports.deleteAttendance = async (req, res) => {
  try {
    await storage.deleteAttendance(req.params.id);
    res.json({ message: 'Absence supprimée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur', error: error.message });
  }
};
