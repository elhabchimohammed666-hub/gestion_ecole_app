const storage = require('../services/storageService');

exports.getStudents = async (req, res) => {
  try {
    const { status, search, level } = req.query;
    let students = await storage.getStudents({ status: status || 'active' });
    
    if (search) {
      const q = search.toLowerCase().trim();
      students = students.filter(s => 
        (s.fullName && s.fullName.toLowerCase().includes(q)) ||
        (s.phone && s.phone.includes(q))
      );
    }

    if (level) {
      students = students.filter(s => s.level === level);
    }

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des élèves', error: error.message });
  }
};

exports.getDepartedStudents = async (req, res) => {
  try {
    const students = await storage.getStudents({ status: 'departed' });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des élèves partis', error: error.message });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const student = await storage.getStudentById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Élève non trouvé' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const newStudent = await storage.createStudent(req.body);
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ message: 'Données invalides', error: error.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const updated = await storage.updateStudent(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Élève non trouvé' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Erreur de mise à jour', error: error.message });
  }
};

exports.markDeparted = async (req, res) => {
  try {
    const { departureReason } = req.body;
    const updated = await storage.updateStudent(req.params.id, {
      status: 'departed',
      departureReason: departureReason || 'مغادرة المركز',
      departureDate: new Date().toISOString()
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Erreur', error: error.message });
  }
};

exports.reEnrollStudent = async (req, res) => {
  try {
    const updated = await storage.updateStudent(req.params.id, {
      status: 'active',
      departureReason: '',
      departureDate: null
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Erreur de réinscription', error: error.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    await storage.deleteStudent(req.params.id);
    res.json({ message: 'Élève supprimé définitivement' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression', error: error.message });
  }
};
