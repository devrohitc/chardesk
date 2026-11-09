const mongoose = require('mongoose');

const questSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Quest title is required'],
      trim: true,
      maxlength: [100, 'Quest title cannot exceed 100 characters'],
    },
    category: {
      type: String,
      required: true,
      enum: ['all', 'weekly', 'daily', 'work', 'fitness', 'life'],
      default: 'daily',
    },
    done: {
      type: Boolean,
      default: false,
    },
    xp: {
      type: Number,
      default: 10,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

questSchema.methods.toJSON = function () {
  return {
    id: this._id.toString(),
    title: this.title,
    category: this.category,
    done: this.done,
    xp: this.xp,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('Quest', questSchema);
