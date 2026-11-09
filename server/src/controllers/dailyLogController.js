const dailyLogService = require('../services/dailyLogService');
const { sendSuccess } = require('../utils/apiResponse');

async function getLog(req, res, next) {
  try {
    const { date } = req.params;
    const log = await dailyLogService.getLogByDate(req.user._id, date);
    return sendSuccess(res, log);
  } catch (error) {
    next(error);
  }
}

async function updateLog(req, res, next) {
  try {
    const { date } = req.params;
    const updated = await dailyLogService.upsertDailyLog(req.user._id, date, req.body);
    return sendSuccess(res, updated, 'Daily log updated');
  } catch (error) {
    next(error);
  }
}

async function getAllLogs(req, res, next) {
  try {
    const logs = await dailyLogService.getAllLogs(req.user._id);
    return sendSuccess(res, logs);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getLog,
  updateLog,
  getAllLogs,
};

