const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.get('/', paymentController.getPayments);
router.put('/:id', paymentController.recordPayment);
router.get('/receipt/:id', paymentController.getReceiptData);

module.exports = router;
