import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import Task from '../models/Task.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks for the logged-in user with optional filtering
 * @access  Private
 * @query   status - Filter by status (pending, in-progress, completed)
 * @query   priority - Filter by priority (low, medium, high)
 */
router.get(
  '/',
  [
    // Query parameter validation
    query('status')
      .optional()
      .isIn(['pending', 'in-progress', 'completed'])
      .withMessage('Status must be one of: pending, in-progress, completed'),
    query('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Priority must be one of: low, medium, high')
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array().map(err => ({
            field: err.path,
            message: err.msg
          }))
        });
      }

      const userId = req.userId;
      const { status, priority } = req.query;

      // Build filters object
      const filters = {};
      if (status) filters.status = status;
      if (priority) filters.priority = priority;

      // Get tasks with or without filters
      const tasks = Object.keys(filters).length > 0
        ? Task.findByUserIdWithFilters(userId, filters)
        : Task.findByUserId(userId);

      // Get task statistics
      const stats = Task.getStatusCounts(userId);

      return res.status(200).json({
        success: true,
        message: 'Tasks retrieved successfully',
        data: {
          tasks,
          stats,
          count: tasks.length
        }
      });
    } catch (error) {
      console.error('Get tasks error:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while fetching tasks',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route   GET /api/tasks/overdue
 * @desc    Get all overdue tasks for the logged-in user
 * @access  Private
 */
router.get('/overdue', async (req, res) => {
  try {
    const userId = req.userId;
    const overdueTasks = Task.getOverdueTasks(userId);

    return res.status(200).json({
      success: true,
      message: 'Overdue tasks retrieved successfully',
      data: {
        tasks: overdueTasks,
        count: overdueTasks.length
      }
    });
  } catch (error) {
    console.error('Get overdue tasks error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching overdue tasks',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/tasks/:id
 * @desc    Get a specific task by ID
 * @access  Private
 */
router.get(
  '/:id',
  [
    param('id')
      .isInt({ min: 1 })
      .withMessage('Task ID must be a positive integer')
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array().map(err => ({
            field: err.path,
            message: err.msg
          }))
        });
      }

      const taskId = parseInt(req.params.id);
      const userId = req.userId;

      // Get task
      const task = Task.findById(taskId);

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      // Verify task belongs to the user
      if (task.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to access this task'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Task retrieved successfully',
        data: { task }
      });
    } catch (error) {
      console.error('Get task error:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while fetching task',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Private
 */
router.post(
  '/',
  [
    // Validation middleware
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ min: 3, max: 200 })
      .withMessage('Title must be between 3 and 200 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description must not exceed 1000 characters'),
    body('status')
      .optional()
      .isIn(['pending', 'in-progress', 'completed'])
      .withMessage('Status must be one of: pending, in-progress, completed'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Priority must be one of: low, medium, high'),
    body('due_date')
      .optional()
      .isISO8601()
      .withMessage('Due date must be a valid date in YYYY-MM-DD format')
      .custom((value) => {
        // Check if due date is not in the past
        const dueDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (dueDate < today) {
          throw new Error('Due date cannot be in the past');
        }
        return true;
      })
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array().map(err => ({
            field: err.path,
            message: err.msg
          }))
        });
      }

      const userId = req.userId;
      const { title, description, status, priority, due_date } = req.body;

      // Create task
      const newTask = Task.create({
        user_id: userId,
        title,
        description: description || null,
        status: status || 'pending',
        priority: priority || 'medium',
        due_date: due_date || null
      });

      return res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: { task: newTask }
      });
    } catch (error) {
      console.error('Create task error:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while creating task',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update an existing task
 * @access  Private
 */
router.put(
  '/:id',
  [
    // Parameter validation
    param('id')
      .isInt({ min: 1 })
      .withMessage('Task ID must be a positive integer'),
    // Body validation
    body('title')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Title cannot be empty')
      .isLength({ min: 3, max: 200 })
      .withMessage('Title must be between 3 and 200 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description must not exceed 1000 characters'),
    body('status')
      .optional()
      .isIn(['pending', 'in-progress', 'completed'])
      .withMessage('Status must be one of: pending, in-progress, completed'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Priority must be one of: low, medium, high'),
    body('due_date')
      .optional()
      .custom((value) => {
        if (value === null || value === '') {
          return true; // Allow null to clear due date
        }
        // Validate ISO8601 format
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          throw new Error('Due date must be a valid date in YYYY-MM-DD format');
        }
        return true;
      })
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array().map(err => ({
            field: err.path,
            message: err.msg
          }))
        });
      }

      const taskId = parseInt(req.params.id);
      const userId = req.userId;

      // Check if task exists
      const existingTask = Task.findById(taskId);

      if (!existingTask) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      // Verify task belongs to the user
      if (existingTask.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to update this task'
        });
      }

      // Build updates object
      const updates = {};
      const { title, description, status, priority, due_date } = req.body;

      if (title !== undefined) updates.title = title;
      if (description !== undefined) updates.description = description === '' ? null : description;
      if (status !== undefined) updates.status = status;
      if (priority !== undefined) updates.priority = priority;
      if (due_date !== undefined) updates.due_date = due_date === '' || due_date === null ? null : due_date;

      // Check if there's anything to update
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No valid fields to update'
        });
      }

      // Update task
      const updatedTask = Task.update(taskId, updates);

      return res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        data: { task: updatedTask }
      });
    } catch (error) {
      console.error('Update task error:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while updating task',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route   PATCH /api/tasks/:id/status
 * @desc    Update only the status of a task
 * @access  Private
 */
router.patch(
  '/:id/status',
  [
    param('id')
      .isInt({ min: 1 })
      .withMessage('Task ID must be a positive integer'),
    body('status')
      .notEmpty()
      .withMessage('Status is required')
      .isIn(['pending', 'in-progress', 'completed'])
      .withMessage('Status must be one of: pending, in-progress, completed')
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array().map(err => ({
            field: err.path,
            message: err.msg
          }))
        });
      }

      const taskId = parseInt(req.params.id);
      const userId = req.userId;
      const { status } = req.body;

      // Check if task exists
      const existingTask = Task.findById(taskId);

      if (!existingTask) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      // Verify task belongs to the user
      if (existingTask.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to update this task'
        });
      }

      // Update status
      const updatedTask = Task.updateStatus(taskId, status);

      return res.status(200).json({
        success: true,
        message: 'Task status updated successfully',
        data: { task: updatedTask }
      });
    } catch (error) {
      console.error('Update task status error:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while updating task status',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task
 * @access  Private
 */
router.delete(
  '/:id',
  [
    param('id')
      .isInt({ min: 1 })
      .withMessage('Task ID must be a positive integer')
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array().map(err => ({
            field: err.path,
            message: err.msg
          }))
        });
      }

      const taskId = parseInt(req.params.id);
      const userId = req.userId;

      // Check if task exists
      const existingTask = Task.findById(taskId);

      if (!existingTask) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      // Verify task belongs to the user
      if (existingTask.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to delete this task'
        });
      }

      // Delete task
      const deleted = Task.delete(taskId);

      if (!deleted) {
        return res.status(500).json({
          success: false,
          message: 'Failed to delete task'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Task deleted successfully'
      });
    } catch (error) {
      console.error('Delete task error:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while deleting task',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route   GET /api/tasks/stats/summary
 * @desc    Get task statistics for the logged-in user
 * @access  Private
 */
router.get('/stats/summary', async (req, res) => {
  try {
    const userId = req.userId;

    const statusCounts = Task.getStatusCounts(userId);
    const allTasks = Task.findByUserId(userId);
    const overdueTasks = Task.getOverdueTasks(userId);

    return res.status(200).json({
      success: true,
      message: 'Statistics retrieved successfully',
      data: {
        total: allTasks.length,
        byStatus: statusCounts,
        overdue: overdueTasks.length
      }
    });
  } catch (error) {
    console.error('Get task stats error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
