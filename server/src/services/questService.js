const Quest = require('../models/Quest');
const TrainerProgress = require('../models/TrainerProgress');

async function getQuests(userId) {
  return Quest.find({ user: userId }).sort({ createdAt: -1 });
}

async function createQuest(userId, data) {
  const quest = await Quest.create({
    user: userId,
    title: data.title,
    category: data.category || 'daily',
    xp: data.xp || 10,
    done: false,
  });
  return quest;
}

async function toggleQuest(userId, questId, date) {
  const quest = await Quest.findById(questId);
  if (!quest || quest.user.toString() !== userId.toString()) {
    const error = new Error('Quest not found');
    error.statusCode = 404;
    throw error;
  }

  // Update trainer completions & stats
  let progress = await TrainerProgress.findOne({ user: userId });
  if (!progress) {
    progress = await TrainerProgress.create({ user: userId });
  }

  const currentDate = date || new Date().toLocaleDateString('en-CA');
  const completions = progress.completions instanceof Map
    ? progress.completions
    : new Map(Object.entries(progress.completions || {}));

  const dayCompletions = completions.get(currentDate) || [];
  const alreadyCompleted = dayCompletions.includes(questId);

  let updatedDayCompletions;
  let xpDiff = 0;
  let coinsDiff = 0;

  if (alreadyCompleted) {
    updatedDayCompletions = dayCompletions.filter((id) => id !== questId);
    xpDiff = -quest.xp;
    coinsDiff = -5;
  } else {
    updatedDayCompletions = [...dayCompletions, questId];
    xpDiff = quest.xp;
    coinsDiff = 5;
  }

  completions.set(currentDate, updatedDayCompletions);
  progress.completions = completions;
  progress.xp = Math.max(0, progress.xp + xpDiff);
  progress.coins = Math.max(0, progress.coins + coinsDiff);
  await progress.save();

  return {
    quest,
    completed: !alreadyCompleted,
    date: currentDate,
    xp: progress.xp,
    coins: progress.coins,
    dayCompletions: updatedDayCompletions,
  };
}

async function deleteQuest(userId, questId) {
  const result = await Quest.findOneAndDelete({ _id: questId, user: userId });
  if (!result) {
    const error = new Error('Quest not found');
    error.statusCode = 404;
    throw error;
  }
  return { id: questId };
}

module.exports = {
  getQuests,
  createQuest,
  toggleQuest,
  deleteQuest,
};

