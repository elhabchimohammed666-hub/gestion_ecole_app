const express = require('express');
const router = express.Router();
const timetableController = require('../controllers/timetableController');

router.get('/', timetableController.getTimetable);
router.post('/', timetableController.createSession);
router.put('/:id', timetableController.updateSession);
router.delete('/:id', timetableController.deleteSession);

module.exports = router;
