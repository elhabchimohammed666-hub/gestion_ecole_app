const storage = require('../services/storageService');
const { getDbStatus } = require('../config/db');

exports.getDashboardStats = async (req, res) => {
  try {
    const { month } = req.query;
    const stats = await storage.getDashboardStats(month || 'يناير 2026');
    const dbStatus = getDbStatus();
    res.json({
      ...stats,
      dbStatus
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du calcul des statistiques', error: error.message });
  }
};
