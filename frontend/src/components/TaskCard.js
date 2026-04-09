import React from 'react';

const TaskCard = ({ task, onEdit, onDelete, onToggleStatus }) => {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className={`task-card ${task.status === 'completed' ? 'task-card--completed' : ''}`}>
      <div className="task-card-header">
        <button
          className={`status-toggle ${task.status === 'completed' ? 'status-toggle--done' : ''}`}
          onClick={() => onToggleStatus(task)}
          title={task.status === 'completed' ? 'Mark as pending' : 'Mark as completed'}
        >
          {task.status === 'completed' ? '✓' : '○'}
        </button>
        <div className="task-card-meta">
          <span className={`task-badge ${task.status === 'completed' ? 'badge--completed' : 'badge--pending'}`}>
            {task.status}
          </span>
          <span className="task-date">{formatDate(task.createdAt)}</span>
        </div>
      </div>

      <div className="task-card-body">
        <h3 className={`task-title ${task.status === 'completed' ? 'task-title--striked' : ''}`}>
          {task.title}
        </h3>
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
      </div>

      <div className="task-card-actions">
        <button
          className="btn-action btn-edit"
          onClick={() => onEdit(task)}
          title="Edit task"
        >
          ✎ Edit
        </button>
        <button
          className="btn-action btn-delete"
          onClick={() => onDelete(task._id)}
          title="Delete task"
        >
          ✕ Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
