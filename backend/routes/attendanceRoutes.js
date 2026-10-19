const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.get('/', attendanceController.getAttendances);
router.post('/', attendanceController.createAttendance);
router.delete('/:id', attendanceController.deleteAttendance);

module.exports = router;
