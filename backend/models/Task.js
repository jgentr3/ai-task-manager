import db from '../config/database.js';

/**
 * Task Model
 * Handles all database operations related to tasks
 */
class Task {
  /**
   * Create a new task
   * @param {Object} taskData - Task data
   * @param {number} taskData.user_id - User ID who owns the task
   * @param {string} taskData.title - Task title
   * @param {string} taskData.description - Task description (optional)
   * @param {string} taskData.status - Task status (default: 'pending')
   * @param {string} taskData.priority - Task priority (default: 'medium')
   * @param {string} taskData.due_date - Due date in YYYY-MM-DD format (optional)
   * @returns {Object} Created task object
   */
  static async create({ user_id, title, description = null, status = 'pending', priority = 'medium', due_date = null }) {
    try {
      const result = await db.runAsync(`
        INSERT INTO tasks (user_id, title, description, status, priority, due_date)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [user_id, title, description, status, priority, due_date]);

      return this.findById(result.lastID);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find task by ID
   * @param {number} id - Task ID
   * @returns {Object|null} Task object
   */
  static async findById(id) {
    const task = await db.getAsync('SELECT * FROM tasks WHERE id = ?', [id]);
    return task || null;
  }

  /**
   * Find all tasks for a specific user
   * @param {number} user_id - User ID
   * @returns {Array} Array of task objects
   */
  static async findByUserId(user_id) {
    return await db.allAsync('SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC', [user_id]);
  }

  /**
   * Find tasks by user ID with filters
   * @param {number} user_id - User ID
   * @param {Object} filters - Filter options
   * @param {string} filters.status - Filter by status
   * @param {string} filters.priority - Filter by priority
   * @returns {Array} Array of task objects
   */
  static async findByUserIdWithFilters(user_id, filters = {}) {
    let query = 'SELECT * FROM tasks WHERE user_id = ?';
    const params = [user_id];

    if (filters.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters.priority) {
      query += ' AND priority = ?';
      params.push(filters.priority);
    }

    query += ' ORDER BY created_at DESC';

    return await db.allAsync(query, params);
  }

  /**
   * Get all tasks
   * @returns {Array} Array of all task objects
   */
  static async findAll() {
    return await db.allAsync('SELECT * FROM tasks ORDER BY created_at DESC', []);
  }

  /**
   * Update a task
   * @param {number} id - Task ID
   * @param {Object} updates - Fields to update
   * @returns {Object|null} Updated task object
   */
  static async update(id, updates) {
    const allowedFields = ['title', 'description', 'status', 'priority', 'due_date'];
    const fields = [];
    const values = [];

    // Build dynamic update query
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const query = `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`;

    try {
      const result = await db.runAsync(query, values);

      if (result.changes === 0) {
        return null;
      }

      return this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update task status
   * @param {number} id - Task ID
   * @param {string} status - New status ('pending', 'in-progress', 'completed')
   * @returns {Object|null} Updated task object
   */
  static async updateStatus(id, status) {
    const result = await db.runAsync('UPDATE tasks SET status = ? WHERE id = ?', [status, id]);

    if (result.changes === 0) {
      return null;
    }

    return this.findById(id);
  }

  /**
   * Delete a task
   * @param {number} id - Task ID
   * @returns {boolean} Success status
   */
  static async delete(id) {
    const result = await db.runAsync('DELETE FROM tasks WHERE id = ?', [id]);
    return result.changes > 0;
  }

  /**
   * Delete all tasks for a user
   * @param {number} user_id - User ID
   * @returns {number} Number of deleted tasks
   */
  static async deleteByUserId(user_id) {
    const result = await db.runAsync('DELETE FROM tasks WHERE user_id = ?', [user_id]);
    return result.changes;
  }

  /**
   * Get task count by status for a user
   * @param {number} user_id - User ID
   * @returns {Object} Object with counts for each status
   */
  static async getStatusCounts(user_id) {
    const results = await db.allAsync(`
      SELECT status, COUNT(*) as count
      FROM tasks
      WHERE user_id = ?
      GROUP BY status
    `, [user_id]);

    const counts = {
      pending: 0,
      'in-progress': 0,
      completed: 0
    };

    results.forEach(row => {
      counts[row.status] = row.count;
    });

    return counts;
  }

  /**
   * Get overdue tasks for a user
   * @param {number} user_id - User ID
   * @returns {Array} Array of overdue task objects
   */
  static async getOverdueTasks(user_id) {
    return await db.allAsync(`
      SELECT * FROM tasks
      WHERE user_id = ?
      AND due_date < date('now')
      AND status != 'completed'
      ORDER BY due_date ASC
    `, [user_id]);
  }
}

export default Task;
