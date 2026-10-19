require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');

// Protection contre les arrêts inattendus
process.on('uncaughtException', (err) => {
  console.log('[Serveur] Exception interceptée:', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.log('[Serveur] Promesse rejetée interceptée:', reason);
});

// Importer les routes
const studentRoutes = require('./routes/studentRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const timetableRoutes = require('./routes/timetableRoutes');
const statsRoutes = require('./routes/statsRoutes');
const settingRoutes = require('./routes/settingRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes API
app.use('/api/students', studentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/attendances', attendanceRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/settings', settingRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Système de Gestion de Centre de Soutien Scolaire & Langues',
    timestamp: new Date().toISOString()
  });
});

// Démarrer la connexion DB et le serveur
connectDB().finally(() => {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`  Serveur Backend démarré sur http://localhost:${PORT}`);
    console.log(`  API disponible sur http://localhost:${PORT}/api/health`);
    console.log(`=======================================================`);
  });
});
