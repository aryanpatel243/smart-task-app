const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const protect = require('../middleware/auth');

// All task routes are protected — apply auth middleware to all
router.use(protect);

// GET  /api/tasks        → Get all tasks for logged-in user
// POST /api/tasks        → Create a new task
router.route('/').get(getTasks).post(createTask);

// GET    /api/tasks/:id  → Get single task
// PUT    /api/tasks/:id  → Update task
// DELETE /api/tasks/:id  → Delete task
router.route('/:id').get(getTaskById).put(updateTask).delete(deleteTask);

module.exports = router;
