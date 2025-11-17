import { verifyToken } from '../config/jwt.js';
import User from '../models/User.js';

/**
 * Authentication middleware
 * Verifies JWT token and attaches user information to request
 *
 * Usage in routes:
 * import { authenticate } from './middleware/auth.js';
 * router.get('/protected', authenticate, (req, res) => {
 *   // Access user via req.user
 * });
 */
export const authenticate = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Check if header follows "Bearer <token>" format
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format. Use: Bearer <token>'
      });
    }

    // Extract token (remove "Bearer " prefix)
    const token = authHeader.substring(7);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Token is empty.'
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: error.message || 'Invalid or expired token.'
      });
    }

    // Check if token is an access token
    if (decoded.type !== 'access') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token type. Access token required.'
      });
    }

    // Verify user still exists in database
    const user = await User.findById(decoded.id);

    if (!user) {
      console.log(`Authentication failed: User ${decoded.id} not found in database`);
      return res.status(401).json({
        success: false,
        message: 'User no longer exists.'
      });
    }

    console.log(`User authenticated: ${user.email} (ID: ${user.id})`);

    // Attach user information to request object
    req.user = {
      id: user.id,
      email: user.email
    };

    req.userId = user.id; // Shorthand for convenience

    // Continue to next middleware/route handler
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.'
    });
  }
};

/**
 * Optional authentication middleware
 * Attaches user info if token is valid, but continues even if no token
 * Useful for routes that have different behavior for authenticated users
 */
export const optionalAuthenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      req.userId = null;
      return next();
    }

    const token = authHeader.substring(7);

    try {
      const decoded = verifyToken(token);

      if (decoded.type === 'access') {
        const user = await User.findById(decoded.id);

        if (user) {
          req.user = {
            id: user.id,
            email: user.email
          };
          req.userId = user.id;
        }
      }
    } catch (error) {
      // Token is invalid, but we continue anyway
      req.user = null;
      req.userId = null;
    }

    next();
  } catch (error) {
    console.error('Optional authentication error:', error);
    req.user = null;
    req.userId = null;
    next();
  }
};

/**
 * Middleware to check if token is a refresh token
 * Used specifically for token refresh endpoints
 */
export const authenticateRefreshToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No refresh token provided.'
      });
    }

    const token = authHeader.substring(7);

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: error.message || 'Invalid or expired refresh token.'
      });
    }

    // Check if token is a refresh token
    if (decoded.type !== 'refresh') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token type. Refresh token required.'
      });
    }

    // Verify user exists
    const user = await User.findById(decoded.id);

    if (!user) {
      console.log(`Refresh token authentication failed: User ${decoded.id} not found`);
      return res.status(401).json({
        success: false,
        message: 'User no longer exists.'
      });
    }

    console.log(`Refresh token authenticated for user: ${user.email}`);

    req.user = {
      id: user.id,
      email: user.email
    };

    req.userId = user.id;

    next();
  } catch (error) {
    console.error('Refresh token authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.'
    });
  }
};

export default {
  authenticate,
  optionalAuthenticate,
  authenticateRefreshToken
};
