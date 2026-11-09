import React, { useState } from 'react';
import { ArrowDownRight, CalendarDays, Check, ChevronLeft, ChevronRight, Coins, Plus, Wallet, X } from 'lucide-react';
import { formatDate, shiftDate, CURRENCY } from '../utils/formatters';
import { Tag } from '../components/Tag';
import { SectionHeading } from '../components/SectionHeading';

export function FinancePage({ selectedDate, setSelectedDate, finance, setFinance }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [kind, setKind] = useState('expense');

  const expenses = finance.expenses || [];
  const bills = finance.bills || [];
  const billPayments = finance.billPayments || {};
  const month = selectedDate.slice(0, 7);
  const monthItems = expenses.filter((item) => item.date?.startsWith(month));
  const spent = monthItems
    .filter((item) => item.kind !== 'income')
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const extraIncome = monthItems
    .filter((item) => item.kind === 'income')
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const budget = Number(finance.budget || 0);
  const income = Number(finance.income || 0) + extraIncome;

  const addTransaction = (event) => {
    event.preventDefault();
    const value = Number(amount);
    if (!description.trim() || !Number.isFinite(value) || value <= 0) return;
    setFinance((prev) => ({
      ...prev,
      expenses: [
        {
          id: (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
          date: selectedDate,
          description: description.trim(),
          amount: value,
          category,
          kind,
        },
        ...(prev.expenses || []),
      ],
    }));
    setDescription('');
    setAmount('');
  };

  const removeTransaction = (id) =>
    setFinance((prev) => ({
      ...prev,
      expenses: (prev.expenses || []).filter((item) => item.id !== id),
    }));

  const addBill = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name') || '').trim();
    const billAmount = Number(data.get('amount'));
    const dueDay = Math.min(31, Math.max(1, Number(data.get('dueDay')) || 1));
    if (!name || !Number.isFinite(billAmount) || billAmount <= 0) return;
    setFinance((prev) => ({
      ...prev,
      bills: [
        {
          id: (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
          name,
          amount: billAmount,
          dueDay,
          category: String(data.get('category') || 'Bills'),
        },
        ...(prev.bills || []),
      ],
    }));
    event.currentTarget.reset();
  };

  const toggleBill = (id) => {
    const key = `${month}:${id}`;
    setFinance((prev) => ({
      ...prev,
      billPayments: {
        ...(prev.billPayments || {}),
        [key]: !prev.billPayments?.[key],
      },
    }));
  };

  const removeBill = (id) =>
    setFinance((prev) => ({
      ...prev,
      bills: (prev.bills || []).filter((bill) => bill.id !== id),
    }));

  return (
    <div className="page-content">
      <div className="page-intro">
        <div>
          <span className="eyebrow">YOUR COIN POUCH</span>
          <h1>
            Money map <span className="wave">✦</span>
          </h1>
          <p className="muted">Understand your spending without making finance feel complicated.</p>
        </div>
        <div className="date-picker">
          <button
            className="icon-button"
            onClick={() => setSelectedDate(shiftDate(selectedDate, -30))}
            aria-label="Previous period"
          >
            <ChevronLeft size={17} />
          </button>
          <label>
            <CalendarDays size={15} />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
            />
          </label>
          <button
            className="icon-button"
            onClick={() => setSelectedDate(shiftDate(selectedDate, 30))}
            aria-label="Next period"
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </div>

      <div className="finance-stat-grid">
        <article className="panel finance-stat">
          <span className="finance-icon mint">
            <ArrowDownRight size={19} />
          </span>
          <span className="eyebrow">MONTHLY INCOME</span>
          <strong>{CURRENCY.format(income)}</strong>
          <label className="form-label inline-setting">
            Salary / monthly income
            <input
              type="number"
              min="0"
              value={finance.income}
              onChange={(e) => setFinance((prev) => ({ ...prev, income: e.target.value }))}
            />
          </label>
        </article>
        <article className="panel finance-stat">
          <span className="finance-icon peach">
            <Wallet size={19} />
          </span>
          <span className="eyebrow">SPENDING THIS MONTH</span>
          <strong>{CURRENCY.format(spent)}</strong>
          <div className="progress-track finance-track">
            <span style={{ width: `${budget ? Math.min(100, (spent / budget) * 100) : 0}%` }} />
          </div>
          <span className="tiny-note">
            {budget ? `${Math.round((spent / budget) * 100)}% of your planned budget` : 'Set a budget to compare spending'}
          </span>
        </article>
        <article className="panel finance-stat">
          <span className="finance-icon lavender">
            <Coins size={19} />
          </span>
          <span className="eyebrow">PLANNED BUDGET</span>
          <strong>{CURRENCY.format(budget)}</strong>
          <label className="form-label inline-setting">
            Monthly budget
            <input
              type="number"
              min="0"
              value={finance.budget}
              onChange={(e) => setFinance((prev) => ({ ...prev, budget: e.target.value }))}
            />
          </label>
        </article>
      </div>

      <div className="finance-layout">
        <form className="panel transaction-form" onSubmit={addTransaction}>
          <SectionHeading eyebrow="QUICK CAPTURE" title="Add transaction" />
          <div className="segmented-control">
            <button
              type="button"
              className={kind === 'expense' ? 'selected' : ''}
              onClick={() => setKind('expense')}
            >
              Expense
            </button>
            <button
              type="button"
              className={kind === 'income' ? 'selected' : ''}
              onClick={() => setKind('income')}
            >
              Income
            </button>
          </div>
          <label className="form-label">
            Description
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Groceries, salary, internet bill"
            />
          </label>
          <label className="form-label">
            Amount (₹)
            <input
              type="number"
              min="1"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </label>
          <label className="form-label">
            Category
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {[
                'Food',
                'Transport',
                'Bills',
                'Shopping',
                'Health',
                'Gym',
                'Entertainment',
                'EMI / Debt',
                'Savings',
                'Salary',
                'Other',
              ].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="primary-button full-button"
            disabled={!description.trim() || !(Number(amount) > 0)}
          >
            <Plus size={15} /> Add transaction
          </button>
          <p className="tiny-note">This local prototype does not connect to your bank.</p>
        </form>

        <section className="panel transactions-panel">
          <SectionHeading
            eyebrow={formatDate(`${month}-15`, { month: 'long', year: 'numeric' }).toUpperCase()}
            title="Transaction history"
          />
          <div className="transaction-list">
            {monthItems.length ? (
              monthItems.map((item) => (
                <div className="transaction-row" key={item.id}>
                  <span className={`transaction-icon ${item.kind === 'income' ? 'income-icon' : ''}`}>
                    {item.kind === 'income' ? <ArrowDownRight size={16} /> : <Wallet size={16} />}
                  </span>
                  <div className="transaction-info">
                    <strong>{item.description}</strong>
                    <span>
                      {item.category} · {formatDate(item.date, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <strong className={item.kind === 'income' ? 'positive-amount' : 'negative-amount'}>
                    {item.kind === 'income' ? '+' : '−'}
                    {CURRENCY.format(Number(item.amount))}
                  </strong>
                  <button
                    className="icon-button delete-transaction"
                    onClick={() => removeTransaction(item.id)}
                    aria-label={`Delete ${item.description}`}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <Wallet size={26} />
                <strong>No transactions yet</strong>
                <span>Add your first expense or income to start the monthly picture.</span>
              </div>
            )}
          </div>
          <div className="transaction-summary">
            <span>Net tracked this month</span>
            <strong>{CURRENCY.format(income - spent)}</strong>
          </div>
        </section>
      </div>

      <section className="panel bills-panel">
        <SectionHeading eyebrow="RECURRING PAYMENTS" title="Monthly bills" />
        <p className="muted bills-intro">
          Add a recurring bill once, then mark it paid for each month. Marking a bill paid does not create a
          transaction automatically, so you stay in control of expense records.
        </p>
        <form className="bill-form" onSubmit={addBill}>
          <label className="form-label">
            Bill name
            <input name="name" required maxLength={80} placeholder="Rent, mobile plan, EMI…" />
          </label>
          <label className="form-label">
            Amount (₹)
            <input name="amount" type="number" min="1" step="0.01" required placeholder="0.00" />
          </label>
          <label className="form-label">
            Due day
            <input name="dueDay" type="number" min="1" max="31" defaultValue="5" required />
          </label>
          <label className="form-label">
            Category
            <select name="category">
              <option>Bills</option>
              <option>EMI / Debt</option>
              <option>Utilities</option>
              <option>Subscription</option>
              <option>Rent</option>
              <option>Other</option>
            </select>
          </label>
          <button className="primary-button bill-add-button" type="submit">
            <Plus size={15} /> Add bill
          </button>
        </form>
        <div className="bill-list">
          {bills.length ? (
            bills.map((bill) => {
              const key = `${month}:${bill.id}`;
              const paid = Boolean(billPayments[key]);
              const day = Number(selectedDate.slice(8, 10));
              const overdue = !paid && Number(bill.dueDay) < day;
              return (
                <div className="bill-row" key={bill.id}>
                  <span className={`bill-status-icon ${paid ? 'paid' : overdue ? 'overdue' : ''}`}>
                    {paid ? <Check size={16} /> : <CalendarDays size={16} />}
                  </span>
                  <div className="bill-info">
                    <strong>{bill.name}</strong>
                    <span>
                      {bill.category} · Due day {bill.dueDay}
                    </span>
                  </div>
                  <strong className="bill-amount">{CURRENCY.format(Number(bill.amount))}</strong>
                  <Tag variant={paid ? 'green' : overdue ? 'yellow' : ''}>
                    {paid ? 'Paid' : overdue ? 'Past due' : 'Upcoming'}
                  </Tag>
                  <button
                    className={`secondary-button bill-toggle ${paid ? 'bill-unpaid' : ''}`}
                    onClick={() => toggleBill(bill.id)}
                  >
                    {paid ? 'Mark unpaid' : 'Mark paid'}
                  </button>
                  <button
                    className="icon-button"
                    aria-label={`Delete ${bill.name}`}
                    onClick={() => removeBill(bill.id)}
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })
          ) : (
            <div className="empty-state">
              <CalendarDays size={25} />
              <strong>No monthly bills yet</strong>
              <span>Add rent, subscriptions, EMIs or utility bills to keep due dates visible.</span>
            </div>
          )}
        </div>
      </section>
      <p className="tiny-note routine-disclaimer">
        Budget values, bills and transactions are saved in this browser only. This is not accounting or financial advice.
      </p>
    </div>
  );
}

export default FinancePage;

