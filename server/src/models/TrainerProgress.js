const mongoose = require('mongoose');

const trainerProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    xp: {
      type: Number,
      default: 0,
      min: 0,
    },
    coins: {
      type: Number,
      default: 30,
      min: 0,
    },
    caughtPokemon: {
      type: [Number],
      default: [25],
    },
    partnerPokemon: {
      type: Number,
      default: 25,
    },
    focusMinutes: {
      type: Number,
      default: 0,
      min: 0,
    },
    completions: {
      type: Map,
      of: [String],
      default: () => new Map(),
    },
  },
  {
    timestamps: true,
  }
);

trainerProgressSchema.methods.toJSON = function () {
  const completionsObj =
    this.completions instanceof Map ? Object.fromEntries(this.completions) : (this.completions || {});
  return {
    xp: this.xp,
    coins: this.coins,
    caughtPokemon: this.caughtPokemon,
    partnerPokemon: this.partnerPokemon,
    focusMinutes: this.focusMinutes,
    completions: completionsObj,
  };
};

module.exports = mongoose.model('TrainerProgress', trainerProgressSchema);
