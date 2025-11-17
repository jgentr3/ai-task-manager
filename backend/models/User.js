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
  static create(email, password) {
    try {
      // Hash password
      const saltRounds = 10;
      const password_hash = bcrypt.hashSync(password, saltRounds);

      // Insert user into database
      const stmt = db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)');
      const result = stmt.run(email, password_hash);

      // Return created user (without password)
      return this.findById(result.lastInsertRowid);
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
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
  static findById(id) {
    const stmt = db.prepare('SELECT id, email, created_at FROM users WHERE id = ?');
    return stmt.get(id) || null;
  }

  /**
   * Find user by email
   * @param {string} email - User's email address
   * @returns {Object|null} User object (without password_hash)
   */
  static findByEmail(email) {
    const stmt = db.prepare('SELECT id, email, created_at FROM users WHERE email = ?');
    return stmt.get(email) || null;
  }

  /**
   * Find user by email with password hash (for authentication)
   * @param {string} email - User's email address
   * @returns {Object|null} User object (with password_hash)
   */
  static findByEmailWithPassword(email) {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email) || null;
  }

  /**
   * Get all users
   * @returns {Array} Array of user objects (without password_hash)
   */
  static findAll() {
    const stmt = db.prepare('SELECT id, email, created_at FROM users');
    return stmt.all();
  }

  /**
   * Update user email
   * @param {number} id - User ID
   * @param {string} email - New email address
   * @returns {Object|null} Updated user object
   */
  static updateEmail(id, email) {
    try {
      const stmt = db.prepare('UPDATE users SET email = ? WHERE id = ?');
      const result = stmt.run(email, id);

      if (result.changes === 0) {
        return null;
      }

      return this.findById(id);
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
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
  static updatePassword(id, newPassword) {
    const saltRounds = 10;
    const password_hash = bcrypt.hashSync(newPassword, saltRounds);

    const stmt = db.prepare('UPDATE users SET password_hash = ? WHERE id = ?');
    const result = stmt.run(password_hash, id);

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
  static delete(id) {
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}

export default User;
