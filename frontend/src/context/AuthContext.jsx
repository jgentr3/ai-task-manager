import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import authService from '../services/authService';

/**
 * Authentication Context
 * Provides authentication state and methods throughout the application
 */
const AuthContext = createContext(null);

/**
 * Custom hook to use the Auth context
 * Must be used within an AuthProvider
 *
 * @returns {Object} Auth context value
 * @throws {Error} If used outside AuthProvider
 *
 * @example
 * const { user, login, logout } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * AuthProvider Component
 * Wraps the application to provide authentication context
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Initialize authentication state on mount
   * Checks for existing token and verifies it
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user is authenticated
        if (authService.isAuthenticated()) {
          // Get stored user data
          const storedUser = authService.getUser();

          if (storedUser) {
            setUser(storedUser);
          } else {
            // Fetch fresh user data from server
            try {
              const currentUser = await authService.getCurrentUser();
              setUser(currentUser);
            } catch (error) {
              // Token is invalid or expired
              console.error('Failed to fetch user:', error);
              authService.logout();
              setUser(null);
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Login function
   * Authenticates user with email and password
   *
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<Object>} Login result
   *
   * @example
   * const result = await login('user@example.com', 'password123');
   * if (result.success) {
   *   console.log('Logged in as:', result.user.email);
   * } else {
   *   console.error(result.error);
   * }
   */
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const result = await authService.login(email, password);

      // Update user state
      setUser(result.user);

      return {
        success: true,
        user: result.user
      };
    } catch (error) {
      setError(error.message);
      return {
        success: false,
        error: error.message,
        errors: error.errors || []
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Register function
   * Creates a new user account
   *
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @param {string} confirmPassword - Password confirmation
   * @returns {Promise<Object>} Registration result
   *
   * @example
   * const result = await register('user@example.com', 'password123', 'password123');
   * if (result.success) {
   *   console.log('Registered as:', result.user.email);
   * } else {
   *   console.error(result.error);
   *   console.log('Validation errors:', result.errors);
   * }
   */
  const register = useCallback(async (email, password, confirmPassword) => {
    try {
      setLoading(true);
      setError(null);

      const result = await authService.register(email, password, confirmPassword);

      // Update user state
      setUser(result.user);

      return {
        success: true,
        user: result.user
      };
    } catch (error) {
      setError(error.message);
      return {
        success: false,
        error: error.message,
        errors: error.errors || []
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logout function
   * Clears authentication state and tokens
   *
   * @example
   * logout();
   * // User is now logged out
   */
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setError(null);
  }, []);

  /**
   * Update user profile
   * Fetches latest user data from server
   *
   * @returns {Promise<Object>} Updated user data
   *
   * @example
   * const updatedUser = await updateUser();
   */
  const updateUser = useCallback(async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      return currentUser;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }, []);

  /**
   * Change password
   * Updates user's password
   *
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @param {string} confirmNewPassword - New password confirmation
   * @returns {Promise<Object>} Result of password change
   *
   * @example
   * const result = await changePassword('oldPass', 'newPass', 'newPass');
   * if (result.success) {
   *   console.log('Password changed successfully');
   * }
   */
  const changePassword = useCallback(async (currentPassword, newPassword, confirmNewPassword) => {
    try {
      setLoading(true);
      setError(null);

      const result = await authService.changePassword(
        currentPassword,
        newPassword,
        confirmNewPassword
      );

      return {
        success: true,
        message: result.message
      };
    } catch (error) {
      setError(error.message);
      return {
        success: false,
        error: error.message,
        errors: error.errors || []
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Check if user is authenticated
   *
   * @returns {boolean} True if user is logged in
   */
  const isAuthenticated = useCallback(() => {
    return authService.isAuthenticated();
  }, []);

  /**
   * Get current access token
   *
   * @returns {string|null} Access token or null
   */
  const getToken = useCallback(() => {
    return authService.getToken();
  }, []);

  // Context value
  const value = {
    // State
    user,
    loading,
    error,

    // Authentication methods
    login,
    register,
    logout,

    // User management
    updateUser,
    changePassword,

    // Utility methods
    isAuthenticated,
    getToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
