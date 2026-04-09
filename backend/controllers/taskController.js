const Task = require('../models/Task');

// ─── @route   GET /api/tasks ───────────────────────────────────────────────────
// ─── @desc    Get all tasks for logged-in user ─────────────────────────────────
// ─── @access  Private ─────────────────────────────────────────────────────────
const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ userId: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @route   GET /api/tasks/:id ──────────────────────────────────────────────
// ─── @desc    Get single task by ID ───────────────────────────────────────────
// ─── @access  Private ─────────────────────────────────────────────────────────
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @route   POST /api/tasks ─────────────────────────────────────────────────
// ─── @desc    Create a new task ───────────────────────────────────────────────
// ─── @access  Private ─────────────────────────────────────────────────────────
const createTask = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Task title is required.',
      });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      status: status || 'pending',
      userId: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully.',
      task,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @route   PUT /api/tasks/:id ──────────────────────────────────────────────
// ─── @desc    Update a task by ID ─────────────────────────────────────────────
// ─── @access  Private ─────────────────────────────────────────────────────────
const updateTask = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;

    // Validate status if provided
    if (status && !['pending', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either pending or completed.',
      });
    }

    // Build update object with only provided fields
    const updateFields = {};
    if (title !== undefined) updateFields.title = title.trim();
    if (description !== undefined) updateFields.description = description.trim();
    if (status !== undefined) updateFields.status = status;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields provided for update.',
      });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      updateFields,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully.',
      task,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @route   DELETE /api/tasks/:id ───────────────────────────────────────────
// ─── @desc    Delete a task by ID ─────────────────────────────────────────────
// ─── @access  Private ─────────────────────────────────────────────────────────
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully.',
      taskId: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask };
