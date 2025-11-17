import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'; // Default: 7 days
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d'; // Default: 30 days

/**
 * Generate access token for a user
 * @param {Object} payload - Data to encode in the token
 * @param {number} payload.id - User ID
 * @param {string} payload.email - User email
 * @returns {string} JWT token
 */
export const generateAccessToken = (payload) => {
  try {
    const token = jwt.sign(
      {
        id: payload.id,
        email: payload.email,
        type: 'access'
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
        issuer: 'task-manager-api'
      }
    );

    return token;
  } catch (error) {
    throw new Error('Error generating access token: ' + error.message);
  }
};

/**
 * Generate refresh token for a user
 * @param {Object} payload - Data to encode in the token
 * @param {number} payload.id - User ID
 * @returns {string} JWT refresh token
 */
export const generateRefreshToken = (payload) => {
  try {
    const token = jwt.sign(
      {
        id: payload.id,
        type: 'refresh'
      },
      JWT_SECRET,
      {
        expiresIn: JWT_REFRESH_EXPIRES_IN,
        issuer: 'task-manager-api'
      }
    );

    return token;
  } catch (error) {
    throw new Error('Error generating refresh token: ' + error.message);
  }
};

/**
 * Verify and decode a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'task-manager-api'
    });

    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    } else if (error.name === 'NotBeforeError') {
      throw new Error('Token not active yet');
    } else {
      throw new Error('Token verification failed: ' + error.message);
    }
  }
};

/**
 * Decode token without verification (useful for getting expired token data)
 * @param {string} token - JWT token to decode
 * @returns {Object|null} Decoded token payload or null if invalid
 */
export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

/**
 * Generate both access and refresh tokens
 * @param {Object} payload - User data
 * @returns {Object} Object containing both tokens
 */
export const generateTokenPair = (payload) => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
    expiresIn: JWT_EXPIRES_IN
  };
};

export default {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  decodeToken,
  generateTokenPair,
  JWT_SECRET,
  JWT_EXPIRES_IN
};
