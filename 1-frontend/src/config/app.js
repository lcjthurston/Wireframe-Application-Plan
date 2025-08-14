// Application Configuration
// This file controls whether the app uses backend APIs or static JSON files

// Environment variables (can be set in .env file)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const USE_MOCK_AUTH = process.env.REACT_APP_USE_MOCK_AUTH !== 'false'; // Default to true for development
const USE_BACKEND_API = process.env.REACT_APP_USE_BACKEND_API === 'true'; // Default to false for development

// Data source configuration
export const DATA_CONFIG = {
  // Whether to use backend APIs or static JSON files
  useBackendAPI: USE_BACKEND_API,
  
  // API base URL for backend calls
  apiBaseUrl: API_BASE_URL,
  
  // Whether to use mock authentication
  useMockAuth: USE_MOCK_AUTH,
  
  // Fallback to JSON files if backend is unavailable
  fallbackToJSON: true,
  
  // Timeout for API requests (milliseconds)
  apiTimeout: 10000,
  
  // Retry configuration
  retryAttempts: 3,
  retryDelay: 1000,
};

// Feature flags
export const FEATURES = {
  // Real-time data updates
  realTimeUpdates: USE_BACKEND_API,
  
  // Data refresh functionality
  dataRefresh: USE_BACKEND_API,
  
  // Pagination for large datasets
  pagination: USE_BACKEND_API,
  
  // Advanced filtering
  advancedFiltering: USE_BACKEND_API,
  
  // Data export functionality
  dataExport: true,
  
  // Analytics dashboard
  analytics: true,
  
  // Task management
  taskManagement: USE_BACKEND_API,
};

// Static data file paths (used when not using backend API)
export const STATIC_DATA_PATHS = {
  accounts: '/src/data/accounts.json',
  esiids: '/src/data/esiids.json',
  managers: '/src/data/managers.json',
  companies: '/src/data/companies.json',
  commissions: '/src/data/commissions.json',
  providers: '/src/data/providers.json',
  pricing: '/src/data/pricing.json',
  analytics: '/src/data/analytics-results.json',
};

// API endpoints (used when using backend API)
export const API_ENDPOINTS = {
  auth: {
    login: '/api/v1/auth/login',
    refresh: '/api/v1/auth/refresh',
    me: '/api/v1/auth/me',
    logout: '/api/v1/auth/logout',
  },
  accounts: '/api/v1/accounts',
  esiids: '/api/v1/esiids',
  managers: '/api/v1/managers',
  companies: '/api/v1/management-companies',
  commissions: '/api/v1/commissions',
  providers: '/api/v1/providers',
  pricing: '/api/v1/pricing',
  analytics: '/api/v1/analytics',
  tasks: '/api/v1/tasks',
  health: '/api/v1/health',
};

// Default pagination settings
export const PAGINATION_CONFIG = {
  defaultPageSize: 50,
  pageSizeOptions: [25, 50, 100, 200],
  maxPageSize: 1000,
};

// Cache configuration
export const CACHE_CONFIG = {
  // Cache duration in milliseconds
  defaultTTL: 5 * 60 * 1000, // 5 minutes
  
  // Cache keys
  keys: {
    accounts: 'accounts_cache',
    esiids: 'esiids_cache',
    managers: 'managers_cache',
    companies: 'companies_cache',
    commissions: 'commissions_cache',
    providers: 'providers_cache',
    pricing: 'pricing_cache',
  },
};

// Development helpers
export const DEV_CONFIG = {
  // Show debug information in console
  debug: process.env.NODE_ENV === 'development',
  
  // Show data source indicator in UI
  showDataSource: process.env.NODE_ENV === 'development',
  
  // Enable performance monitoring
  performanceMonitoring: process.env.NODE_ENV === 'development',
};

// Export configuration summary for debugging
export const getConfigSummary = () => {
  return {
    dataSource: DATA_CONFIG.useBackendAPI ? 'Backend API' : 'Static JSON Files',
    authMode: DATA_CONFIG.useMockAuth ? 'Mock Authentication' : 'Backend Authentication',
    apiUrl: DATA_CONFIG.apiBaseUrl,
    features: Object.entries(FEATURES)
      .filter(([, enabled]) => enabled)
      .map(([feature]) => feature),
    environment: process.env.NODE_ENV,
  };
};

// Log configuration on startup (development only)
if (DEV_CONFIG.debug) {
  console.log('Kilowatt App Configuration:', getConfigSummary());
}
