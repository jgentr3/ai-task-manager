import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { generateTokenPair } from '../config/jwt.js';
import { authenticate, authenticateRefreshToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/register',
  [
    // Validation middleware
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/[A-Z]/)
      .withMessage('Password must contain at least one uppercase letter')
      .matches(/[a-z]/)
      .withMessage('Password must contain at least one lowercase letter')
      .matches(/\d/)
      .withMessage('Password must contain at least one number')
      .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
      .withMessage('Password must contain at least one special character'),
    body('confirmPassword')
      .custom((value, { req }) => value === req.body.password)
      .withMessage('Passwords do not match')
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

      const { email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        console.log(`Registration failed: Email ${email} already exists`);
        return res.status(409).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      // Create user (password will be hashed internally by User.create)
      let newUser;
      try {
        newUser = await User.create(email, password);
      } catch (error) {
        console.error('User creation error:', error);
        if (error.message === 'Email already exists') {
          return res.status(409).json({
            success: false,
            message: 'User with this email already exists'
          });
        }
        throw error;
      }

      // Generate JWT tokens
      const tokens = generateTokenPair({
        id: newUser.id,
        email: newUser.email
      });

      // Return success response
      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: newUser.id,
            email: newUser.email,
            created_at: newUser.created_at
          },
          ...tokens
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred during registration',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return JWT token
 * @access  Public
 */
router.post(
  '/login',
  [
    // Validation middleware
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
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

      const { email, password } = req.body;

      console.log(`Login attempt for email: ${email}`);

      // Find user with password hash
      const user = await User.findByEmailWithPassword(email);

      if (!user) {
        console.log(`Login failed: User not found for email ${email}`);
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      console.log(`User found: ${user.email}, verifying password...`);

      // Compare passwords using User.verifyPassword (synchronous bcrypt)
      const isPasswordValid = User.verifyPassword(password, user.password_hash);

      if (!isPasswordValid) {
        console.log(`Login failed: Invalid password for email ${email}`);
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      console.log(`Login successful for email: ${email}`);

      // Generate JWT tokens
      const tokens = generateTokenPair({
        id: user.id,
        email: user.email
      });

      // Return success response
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            email: user.email,
            created_at: user.created_at
          },
          ...tokens
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred during login',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token using refresh token
 * @access  Private (requires refresh token)
 */
router.post('/refresh', authenticateRefreshToken, async (req, res) => {
  try {
    // User info is attached by authenticateRefreshToken middleware
    const user = req.user;

    // Generate new token pair
    const tokens = generateTokenPair({
      id: user.id,
      email: user.email
    });

    return res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: tokens
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while refreshing token',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user's profile
 * @access  Private
 */
router.get('/me', authenticate, async (req, res) => {
  try {
    console.log(`Fetching profile for user ID: ${req.userId}`);
    const user = await User.findById(req.userId);

    if (!user) {
      console.log(`Profile fetch failed: User ID ${req.userId} not found`);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          created_at: user.created_at
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change user's password
 * @access  Private
 */
router.put(
  '/change-password',
  [
    authenticate,
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters long')
      .matches(/[A-Z]/)
      .withMessage('New password must contain at least one uppercase letter')
      .matches(/[a-z]/)
      .withMessage('New password must contain at least one lowercase letter')
      .matches(/\d/)
      .withMessage('New password must contain at least one number')
      .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
      .withMessage('New password must contain at least one special character'),
    body('confirmNewPassword')
      .custom((value, { req }) => value === req.body.newPassword)
      .withMessage('Passwords do not match')
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

      const { currentPassword, newPassword } = req.body;

      console.log(`Password change attempt for user: ${req.user.email}`);

      // Get user with password hash
      const user = await User.findByEmailWithPassword(req.user.email);

      if (!user) {
        console.log(`Password change failed: User ${req.user.email} not found`);
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Verify current password using User.verifyPassword (synchronous bcrypt)
      const isPasswordValid = User.verifyPassword(currentPassword, user.password_hash);

      if (!isPasswordValid) {
        console.log(`Password change failed: Invalid current password for ${req.user.email}`);
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      // Update password (will be hashed internally by User.updatePassword)
      await User.updatePassword(user.id, newPassword);

      console.log(`Password changed successfully for user: ${req.user.email}`);

      return res.status(200).json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Change password error:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while changing password',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

export default router;
