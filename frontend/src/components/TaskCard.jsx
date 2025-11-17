import React, { useState } from 'react';

/**
 * TaskCard Component
 * Displays individual task with edit and delete functionality
 */
const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Priority color mapping
  const priorityConfig = {
    low: {
      color: 'bg-green-100 text-green-800 border-green-200',
      indicator: 'bg-green-500',
      label: 'Low'
    },
    medium: {
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      indicator: 'bg-yellow-500',
      label: 'Medium'
    },
    high: {
      color: 'bg-red-100 text-red-800 border-red-200',
      indicator: 'bg-red-500',
      label: 'High'
    }
  };

  // Status badge config
  const statusConfig = {
    pending: {
      color: 'bg-gray-100 text-gray-700',
      label: 'Pending'
    },
    'in-progress': {
      color: 'bg-blue-100 text-blue-700',
      label: 'In Progress'
    },
    completed: {
      color: 'bg-green-100 text-green-700',
      label: 'Completed'
    }
  };

  const priority = priorityConfig[task.priority] || priorityConfig.medium;
  const status = statusConfig[task.status] || statusConfig.pending;

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check if date is today
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    // Check if date is tomorrow
    if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    // Check if overdue
    if (date < today && task.status !== 'completed') {
      return `Overdue (${date.toLocaleDateString()})`;
    }
    return date.toLocaleDateString();
  };

  // Check if overdue
  const isOverdue = task.due_date &&
    new Date(task.due_date) < new Date() &&
    task.status !== 'completed';

  // Handle delete confirmation
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDelete(task.id);
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="card hover:shadow-medium transition-all duration-200 border-l-4 relative group">
      {/* Priority Indicator */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${priority.indicator}`} />

      {/* Card Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 break-words">
            {task.title}
          </h3>
          <div className="flex flex-wrap gap-2">
            {/* Status Badge */}
            <span className={`badge ${status.color}`}>
              {status.label}
            </span>
            {/* Priority Badge */}
            <span className={`badge border ${priority.color}`}>
              {priority.label} Priority
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title="Edit task"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDeleteClick}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete task"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Footer - Due Date and Quick Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        {/* Due Date */}
        {task.due_date && (
          <div className={`flex items-center text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {isOverdue && <span className="mr-1">⚠️</span>}
            {formatDate(task.due_date)}
          </div>
        )}

        {/* Quick Status Change */}
        {task.status !== 'completed' && (
          <button
            onClick={() => onStatusChange(task.id, task.status === 'pending' ? 'in-progress' : 'completed')}
            className="text-xs font-medium text-primary-600 hover:text-primary-700 hover:underline transition-colors"
          >
            {task.status === 'pending' ? 'Start Task' : 'Mark Complete'}
          </button>
        )}
        {task.status === 'completed' && (
          <div className="flex items-center text-green-600 text-sm">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Completed
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-large p-6 max-w-sm w-full animate-slide-up">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Delete Task</h3>
                <p className="text-sm text-gray-600">
                  Are you sure you want to delete "{task.title}"? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelDelete}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
