const trainerService = require('../services/trainerService');
const { sendSuccess } = require('../utils/apiResponse');

async function getProgress(req, res, next) {
  try {
    const progress = await trainerService.getProgress(req.user._id);
    return sendSuccess(res, progress);
  } catch (error) {
    next(error);
  }
}

async function catchPokemon(req, res, next) {
  try {
    const { pokemonId, cost } = req.body;
    const result = await trainerService.catchPokemon(req.user._id, pokemonId, cost);
    return sendSuccess(res, result, 'Pokémon caught successfully!');
  } catch (error) {
    next(error);
  }
}

async function setPartner(req, res, next) {
  try {
    const { pokemonId } = req.body;
    const result = await trainerService.setPartner(req.user._id, pokemonId);
    return sendSuccess(res, result, 'Partner Pokémon updated');
  } catch (error) {
    next(error);
  }
}

async function recordFocus(req, res, next) {
  try {
    const { minutes } = req.body;
    const result = await trainerService.recordFocus(req.user._id, minutes);
    return sendSuccess(res, result, 'Focus session logged');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProgress,
  catchPokemon,
  setPartner,
  recordFocus,
};

