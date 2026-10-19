const storage = require('../services/storageService');

exports.getPayments = async (req, res) => {
  try {
    const { month, search, status } = req.query;
    let payments = await storage.getPayments(month);

    if (search) {
      const q = search.toLowerCase().trim();
      payments = payments.filter(p => 
        (p.studentName && p.studentName.toLowerCase().includes(q)) ||
        (p.phone && p.phone.includes(q)) ||
        (p.receiptNumber && p.receiptNumber.toLowerCase().includes(q))
      );
    }

    if (status) {
      payments = payments.filter(p => p.status === status);
    }

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des paiements', error: error.message });
  }
};

exports.recordPayment = async (req, res) => {
  try {
    const { amountPaid, status, notes } = req.body;
    const payment = await storage.recordPayment(req.params.id, { amountPaid, status, notes });
    if (!payment) return res.status(404).json({ message: 'Paiement non trouvé' });
    res.json(payment);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de l\'enregistrement', error: error.message });
  }
};

exports.getReceiptData = async (req, res) => {
  try {
    const data = await storage.getDashboardStats();
    const payments = await storage.getPayments();
    const payment = payments.find(p => p._id === req.params.id || p.receiptNumber === req.params.id);
    if (!payment) return res.status(404).json({ message: 'Reçu non trouvé' });

    const student = await storage.getStudentById(payment.studentId);
    const settings = await storage.getSettings();

    res.json({
      receiptNumber: payment.receiptNumber || 'N5601',
      date: payment.paymentDate || new Date().toISOString(),
      studentName: payment.studentName,
      level: payment.level || (student ? student.level : ''),
      phone: payment.phone || (student ? student.phone : ''),
      month: payment.month,
      amountPaid: payment.amountPaid,
      totalDue: payment.totalDue,
      remaining: payment.remaining,
      status: payment.status,
      subjects: student ? student.subjects : [],
      settings
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
