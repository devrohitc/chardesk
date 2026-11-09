const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Trainer ID (username) is required'],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, 'Trainer ID must be at least 3 characters'],
      maxlength: [30, 'Trainer ID cannot exceed 30 characters'],
      match: [/^[a-z0-9_-]+$/, 'Trainer ID can only contain letters, numbers, hyphens, and underscores'],
    },
    displayName: {
      type: String,
      required: [true, 'Display name is required'],
      trim: true,
      maxlength: [40, 'Display name cannot exceed 40 characters'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    avatar: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toPublicJSON = function () {
  return {
    id: this._id.toString(),
    username: this.username,
    displayName: this.displayName,
    avatar: this.avatar,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);
