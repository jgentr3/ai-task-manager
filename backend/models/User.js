import db from '../config/database.js';
import bcrypt from 'bcryptjs';

/**
 * User Model
 * Handles all database operations related to users
 */
class User {
  /**
   * Create a new user
   * @param {string} email - User's email address
   * @param {string} password - User's plain text password
   * @returns {Object} Created user object (without password)
   */
  static async create(email, password) {
    try {
      // Hash password
      const saltRounds = 10;
      const password_hash = bcrypt.hashSync(password, saltRounds);

      // Insert user into database
      const result = await db.runAsync('INSERT INTO users (email, password_hash) VALUES (?, ?)', [email, password_hash]);

      // Return created user (without password)
      return this.findById(result.lastID);
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT' || error.message.includes('UNIQUE')) {
        throw new Error('Email already exists');
      }
      throw error;
    }
  }

  /**
   * Find user by ID
   * @param {number} id - User ID
   * @returns {Object|null} User object (without password_hash)
   */
  static async findById(id) {
    const user = await db.getAsync('SELECT id, email, created_at FROM users WHERE id = ?', [id]);
    return user || null;
  }

  /**
   * Find user by email
   * @param {string} email - User's email address
   * @returns {Object|null} User object (without password_hash)
   */
  static async findByEmail(email) {
    const user = await db.getAsync('SELECT id, email, created_at FROM users WHERE email = ?', [email]);
    return user || null;
  }

  /**
   * Find user by email with password hash (for authentication)
   * @param {string} email - User's email address
   * @returns {Object|null} User object (with password_hash)
   */
  static async findByEmailWithPassword(email) {
    const user = await db.getAsync('SELECT * FROM users WHERE email = ?', [email]);
    return user || null;
  }

  /**
   * Get all users
   * @returns {Array} Array of user objects (without password_hash)
   */
  static async findAll() {
    return await db.allAsync('SELECT id, email, created_at FROM users', []);
  }

  /**
   * Update user email
   * @param {number} id - User ID
   * @param {string} email - New email address
   * @returns {Object|null} Updated user object
   */
  static async updateEmail(id, email) {
    try {
      const result = await db.runAsync('UPDATE users SET email = ? WHERE id = ?', [email, id]);

      if (result.changes === 0) {
        return null;
      }

      return this.findById(id);
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT' || error.message.includes('UNIQUE')) {
        throw new Error('Email already exists');
      }
      throw error;
    }
  }

  /**
   * Update user password
   * @param {number} id - User ID
   * @param {string} newPassword - New plain text password
   * @returns {boolean} Success status
   */
  static async updatePassword(id, newPassword) {
    const saltRounds = 10;
    const password_hash = bcrypt.hashSync(newPassword, saltRounds);

    const result = await db.runAsync('UPDATE users SET password_hash = ? WHERE id = ?', [password_hash, id]);

    return result.changes > 0;
  }

  /**
   * Verify user password
   * @param {string} plainPassword - Plain text password to verify
   * @param {string} hashedPassword - Hashed password from database
   * @returns {boolean} Whether password matches
   */
  static verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compareSync(plainPassword, hashedPassword);
  }

  /**
   * Delete user by ID
   * @param {number} id - User ID
   * @returns {boolean} Success status
   */
  static async delete(id) {
    const result = await db.runAsync('DELETE FROM users WHERE id = ?', [id]);
    return result.changes > 0;
  }
}

export default User;
