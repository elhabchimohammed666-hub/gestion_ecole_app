const storage = require('../services/storageService');

exports.getSettings = async (req, res) => {
  try {
    const settings = await storage.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Erreur', error: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const updated = await storage.updateSettings(req.body);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Erreur', error: error.message });
  }
};
