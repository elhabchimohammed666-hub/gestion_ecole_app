const storage = require('../services/storageService');

exports.getTeachers = async (req, res) => {
  try {
    const teachers = await storage.getTeachers();
    const students = await storage.getStudents({ status: 'active' });

    // Calculer le nombre d'élèves pour chaque professeur
    const teachersWithCounts = teachers.map(t => {
      const teacherObj = t.toObject ? t.toObject() : { ...t };
      const teacherStudents = students.filter(s => 
        (s.subjects || []).some(sub => sub.teacher === t.fullName || sub.teacher === teacherObj.fullName)
      );
      return {
        ...teacherObj,
        studentCount: teacherStudents.length
      };
    });

    res.json(teachersWithCounts);
  } catch (error) {
    res.status(500).json({ message: 'Erreur', error: error.message });
  }
};

exports.getTeacherStudents = async (req, res) => {
  try {
    const teachers = await storage.getTeachers();
    const teacher = teachers.find(t => t._id === req.params.id || t.fullName === req.params.id);
    if (!teacher) return res.status(404).json({ message: 'Professeur non trouvé' });

    const students = await storage.getStudents({ status: 'active' });
    const enrolledStudents = students.filter(s => 
      (s.subjects || []).some(sub => sub.teacher === teacher.fullName)
    );

    const settings = await storage.getSettings();

    res.json({
      teacher,
      students: enrolledStudents,
      totalCount: enrolledStudents.length,
      settings
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur', error: error.message });
  }
};

exports.createTeacher = async (req, res) => {
  try {
    const newTeacher = await storage.createTeacher(req.body);
    res.status(201).json(newTeacher);
  } catch (error) {
    res.status(400).json({ message: 'Erreur', error: error.message });
  }
};

exports.updateTeacher = async (req, res) => {
  try {
    const updated = await storage.updateTeacher(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Professeur non trouvé' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Erreur', error: error.message });
  }
};

exports.deleteTeacher = async (req, res) => {
  try {
    await storage.deleteTeacher(req.params.id);
    res.json({ message: 'Professeur supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur', error: error.message });
  }
};
