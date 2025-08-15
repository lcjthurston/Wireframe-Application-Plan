// Authentication utilities for token management and API calls

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';
const USE_MOCK_AUTH = process.env.REACT_APP_USE_MOCK_AUTH !== 'false'; // Default to true for development

// Token storage keys
const ACCESS_TOKEN_KEY = 'kilowatt_access_token';
const REFRESH_TOKEN_KEY = 'kilowatt_refresh_token';
const USER_DATA_KEY = 'kilowatt_user_data';

/**
 * Store authentication tokens in localStorage
 */
export const storeTokens = (accessToken, refreshToken) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

/**
 * Get access token from localStorage
 */
export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

/**
 * Get refresh token from localStorage
 */
export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Store user data in localStorage
 */
export const storeUserData = (userData) => {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
};

/**
 * Get user data from localStorage
 */
export const getUserData = () => {
  const userData = localStorage.getItem(USER_DATA_KEY);
  return userData ? JSON.parse(userData) : null;
};

/**
 * Clear all authentication data from localStorage
 */
export const clearAuthData = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
};

/**
 * Check if user is authenticated (has valid tokens)
 */
export const isAuthenticated = () => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  return !!(accessToken && refreshToken);
};

/**
 * Decode JWT token to check expiration
 */
export const isTokenExpired = (token) => {
  if (!token) return true;

  // For mock tokens, never expire them
  if (USE_MOCK_AUTH && token.startsWith('mock_')) {
    return false;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    // For mock auth, don't treat decode errors as expired tokens
    if (USE_MOCK_AUTH) {
      return false;
    }
    return true;
  }
};

/**
 * Refresh access token using refresh token
 */
export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();

  if (!refreshToken || isTokenExpired(refreshToken)) {
    throw new Error('No valid refresh token available');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh?refresh_token=${encodeURIComponent(refreshToken)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to refresh token');
    }

    const data = await response.json();
    storeTokens(data.access_token, data.refresh_token);

    return data.access_token;
  } catch (error) {
    console.error('Token refresh failed:', error);
    clearAuthData();
    throw error;
  }
};

/**
 * Make authenticated API request with automatic token refresh
 */
export const authenticatedFetch = async (url, options = {}) => {
  let accessToken = getAccessToken();

  // For mock authentication, skip token validation and refresh
  if (USE_MOCK_AUTH && accessToken && accessToken.startsWith('mock_')) {
    // Make the API request without Authorization header for demo server
    return await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
      },
    });
  }

  // Check if access token is expired and refresh if needed
  if (!accessToken || isTokenExpired(accessToken)) {
    try {
      accessToken = await refreshAccessToken();
    } catch (error) {
      throw new Error('Authentication failed');
    }
  }

  // Make the API request with the access token
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  // If we get a 401, try to refresh the token once more
  if (response.status === 401) {
    try {
      accessToken = await refreshAccessToken();

      // Retry the request with the new token
      return await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      clearAuthData();
      throw new Error('Authentication failed');
    }
  }

  return response;
};

/**
 * Mock login for testing
 */
const mockLogin = async (username, password) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simple mock validation
  if (username === 'admin' && password === 'password') {
    const mockTokens = {
      access_token: 'mock_access_token_' + Date.now(),
      refresh_token: 'mock_refresh_token_' + Date.now(),
      token_type: 'bearer'
    };

    const mockUser = {
      id: 1,
      username: 'admin',
      email: 'admin@kilowatt.com',
      role: 'admin',
      is_active: true,
      created_at: new Date().toISOString(),
    };

    // Store tokens and user data
    storeTokens(mockTokens.access_token, mockTokens.refresh_token);
    storeUserData(mockUser);

    return { tokens: mockTokens, user: mockUser };
  } else {
    throw new Error('Invalid username or password');
  }
};

/**
 * Login user with username/email and password
 */
export const loginUser = async (username, password) => {
  if (USE_MOCK_AUTH) {
    console.log('Using mock authentication');
    return await mockLogin(username, password);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Login failed');
    }

    const data = await response.json();

    // Store tokens
    storeTokens(data.access_token, data.refresh_token);

    // Fetch and store user data
    const userData = await getCurrentUser();
    storeUserData(userData);

    return { tokens: data, user: userData };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Get current user data
 */
export const getCurrentUser = async () => {
  if (USE_MOCK_AUTH) {
    // Return stored user data in mock mode
    const userData = getUserData();
    if (userData) {
      return userData;
    } else {
      throw new Error('No user data found');
    }
  }

  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/api/v1/auth/me`);

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    return await response.json();
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
};

/**
 * Logout user
 */
export const logoutUser = () => {
  clearAuthData();
};
