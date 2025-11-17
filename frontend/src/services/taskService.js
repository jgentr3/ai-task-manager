import api from './api';

/**
 * Task Service
 * Handles all task-related API calls
 */

/**
 * Get all tasks for the current user
 * @param {Object} filters - Optional filters
 * @param {string} filters.status - Filter by status (pending, in-progress, completed)
 * @param {string} filters.priority - Filter by priority (low, medium, high)
 * @returns {Promise<Object>} Tasks and statistics
 *
 * @example
 * const { tasks, stats } = await taskService.getAllTasks({ status: 'pending' });
 */
export const getAllTasks = async (filters = {}) => {
  try {
    const params = new URLSearchParams();

    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);

    const response = await api.get(`/tasks?${params.toString()}`);
    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch tasks';
    throw {
      success: false,
      message: errorMessage,
    };
  }
};

/**
 * Get a specific task by ID
 * @param {number} taskId - Task ID
 * @returns {Promise<Object>} Task data
 */
export const getTaskById = async (taskId) => {
  try {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data.data.task;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch task';
    throw {
      success: false,
      message: errorMessage,
    };
  }
};

/**
 * Create a new task
 * @param {Object} taskData - Task data
 * @param {string} taskData.title - Task title (required)
 * @param {string} taskData.description - Task description (optional)
 * @param {string} taskData.status - Task status (optional, default: 'pending')
 * @param {string} taskData.priority - Task priority (optional, default: 'medium')
 * @param {string} taskData.due_date - Due date in YYYY-MM-DD format (optional)
 * @returns {Promise<Object>} Created task
 *
 * @example
 * const task = await taskService.createTask({
 *   title: 'Complete project',
 *   description: 'Finish the task manager app',
 *   priority: 'high',
 *   due_date: '2024-12-31'
 * });
 */
export const createTask = async (taskData) => {
  try {
    const response = await api.post('/tasks', taskData);
    return response.data.data.task;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to create task';
    const errors = error.response?.data?.errors || [];
    throw {
      success: false,
      message: errorMessage,
      errors,
    };
  }
};

/**
 * Update an existing task
 * @param {number} taskId - Task ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated task
 *
 * @example
 * const task = await taskService.updateTask(1, {
 *   title: 'Updated title',
 *   status: 'in-progress'
 * });
 */
export const updateTask = async (taskId, updates) => {
  try {
    const response = await api.put(`/tasks/${taskId}`, updates);
    return response.data.data.task;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to update task';
    const errors = error.response?.data?.errors || [];
    throw {
      success: false,
      message: errorMessage,
      errors,
    };
  }
};

/**
 * Update task status only
 * @param {number} taskId - Task ID
 * @param {string} status - New status (pending, in-progress, completed)
 * @returns {Promise<Object>} Updated task
 *
 * @example
 * const task = await taskService.updateTaskStatus(1, 'completed');
 */
export const updateTaskStatus = async (taskId, status) => {
  try {
    const response = await api.patch(`/tasks/${taskId}/status`, { status });
    return response.data.data.task;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to update task status';
    throw {
      success: false,
      message: errorMessage,
    };
  }
};

/**
 * Delete a task
 * @param {number} taskId - Task ID
 * @returns {Promise<Object>} Deletion result
 *
 * @example
 * await taskService.deleteTask(1);
 */
export const deleteTask = async (taskId) => {
  try {
    const response = await api.delete(`/tasks/${taskId}`);
    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to delete task';
    throw {
      success: false,
      message: errorMessage,
    };
  }
};

/**
 * Get overdue tasks
 * @returns {Promise<Array>} Array of overdue tasks
 *
 * @example
 * const overdueTasks = await taskService.getOverdueTasks();
 */
export const getOverdueTasks = async () => {
  try {
    const response = await api.get('/tasks/overdue');
    return response.data.data.tasks;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch overdue tasks';
    throw {
      success: false,
      message: errorMessage,
    };
  }
};

/**
 * Get task statistics
 * @returns {Promise<Object>} Task statistics (total, by status, overdue count)
 *
 * @example
 * const stats = await taskService.getTaskStats();
 * console.log('Total tasks:', stats.total);
 * console.log('Pending:', stats.byStatus.pending);
 */
export const getTaskStats = async () => {
  try {
    const response = await api.get('/tasks/stats/summary');
    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch task statistics';
    throw {
      success: false,
      message: errorMessage,
    };
  }
};

export default {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getOverdueTasks,
  getTaskStats,
};
