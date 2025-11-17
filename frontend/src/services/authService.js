import api from './api';

/**
 * Authentication Service
 * Handles all authentication-related API calls and token management
 */

const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

/**
 * Login user with email and password
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<Object>} Login response with user data and tokens
 * @throws {Error} If login fails
 *
 * @example
 * try {
 *   const result = await authService.login('user@example.com', 'password123');
 *   console.log('Logged in:', result.user);
 * } catch (error) {
 *   console.error('Login failed:', error.message);
 * }
 */
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', {
      email,
      password,
    });

    const { user, accessToken, refreshToken } = response.data.data;

    // Store tokens and user data
    setToken(accessToken);
    setRefreshToken(refreshToken);
    setUser(user);

    return {
      success: true,
      user,
      accessToken,
      refreshToken,
    };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
    const errors = error.response?.data?.errors || [];

    throw {
      success: false,
      message: errorMessage,
      errors,
    };
  }
};

/**
 * Register a new user
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @param {string} confirmPassword - Password confirmation
 * @returns {Promise<Object>} Registration response with user data and tokens
 * @throws {Error} If registration fails
 *
 * @example
 * try {
 *   const result = await authService.register('user@example.com', 'password123', 'password123');
 *   console.log('Registered:', result.user);
 * } catch (error) {
 *   console.error('Registration failed:', error.message);
 * }
 */
export const register = async (email, password, confirmPassword) => {
  try {
    const response = await api.post('/auth/register', {
      email,
      password,
      confirmPassword,
    });

    const { user, accessToken, refreshToken } = response.data.data;

    // Store tokens and user data
    setToken(accessToken);
    setRefreshToken(refreshToken);
    setUser(user);

    return {
      success: true,
      user,
      accessToken,
      refreshToken,
    };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
    const errors = error.response?.data?.errors || [];

    throw {
      success: false,
      message: errorMessage,
      errors,
    };
  }
};

/**
 * Logout the current user
 * Clears all stored authentication data
 *
 * @example
 * authService.logout();
 * // User is now logged out and redirected to login page
 */
export const logout = () => {
  // Clear all stored data
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);

  // Optionally redirect to login page
  // window.location.href = '/login';
};

/**
 * Get the stored access token
 * @returns {string|null} Access token or null if not found
 *
 * @example
 * const token = authService.getToken();
 * if (token) {
 *   console.log('User has a token');
 * }
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Get the stored refresh token
 * @returns {string|null} Refresh token or null if not found
 */
export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Set the access token
 * @param {string} token - Access token to store
 */
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Set the refresh token
 * @param {string} token - Refresh token to store
 */
export const setRefreshToken = (token) => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has a valid token
 *
 * @example
 * if (authService.isAuthenticated()) {
 *   console.log('User is logged in');
 * } else {
 *   console.log('User is not logged in');
 * }
 */
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  try {
    // Decode JWT token to check expiration
    const payload = JSON.parse(atob(token.split('.')[1]));
    const isExpired = payload.exp * 1000 < Date.now();

    if (isExpired) {
      // Token is expired, clear it
      logout();
      return false;
    }

    return true;
  } catch (error) {
    // Invalid token format
    logout();
    return false;
  }
};

/**
 * Get stored user data
 * @returns {Object|null} User object or null if not found
 *
 * @example
 * const user = authService.getUser();
 * console.log('Current user:', user?.email);
 */
export const getUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch (error) {
    return null;
  }
};

/**
 * Set user data
 * @param {Object} user - User object to store
 */
export const setUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * Get current user profile from server
 * @returns {Promise<Object>} User profile data
 * @throws {Error} If request fails
 *
 * @example
 * try {
 *   const user = await authService.getCurrentUser();
 *   console.log('User profile:', user);
 * } catch (error) {
 *   console.error('Failed to get user:', error.message);
 * }
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    const user = response.data.data.user;

    // Update stored user data
    setUser(user);

    return user;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to get user profile';
    throw {
      success: false,
      message: errorMessage,
    };
  }
};

/**
 * Change user password
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @param {string} confirmNewPassword - New password confirmation
 * @returns {Promise<Object>} Response data
 * @throws {Error} If password change fails
 *
 * @example
 * try {
 *   await authService.changePassword('oldPass123', 'newPass456', 'newPass456');
 *   console.log('Password changed successfully');
 * } catch (error) {
 *   console.error('Password change failed:', error.message);
 * }
 */
export const changePassword = async (currentPassword, newPassword, confirmNewPassword) => {
  try {
    const response = await api.put('/auth/change-password', {
      currentPassword,
      newPassword,
      confirmNewPassword,
    });

    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to change password';
    const errors = error.response?.data?.errors || [];

    throw {
      success: false,
      message: errorMessage,
      errors,
    };
  }
};

/**
 * Refresh the access token using refresh token
 * @returns {Promise<Object>} New tokens
 * @throws {Error} If refresh fails
 */
export const refreshToken = async () => {
  try {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post('/auth/refresh', {}, {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data.data;

    // Update stored tokens
    setToken(accessToken);
    setRefreshToken(newRefreshToken);

    return {
      success: true,
      accessToken,
      refreshToken: newRefreshToken,
    };
  } catch (error) {
    // Refresh failed - logout user
    logout();

    const errorMessage = error.response?.data?.message || 'Session expired. Please login again.';
    throw {
      success: false,
      message: errorMessage,
    };
  }
};

// Export all functions as default object
export default {
  login,
  register,
  logout,
  getToken,
  getRefreshToken,
  setToken,
  setRefreshToken,
  isAuthenticated,
  getUser,
  setUser,
  getCurrentUser,
  changePassword,
  refreshToken,
};
