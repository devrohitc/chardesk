const DailyLog = require('../models/DailyLog');

async function getLogByDate(userId, date) {
  let log = await DailyLog.findOne({ user: userId, date });
  if (!log) {
    return {
      date,
      journal: '',
      journalTitle: '',
      gym: false,
      workout: '',
      meals: {},
      water: 0,
      grooming: '',
      supplements: false,
      sleep: '',
      mood: '',
    };
  }
  return log;
}

async function upsertDailyLog(userId, date, updateData) {
  const allowedFields = [
    'journal',
    'journalTitle',
    'gym',
    'workout',
    'meals',
    'water',
    'grooming',
    'supplements',
    'sleep',
    'mood',
  ];

  const update = {};
  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      update[field] = updateData[field];
    }
  }

  const log = await DailyLog.findOneAndUpdate(
    { user: userId, date },
    { $set: update },
    { new: true, upsert: true, runValidators: true }
  );

  return log;
}

async function getAllLogs(userId) {
  return DailyLog.find({ user: userId }).sort({ date: -1 });
}

module.exports = {
  getLogByDate,
  upsertDailyLog,
  getAllLogs,
};

