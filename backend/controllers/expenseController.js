const storage = require('../services/storageService');

exports.getExpenses = async (req, res) => {
  try {
    const { month } = req.query;
    const expenses = await storage.getExpenses(month);
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Erreur', error: error.message });
  }
};

exports.createExpense = async (req, res) => {
  try {
    const newExp = await storage.createExpense(req.body);
    res.status(201).json(newExp);
  } catch (error) {
    res.status(400).json({ message: 'Erreur', error: error.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    await storage.deleteExpense(req.params.id);
    res.json({ message: 'Dépense supprimée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur', error: error.message });
  }
};
