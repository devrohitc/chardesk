const jwt = require('jsonwebtoken');
const User = require('../models/User');
const TrainerProgress = require('../models/TrainerProgress');
const Quest = require('../models/Quest');
const Finance = require('../models/Finance');
const config = require('../config/environment');

const initialSeedQuests = [
  { title: 'Plan the day before opening socials', category: 'daily', xp: 10 },
  { title: 'Drink water after waking up', category: 'daily', xp: 10 },
  { title: 'Review this month’s main goal', category: 'weekly', xp: 15 },
  { title: 'Move one important work task forward', category: 'work', xp: 15 },
  { title: 'Log today’s workout or recovery', category: 'fitness', xp: 15 },
  { title: 'Write a short daily journal entry', category: 'daily', xp: 10 },
];

function generateToken(user) {
  return jwt.sign(
    {
      id: user._id.toString(),
      username: user.username,
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
}

async function registerUser({ username, displayName, password }) {
  const normalizedUsername = username.trim().toLowerCase();
  const existing = await User.findOne({ username: normalizedUsername });

  if (existing) {
    const error = new Error('That Trainer ID is already taken. Choose another!');
    error.statusCode = 409;
    throw error;
  }

  const avatar = Math.floor(Math.random() * 6);
  const user = await User.create({
    username: normalizedUsername,
    displayName: (displayName || normalizedUsername).trim(),
    password,
    avatar,
  });

  // Seed default data for new trainer
  try {
    await TrainerProgress.create({
      user: user._id,
      xp: 0,
      coins: 30,
      caughtPokemon: [25],
      partnerPokemon: 25,
      focusMinutes: 0,
    });

    await Finance.create({
      user: user._id,
      income: '50000',
      budget: '12000',
      expenses: [],
      bills: [],
    });

    const questsToInsert = initialSeedQuests.map((q) => ({
      user: user._id,
      title: q.title,
      category: q.category,
      done: false,
      xp: q.xp,
    }));
    await Quest.insertMany(questsToInsert);
  } catch (seedErr) {
    // Non-fatal if seeding has minor conflict
  }

  const token = generateToken(user);
  return {
    user: user.toPublicJSON(),
    token,
  };
}

async function loginUser({ username, password }) {
  const normalizedUsername = username.trim().toLowerCase();
  const user = await User.findOne({ username: normalizedUsername }).select('+password');

  if (!user) {
    const error = new Error("We couldn't find that Trainer ID. Check your spelling or register.");
    error.statusCode = 404;
    throw error;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error('Wrong password. Try again, trainer!');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user);
  return {
    user: user.toPublicJSON(),
    token,
  };
}

async function getAllUsers() {
  try {
    const users = await User.find().select('username displayName avatar createdAt').maxTimeMS(2000);
    return users.map((u) => u.toPublicJSON());
  } catch (err) {
    return [];
  }
}

module.exports = {
  generateToken,
  registerUser,
  loginUser,
  getAllUsers,
};

