import api from './api';

export const financeService = {
  async getFinance() {
    return api.get('/finance');
  },

  async updateFinance(data) {
    return api.put('/finance', data);
  },

  async addTransaction(transaction) {
    return api.post('/finance/transactions', transaction);
  },

  async deleteTransaction(id) {
    return api.delete(`/finance/transactions/${id}`);
  },

  async addBill(bill) {
    return api.post('/finance/bills', bill);
  },

  async toggleBill(monthKey, billId) {
    return api.put(`/finance/bills/${billId}/toggle`, { monthKey });
  },

  async deleteBill(id) {
    return api.delete(`/finance/bills/${id}`);
  },
};

export default financeService;
