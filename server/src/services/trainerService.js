const TrainerProgress = require('../models/TrainerProgress');

async function getProgress(userId) {
  let progress = await TrainerProgress.findOne({ user: userId });
  if (!progress) {
    progress = await TrainerProgress.create({
      user: userId,
      xp: 0,
      coins: 30,
      caughtPokemon: [25],
      partnerPokemon: 25,
      focusMinutes: 0,
    });
  }
  return progress;
}

async function catchPokemon(userId, pokemonId, cost = 20) {
  const progress = await getProgress(userId);

  if (progress.coins < cost) {
    const error = new Error('Not enough coins to catch this Pokémon');
    error.statusCode = 400;
    throw error;
  }

  const id = Number(pokemonId);
  if (progress.caughtPokemon.includes(id)) {
    const error = new Error('You have already caught this Pokémon');
    error.statusCode = 400;
    throw error;
  }

  progress.coins -= cost;
  progress.caughtPokemon.push(id);
  await progress.save();

  return {
    caughtPokemon: progress.caughtPokemon,
    coins: progress.coins,
    newPokemonId: id,
  };
}

async function setPartner(userId, pokemonId) {
  const progress = await getProgress(userId);
  const id = Number(pokemonId);

  if (!progress.caughtPokemon.includes(id)) {
    const error = new Error('You must catch this Pokémon before choosing it as a partner');
    error.statusCode = 400;
    throw error;
  }

  progress.partnerPokemon = id;
  await progress.save();

  return {
    partnerPokemon: progress.partnerPokemon,
  };
}

async function recordFocus(userId, minutes = 25) {
  const progress = await getProgress(userId);
  progress.xp += 15;
  progress.coins += 5;
  progress.focusMinutes += Number(minutes);
  await progress.save();

  return {
    xp: progress.xp,
    coins: progress.coins,
    focusMinutes: progress.focusMinutes,
  };
}

module.exports = {
  getProgress,
  catchPokemon,
  setPartner,
  recordFocus,
};
