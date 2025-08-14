// API Service Layer for Backend Communication
import { authenticatedFetch } from '../utils/auth';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';

// Generic API request handler
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await authenticatedFetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// Accounts API
export const accountsAPI = {
  // Get all accounts with pagination and filtering
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `/api/v1/accounts${queryParams ? `?${queryParams}` : ''}`;
    return apiRequest(endpoint);
  },

  // Get specific account by ID
  getById: async (accountId) => {
    return apiRequest(`/api/v1/accounts/${accountId}`);
  },

  // Create new account
  create: async (accountData) => {
    return apiRequest('/api/v1/accounts', {
      method: 'POST',
      body: JSON.stringify(accountData),
    });
  },

  // Update account
  update: async (accountId, accountData) => {
    return apiRequest(`/api/v1/accounts/${accountId}`, {
      method: 'PUT',
      body: JSON.stringify(accountData),
    });
  },

  // Delete account
  delete: async (accountId) => {
    return apiRequest(`/api/v1/accounts/${accountId}`, {
      method: 'DELETE',
    });
  },

  // Refresh usage data for account
  refreshUsage: async (accountId) => {
    return apiRequest(`/api/v1/accounts/${accountId}/refresh-usage`, {
      method: 'POST',
    });
  },

  // Generate pricing for account
  generatePricing: async (accountId) => {
    return apiRequest(`/api/v1/accounts/${accountId}/generate-pricing`, {
      method: 'POST',
    });
  },
};

// ESIIDs API
export const esiidsAPI = {
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `/api/v1/esiids${queryParams ? `?${queryParams}` : ''}`;
    return apiRequest(endpoint);
  },

  getById: async (esiidId) => {
    return apiRequest(`/api/v1/esiids/${esiidId}`);
  },

  getByAccount: async (accountId) => {
    return apiRequest(`/api/v1/esiids?account_id=${accountId}`);
  },

  refreshUsage: async (esiidId) => {
    return apiRequest(`/api/v1/esiids/${esiidId}/refresh-usage`, {
      method: 'POST',
    });
  },
};

// Managers API
export const managersAPI = {
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `/api/v1/managers${queryParams ? `?${queryParams}` : ''}`;
    return apiRequest(endpoint);
  },

  getById: async (managerId) => {
    return apiRequest(`/api/v1/managers/${managerId}`);
  },

  create: async (managerData) => {
    return apiRequest('/api/v1/managers', {
      method: 'POST',
      body: JSON.stringify(managerData),
    });
  },

  update: async (managerId, managerData) => {
    return apiRequest(`/api/v1/managers/${managerId}`, {
      method: 'PUT',
      body: JSON.stringify(managerData),
    });
  },
};

// Management Companies API
export const companiesAPI = {
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `/api/v1/management-companies${queryParams ? `?${queryParams}` : ''}`;
    return apiRequest(endpoint);
  },

  getById: async (companyId) => {
    return apiRequest(`/api/v1/management-companies/${companyId}`);
  },
};

// Commissions API
export const commissionsAPI = {
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `/api/v1/commissions${queryParams ? `?${queryParams}` : ''}`;
    return apiRequest(endpoint);
  },

  getById: async (commissionId) => {
    return apiRequest(`/api/v1/commissions/${commissionId}`);
  },

  getStats: async () => {
    return apiRequest('/api/v1/commissions/stats');
  },
};

// Providers API
export const providersAPI = {
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `/api/v1/providers${queryParams ? `?${queryParams}` : ''}`;
    return apiRequest(endpoint);
  },

  getById: async (providerId) => {
    return apiRequest(`/api/v1/providers/${providerId}`);
  },
};

// Pricing API
export const pricingAPI = {
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `/api/v1/pricing${queryParams ? `?${queryParams}` : ''}`;
    return apiRequest(endpoint);
  },

  getStats: async () => {
    return apiRequest('/api/v1/pricing/stats');
  },
};

// Analytics API
export const analyticsAPI = {
  getResults: async () => {
    return apiRequest('/api/v1/analytics/results');
  },

  runAnalysis: async (analysisType) => {
    return apiRequest('/api/v1/analytics/run', {
      method: 'POST',
      body: JSON.stringify({ analysis_type: analysisType }),
    });
  },
};

// Tasks API
export const tasksAPI = {
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `/api/v1/tasks${queryParams ? `?${queryParams}` : ''}`;
    return apiRequest(endpoint);
  },

  create: async (taskData) => {
    return apiRequest('/api/v1/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },

  update: async (taskId, taskData) => {
    return apiRequest(`/api/v1/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  },

  delete: async (taskId) => {
    return apiRequest(`/api/v1/tasks/${taskId}`, {
      method: 'DELETE',
    });
  },
};

// Health API
export const healthAPI = {
  check: async () => {
    return apiRequest('/api/v1/health');
  },

  getSystemHealth: async () => {
    return apiRequest('/api/v1/health/system');
  },
};

// Utility function to check if backend is available
export const checkBackendConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.warn('Backend connection check failed:', error);
    return false;
  }
};

// Export all APIs as a single object for convenience
export const API = {
  accounts: accountsAPI,
  esiids: esiidsAPI,
  managers: managersAPI,
  companies: companiesAPI,
  commissions: commissionsAPI,
  providers: providersAPI,
  pricing: pricingAPI,
  analytics: analyticsAPI,
  tasks: tasksAPI,
  health: healthAPI,
  checkConnection: checkBackendConnection,
};
