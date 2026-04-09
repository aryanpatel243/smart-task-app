import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import api from '../utils/api';

const Dashboard = () => {
  const { user } = useAuth();

  // ─── State ─────────────────────────────────────────────────────────────────
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'completed'
  const [deleteConfirm, setDeleteConfirm] = useState(null); // taskId to confirm delete

  // ─── Fetch all tasks ────────────────────────────────────────────────────────
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/tasks');
      setTasks(res.data.tasks);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ─── Auto-clear success message ─────────────────────────────────────────────
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  // ─── Open modal for create ──────────────────────────────────────────────────
  const handleOpenCreate = () => {
    setEditTask(null);
    setIsModalOpen(true);
  };

  // ─── Open modal for edit ────────────────────────────────────────────────────
  const handleOpenEdit = (task) => {
    setEditTask(task);
    setIsModalOpen(true);
  };

  // ─── Close modal ────────────────────────────────────────────────────────────
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditTask(null);
  };

  // ─── Create Task ────────────────────────────────────────────────────────────
  const handleCreateTask = async (formData) => {
    setModalLoading(true);
    try {
      const res = await api.post('/tasks', formData);
      setTasks((prev) => [res.data.task, ...prev]);
      setSuccessMsg('Task created successfully!');
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task.');
    } finally {
      setModalLoading(false);
    }
  };

  // ─── Update Task ────────────────────────────────────────────────────────────
  const handleUpdateTask = async (formData) => {
    if (!editTask) return;
    setModalLoading(true);
    try {
      const res = await api.put(`/tasks/${editTask._id}`, formData);
      setTasks((prev) =>
        prev.map((t) => (t._id === editTask._id ? res.data.task : t))
      );
      setSuccessMsg('Task updated successfully!');
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task.');
    } finally {
      setModalLoading(false);
    }
  };

  // ─── Toggle Task Status ─────────────────────────────────────────────────────
  const handleToggleStatus = async (task) => {
    const newStatus = task.status === 'pending' ? 'completed' : 'pending';
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t._id === task._id ? { ...t, status: newStatus } : t))
    );
    try {
      const res = await api.put(`/tasks/${task._id}`, { status: newStatus });
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? res.data.task : t))
      );
      setSuccessMsg(`Task marked as ${newStatus}!`);
    } catch (err) {
      // Revert on failure
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, status: task.status } : t))
      );
      setError(err.response?.data?.message || 'Failed to update task status.');
    }
  };

  // ─── Delete Task ────────────────────────────────────────────────────────────
  const handleDeleteClick = (taskId) => {
    setDeleteConfirm(taskId);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    const taskId = deleteConfirm;
    setDeleteConfirm(null);
    // Optimistic removal
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
    try {
      await api.delete(`/tasks/${taskId}`);
      setSuccessMsg('Task deleted successfully!');
    } catch (err) {
      fetchTasks(); // Re-fetch on failure
      setError(err.response?.data?.message || 'Failed to delete task.');
    }
  };

  const handleDeleteCancel = () => setDeleteConfirm(null);

  // ─── Modal submit handler ───────────────────────────────────────────────────
  const handleModalSubmit = (formData) => {
    if (editTask) {
      handleUpdateTask(formData);
    } else {
      handleCreateTask(formData);
    }
  };

  // ─── Filtered tasks ─────────────────────────────────────────────────────────
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  // ─── Stats ──────────────────────────────────────────────────────────────────
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const pendingTasks = tasks.filter((t) => t.status === 'pending').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-main">
        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">
              Good day, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="dashboard-subtitle">Here's what's on your plate today.</p>
          </div>
          <button className="btn btn-primary btn-add" onClick={handleOpenCreate}>
            + New Task
          </button>
        </div>

        {/* ── Alerts ─────────────────────────────────────────────── */}
        {error && (
          <div className="alert alert-error">
            <span>⚠</span> {error}
            <button className="alert-close" onClick={() => setError('')}>✕</button>
          </div>
        )}
        {successMsg && (
          <div className="alert alert-success">
            <span>✓</span> {successMsg}
          </div>
        )}

        {/* ── Stats Cards ────────────────────────────────────────── */}
        <div className="stats-grid">
          <div className="stat-card stat-card--total">
            <div className="stat-value">{totalTasks}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
          <div className="stat-card stat-card--pending">
            <div className="stat-value">{pendingTasks}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card stat-card--completed">
            <div className="stat-value">{completedTasks}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card stat-card--rate">
            <div className="stat-value">{completionRate}%</div>
            <div className="stat-label">Completion Rate</div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* ── Filter Tabs ────────────────────────────────────────── */}
        <div className="filter-tabs">
          {['all', 'pending', 'completed'].map((f) => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? 'filter-tab--active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span className="filter-count">
                {f === 'all' ? totalTasks : f === 'pending' ? pendingTasks : completedTasks}
              </span>
            </button>
          ))}
        </div>

        {/* ── Task Grid ──────────────────────────────────────────── */}
        {loading ? (
          <div className="tasks-loading">
            {[1, 2, 3].map((i) => (
              <div key={i} className="task-skeleton"></div>
            ))}
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="tasks-empty">
            <div className="tasks-empty-icon">
              {filter === 'completed' ? '🎉' : filter === 'pending' ? '✅' : '📋'}
            </div>
            <h3 className="tasks-empty-title">
              {filter === 'all'
                ? 'No tasks yet'
                : filter === 'pending'
                ? 'No pending tasks'
                : 'No completed tasks'}
            </h3>
            <p className="tasks-empty-text">
              {filter === 'all'
                ? 'Create your first task to get started!'
                : filter === 'pending'
                ? 'Great job! All tasks are done.'
                : 'Complete a task to see it here.'}
            </p>
            {filter === 'all' && (
              <button className="btn btn-primary" onClick={handleOpenCreate}>
                + Create Task
              </button>
            )}
          </div>
        ) : (
          <div className="tasks-grid">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={handleOpenEdit}
                onDelete={handleDeleteClick}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── Task Modal ─────────────────────────────────────────────────────── */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        editTask={editTask}
        loading={modalLoading}
      />

      {/* ── Delete Confirmation Dialog ─────────────────────────────────────── */}
      {deleteConfirm && (
        <div className="modal-backdrop">
          <div className="modal modal--confirm">
            <div className="confirm-icon">⚠️</div>
            <h3 className="confirm-title">Delete Task?</h3>
            <p className="confirm-text">
              This action cannot be undone. The task will be permanently removed.
            </p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={handleDeleteCancel}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDeleteConfirm}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
