const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [1, 'Title cannot be empty'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'completed'],
        message: 'Status must be either pending or completed',
      },
      default: 'pending',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true, // Index for faster queries
    },
  },
  {
    timestamps: true,
  }
);

// ─── REMOVE UNNECESSARY FIELDS FROM JSON OUTPUT ───────────────────────────────
taskSchema.methods.toJSON = function () {
  const taskObject = this.toObject();
  delete taskObject.__v;
  return taskObject;
};

module.exports = mongoose.model('Task', taskSchema);
