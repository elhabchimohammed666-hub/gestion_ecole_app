const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.get('/', studentController.getStudents);
router.get('/departed', studentController.getDepartedStudents);
router.get('/:id', studentController.getStudentById);
router.post('/', studentController.createStudent);
router.put('/:id', studentController.updateStudent);
router.put('/:id/depart', studentController.markDeparted);
router.put('/:id/re-enroll', studentController.reEnrollStudent);
router.delete('/:id', studentController.deleteStudent);

module.exports = router;
