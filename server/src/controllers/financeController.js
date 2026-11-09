const financeService = require('../services/financeService');
const { sendSuccess } = require('../utils/apiResponse');
const { HTTP_STATUS } = require('../constants/httpStatusCodes');

async function getFinance(req, res, next) {
  try {
    const finance = await financeService.getFinance(req.user._id);
    return sendSuccess(res, finance);
  } catch (error) {
    next(error);
  }
}

async function updateFinance(req, res, next) {
  try {
    const updated = await financeService.updateFinance(req.user._id, req.body);
    return sendSuccess(res, updated, 'Finance updated');
  } catch (error) {
    next(error);
  }
}

async function addTransaction(req, res, next) {
  try {
    const tx = await financeService.addTransaction(req.user._id, req.body);
    return sendSuccess(res, tx, 'Transaction added', HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
}

async function deleteTransaction(req, res, next) {
  try {
    const { id } = req.params;
    const result = await financeService.deleteTransaction(req.user._id, id);
    return sendSuccess(res, result, 'Transaction deleted');
  } catch (error) {
    next(error);
  }
}

async function addBill(req, res, next) {
  try {
    const bill = await financeService.addBill(req.user._id, req.body);
    return sendSuccess(res, bill, 'Bill added', HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
}

async function toggleBillPayment(req, res, next) {
  try {
    const { id } = req.params;
    const { monthKey } = req.body;
    const result = await financeService.toggleBillPayment(req.user._id, id, monthKey);
    return sendSuccess(res, result, 'Bill payment toggled');
  } catch (error) {
    next(error);
  }
}

async function deleteBill(req, res, next) {
  try {
    const { id } = req.params;
    const result = await financeService.deleteBill(req.user._id, id);
    return sendSuccess(res, result, 'Bill deleted');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getFinance,
  updateFinance,
  addTransaction,
  deleteTransaction,
  addBill,
  toggleBillPayment,
  deleteBill,
};

