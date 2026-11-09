const questService = require('../services/questService');
const { sendSuccess } = require('../utils/apiResponse');
const { HTTP_STATUS } = require('../constants/httpStatusCodes');

async function getQuests(req, res, next) {
  try {
    const quests = await questService.getQuests(req.user._id);
    return sendSuccess(res, quests);
  } catch (error) {
    next(error);
  }
}

async function createQuest(req, res, next) {
  try {
    const quest = await questService.createQuest(req.user._id, req.body);
    return sendSuccess(res, quest, 'Quest created', HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
}

async function toggleQuest(req, res, next) {
  try {
    const { id } = req.params;
    const { date } = req.body;
    const result = await questService.toggleQuest(req.user._id, id, date);
    return sendSuccess(res, result, 'Quest toggled');
  } catch (error) {
    next(error);
  }
}

async function deleteQuest(req, res, next) {
  try {
    const { id } = req.params;
    const result = await questService.deleteQuest(req.user._id, id);
    return sendSuccess(res, result, 'Quest deleted');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getQuests,
  createQuest,
  toggleQuest,
  deleteQuest,
};
