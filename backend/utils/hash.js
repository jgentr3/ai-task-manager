import bcrypt from 'bcryptjs';

/**
 * Default salt rounds for bcrypt
 * Higher number = more secure but slower
 * 10 is a good balance for most applications
 */
const SALT_ROUNDS = 10;

/**
 * Hash a plain text password
 * @param {string} password - Plain text password to hash
 * @param {number} saltRounds - Number of salt rounds (default: 10)
 * @returns {Promise<string>} Hashed password
 * @throws {Error} If password is empty or hashing fails
 *
 * @example
 * const hashedPassword = await hashPassword('mySecurePassword123');
 */
export const hashPassword = async (password, saltRounds = SALT_ROUNDS) => {
  try {
    // Validate password
    if (!password || typeof password !== 'string') {
      throw new Error('Password must be a non-empty string');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Generate salt and hash password
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  } catch (error) {
    throw new Error('Error hashing password: ' + error.message);
  }
};

/**
 * Hash a password synchronously
 * @param {string} password - Plain text password to hash
 * @param {number} saltRounds - Number of salt rounds (default: 10)
 * @returns {string} Hashed password
 * @throws {Error} If password is empty or hashing fails
 *
 * @example
 * const hashedPassword = hashPasswordSync('mySecurePassword123');
 */
export const hashPasswordSync = (password, saltRounds = SALT_ROUNDS) => {
  try {
    // Validate password
    if (!password || typeof password !== 'string') {
      throw new Error('Password must be a non-empty string');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Generate salt and hash password synchronously
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    return hashedPassword;
  } catch (error) {
    throw new Error('Error hashing password: ' + error.message);
  }
};

/**
 * Compare a plain text password with a hashed password
 * @param {string} plainPassword - Plain text password to check
 * @param {string} hashedPassword - Hashed password from database
 * @returns {Promise<boolean>} True if passwords match, false otherwise
 * @throws {Error} If comparison fails
 *
 * @example
 * const isValid = await comparePassword('userInput123', storedHash);
 * if (isValid) {
 *   // Password is correct
 * }
 */
export const comparePassword = async (plainPassword, hashedPassword) => {
  try {
    // Validate inputs
    if (!plainPassword || typeof plainPassword !== 'string') {
      throw new Error('Plain password must be a non-empty string');
    }

    if (!hashedPassword || typeof hashedPassword !== 'string') {
      throw new Error('Hashed password must be a non-empty string');
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);

    return isMatch;
  } catch (error) {
    throw new Error('Error comparing passwords: ' + error.message);
  }
};

/**
 * Compare a plain text password with a hashed password synchronously
 * @param {string} plainPassword - Plain text password to check
 * @param {string} hashedPassword - Hashed password from database
 * @returns {boolean} True if passwords match, false otherwise
 * @throws {Error} If comparison fails
 *
 * @example
 * const isValid = comparePasswordSync('userInput123', storedHash);
 * if (isValid) {
 *   // Password is correct
 * }
 */
export const comparePasswordSync = (plainPassword, hashedPassword) => {
  try {
    // Validate inputs
    if (!plainPassword || typeof plainPassword !== 'string') {
      throw new Error('Plain password must be a non-empty string');
    }

    if (!hashedPassword || typeof hashedPassword !== 'string') {
      throw new Error('Hashed password must be a non-empty string');
    }

    // Compare passwords synchronously
    const isMatch = bcrypt.compareSync(plainPassword, hashedPassword);

    return isMatch;
  } catch (error) {
    throw new Error('Error comparing passwords: ' + error.message);
  }
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Object with isValid boolean and errors array
 *
 * @example
 * const { isValid, errors } = validatePasswordStrength('weak');
 * if (!isValid) {
 *   console.log('Password errors:', errors);
 * }
 */
export const validatePasswordStrength = (password) => {
  const errors = [];

  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      errors: ['Password must be a string']
    };
  }

  // Check minimum length
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  // Check for number
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  // Check for special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export default {
  hashPassword,
  hashPasswordSync,
  comparePassword,
  comparePasswordSync,
  validatePasswordStrength,
  SALT_ROUNDS
};
