import api from './api';

export const dailyLogService = {
  async getLogByDate(date) {
    return api.get(`/logs/${date}`);
  },

  async updateLog(date, patch) {
    return api.put(`/logs/${date}`, patch);
  },
};

export default dailyLogService;

