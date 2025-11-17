import axios from 'axios';

/**
 * Base API Configuration
 * Axios instance with automatic authentication and error handling
 */

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Automatically adds Authorization header with JWT token
 */
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('accessToken');

    // Add token to headers if it exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles common response scenarios and errors
 */
api.interceptors.response.use(
  (response) => {
    // Return successful response
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Check if this is not a login/register request
      const isAuthRequest = originalRequest.url.includes('/auth/login') ||
                           originalRequest.url.includes('/auth/register');

      if (!isAuthRequest && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Try to refresh the token
          const refreshToken = localStorage.getItem('refreshToken');

          if (refreshToken) {
            const response = await axios.post('/api/auth/refresh', {}, {
              headers: {
                Authorization: `Bearer ${refreshToken}`
              }
            });

            // Store new tokens
            const { accessToken, refreshToken: newRefreshToken } = response.data.data;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', newRefreshToken);

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed - clear tokens and redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');

          // Redirect to login page
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }

          return Promise.reject(refreshError);
        }
      }

      // If it's a login/register request or retry failed, clear tokens
      if (isAuthRequest) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }

    // Handle 403 Forbidden errors
    if (error.response?.status === 403) {
      console.error('Access forbidden:', error.response.data);
    }

    // Handle 404 Not Found errors
    if (error.response?.status === 404) {
      console.error('Resource not found:', error.response.data);
    }

    // Handle 500 Internal Server errors
    if (error.response?.status === 500) {
      console.error('Server error:', error.response.data);
    }

    // Handle network errors
    if (error.message === 'Network Error') {
      console.error('Network error - server may be offline');
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
    }

    return Promise.reject(error);
  }
);

/**
 * API Helper Methods
 */

/**
 * GET request
 * @param {string} url - API endpoint
 * @param {object} config - Axios config options
 * @returns {Promise} API response
 */
export const get = (url, config = {}) => {
  return api.get(url, config);
};

/**
 * POST request
 * @param {string} url - API endpoint
 * @param {object} data - Request body
 * @param {object} config - Axios config options
 * @returns {Promise} API response
 */
export const post = (url, data = {}, config = {}) => {
  return api.post(url, data, config);
};

/**
 * PUT request
 * @param {string} url - API endpoint
 * @param {object} data - Request body
 * @param {object} config - Axios config options
 * @returns {Promise} API response
 */
export const put = (url, data = {}, config = {}) => {
  return api.put(url, data, config);
};

/**
 * PATCH request
 * @param {string} url - API endpoint
 * @param {object} data - Request body
 * @param {object} config - Axios config options
 * @returns {Promise} API response
 */
export const patch = (url, data = {}, config = {}) => {
  return api.patch(url, data, config);
};

/**
 * DELETE request
 * @param {string} url - API endpoint
 * @param {object} config - Axios config options
 * @returns {Promise} API response
 */
export const del = (url, config = {}) => {
  return api.delete(url, config);
};

// Export the configured axios instance as default
export default api;
