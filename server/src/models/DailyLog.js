const mongoose = require('mongoose');

const dailyLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: String,
      required: [true, 'Date is required (YYYY-MM-DD)'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD'],
      index: true,
    },
    journal: {
      type: String,
      default: '',
      maxlength: [20000, 'Journal entry exceeds character limit'],
    },
    journalTitle: {
      type: String,
      default: '',
      maxlength: [200, 'Journal title exceeds character limit'],
    },
    gym: {
      type: Boolean,
      default: false,
    },
    workout: {
      type: String,
      default: '',
      maxlength: [2000, 'Workout notes exceed character limit'],
    },
    meals: {
      type: Map,
      of: String,
      default: () => new Map(),
    },
    water: {
      type: Number,
      default: 0,
      min: 0,
      max: 50,
    },
    grooming: {
      type: String,
      default: '',
      maxlength: [2000, 'Grooming notes exceed character limit'],
    },
    supplements: {
      type: Boolean,
      default: false,
    },
    sleep: {
      type: String,
      default: '',
    },
    mood: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

dailyLogSchema.index({ user: 1, date: 1 }, { unique: true });

dailyLogSchema.methods.toJSON = function () {
  const mealsObj = this.meals instanceof Map ? Object.fromEntries(this.meals) : (this.meals || {});
  return {
    id: this._id.toString(),
    date: this.date,
    journal: this.journal,
    journalTitle: this.journalTitle,
    gym: this.gym,
    workout: this.workout,
    meals: mealsObj,
    water: this.water,
    grooming: this.grooming,
    supplements: this.supplements,
    sleep: this.sleep,
    mood: this.mood,
  };
};

module.exports = mongoose.model('DailyLog', dailyLogSchema);

