const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');
const authMiddleware = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const {
  createTransactionValidator,
  createBillValidator,
} = require('../validators/financeValidators');

router.use(authMiddleware);

router.get('/', financeController.getFinance);
router.put('/', financeController.updateFinance);

router.post('/transactions', createTransactionValidator, validate, financeController.addTransaction);
router.delete('/transactions/:id', financeController.deleteTransaction);

router.post('/bills', createBillValidator, validate, financeController.addBill);
router.put('/bills/:id/toggle', financeController.toggleBillPayment);
router.delete('/bills/:id', financeController.deleteBill);

module.exports = router;

