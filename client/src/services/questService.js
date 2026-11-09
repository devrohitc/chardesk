import api from './api';

export const questService = {
  async getQuests() {
    return api.get('/quests');
  },

  async createQuest(questData) {
    return api.post('/quests', questData);
  },

  async toggleQuest(id, date) {
    return api.put(`/quests/${id}/toggle`, { date });
  },

  async deleteQuest(id) {
    return api.delete(`/quests/${id}`);
  },
};

export default questService;
