const express = require('express');
const { paypalCheckout, paypalPaymentVerification } = require('../controller/paymentCtrl'); 
const router = express.Router();

router.post('/checkout', paypalCheckout);
router.post('/verify', paypalPaymentVerification);

module.exports = router;
