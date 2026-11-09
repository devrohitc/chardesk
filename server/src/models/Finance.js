const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    date: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      default: 'Food',
    },
    kind: {
      type: String,
      enum: ['expense', 'income'],
      default: 'expense',
    },
  },
  { _id: false }
);

const billSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    dueDay: {
      type: Number,
      required: true,
      min: 1,
      max: 31,
      default: 5,
    },
    category: {
      type: String,
      default: 'Bills',
    },
  },
  { _id: false }
);

const financeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    income: {
      type: String,
      default: '50000',
    },
    budget: {
      type: String,
      default: '12000',
    },
    expenses: [transactionSchema],
    bills: [billSchema],
    billPayments: {
      type: Map,
      of: Boolean,
      default: () => new Map(),
    },
  },
  {
    timestamps: true,
  }
);

financeSchema.methods.toJSON = function () {
  const paymentsObj = this.billPayments instanceof Map ? Object.fromEntries(this.billPayments) : (this.billPayments || {});
  return {
    income: this.income,
    budget: this.budget,
    expenses: this.expenses || [],
    bills: this.bills || [],
    billPayments: paymentsObj,
  };
};

module.exports = mongoose.model('Finance', financeSchema);
