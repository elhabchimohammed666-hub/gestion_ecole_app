const storage = require('../services/storageService');

exports.getTimetable = async (req, res) => {
  try {
    const list = await storage.getTimetable();
    const teachers = await storage.getTeachers();

    // Calculer les heures par semaine pour chaque prof
    const teacherHours = {};
    teachers.forEach(t => { teacherHours[t.fullName] = 0; });

    list.forEach(item => {
      if (item.teacher) {
        // Estimer la durée de la séance
        let duration = 2; // défaut 2 heures
        if (item.startTime && item.endTime) {
          const [h1, m1] = item.startTime.split(':').map(Number);
          const [h2, m2] = item.endTime.split(':').map(Number);
          const diff = (h2 * 60 + m2) - (h1 * 60 + m1);
          if (diff > 0) duration = diff / 60;
        }
        teacherHours[item.teacher] = (teacherHours[item.teacher] || 0) + duration;
      }
    });

    res.json({
      sessions: list,
      teacherHours
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur', error: error.message });
  }
};

exports.createSession = async (req, res) => {
  try {
    const newSession = await storage.createTimetable(req.body);
    res.status(201).json(newSession);
  } catch (error) {
    res.status(400).json({ message: 'Erreur', error: error.message });
  }
};

exports.updateSession = async (req, res) => {
  try {
    const updated = await storage.updateTimetable(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Séance non trouvée' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Erreur', error: error.message });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    await storage.deleteTimetable(req.params.id);
    res.json({ message: 'Séance supprimée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur', error: error.message });
  }
};
