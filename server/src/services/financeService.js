const Finance = require('../models/Finance');

async function getFinance(userId) {
  let finance = await Finance.findOne({ user: userId });
  if (!finance) {
    finance = await Finance.create({
      user: userId,
      income: '50000',
      budget: '12000',
      expenses: [],
      bills: [],
    });
  }
  return finance;
}

async function updateFinance(userId, updateData) {
  const finance = await getFinance(userId);
  if (updateData.income !== undefined) finance.income = String(updateData.income);
  if (updateData.budget !== undefined) finance.budget = String(updateData.budget);
  await finance.save();
  return finance;
}

async function addTransaction(userId, transaction) {
  const finance = await getFinance(userId);
  const newTx = {
    id: transaction.id || new Date().getTime().toString(),
    date: transaction.date,
    description: transaction.description,
    amount: Number(transaction.amount),
    category: transaction.category || 'Food',
    kind: transaction.kind || 'expense',
  };
  finance.expenses.unshift(newTx);
  await finance.save();
  return newTx;
}

async function deleteTransaction(userId, transactionId) {
  const finance = await getFinance(userId);
  finance.expenses = finance.expenses.filter((t) => t.id !== transactionId);
  await finance.save();
  return { id: transactionId };
}

async function addBill(userId, bill) {
  const finance = await getFinance(userId);
  const newBill = {
    id: bill.id || new Date().getTime().toString(),
    name: bill.name,
    amount: Number(bill.amount),
    dueDay: Number(bill.dueDay) || 5,
    category: bill.category || 'Bills',
  };
  finance.bills.unshift(newBill);
  await finance.save();
  return newBill;
}

async function toggleBillPayment(userId, billId, monthKey) {
  const finance = await getFinance(userId);
  const payments = finance.billPayments instanceof Map
    ? finance.billPayments
    : new Map(Object.entries(finance.billPayments || {}));

  const key = `${monthKey}:${billId}`;
  const currentStatus = Boolean(payments.get(key));
  payments.set(key, !currentStatus);
  finance.billPayments = payments;
  await finance.save();

  return { key, paid: !currentStatus };
}

async function deleteBill(userId, billId) {
  const finance = await getFinance(userId);
  finance.bills = finance.bills.filter((b) => b.id !== billId);
  await finance.save();
  return { id: billId };
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

