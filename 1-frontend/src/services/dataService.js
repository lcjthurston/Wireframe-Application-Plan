// Data Service with Backend API and JSON Fallback
import { DATA_CONFIG, DEV_CONFIG } from '../config/app';
import { API } from './api';

// Cache for storing data temporarily
const dataCache = new Map();

// Helper function to log data source
const logDataSource = (source, endpoint) => {
  if (DEV_CONFIG.debug) {
    console.log(`Data loaded from ${source} for ${endpoint}`);
  }
};

// Generic data loader with fallback
const loadData = async (apiCall, jsonImport, cacheKey) => {
  // Check cache first
  if (dataCache.has(cacheKey)) {
    const cached = dataCache.get(cacheKey);
    if (Date.now() - cached.timestamp < 5 * 60 * 1000) { // 5 minute cache
      logDataSource('Cache', cacheKey);
      return cached.data;
    }
  }

  // Try backend API first if enabled
  if (DATA_CONFIG.useBackendAPI) {
    try {
      const data = await apiCall();
      dataCache.set(cacheKey, { data, timestamp: Date.now() });
      logDataSource('Backend API', cacheKey);
      return data;
    } catch (error) {
      console.warn(`Backend API failed for ${cacheKey}, falling back to JSON:`, error);

      if (!DATA_CONFIG.fallbackToJSON) {
        throw error;
      }
    }
  }

  // Fallback to JSON import
  try {
    const data = await jsonImport();
    const processedData = data.default || data;
    dataCache.set(cacheKey, { data: processedData, timestamp: Date.now() });
    logDataSource('Static JSON', cacheKey);
    return processedData;
  } catch (error) {
    console.error(`Failed to load data for ${cacheKey}:`, error);
    throw new Error(`Unable to load ${cacheKey} data from any source`);
  }
};

// Accounts Data Service
export const accountsService = {
  getAll: async (params = {}) => {
    return loadData(
      () => API.accounts.getAll(params),
      () => import('../data/accounts.json'),
      'accounts'
    );
  },

  getById: async (accountId) => {
    if (DATA_CONFIG.useBackendAPI) {
      try {
        return await API.accounts.getById(accountId);
      } catch (error) {
        console.warn('Backend API failed for account details, using cached data');
      }
    }
    
    // Fallback: find in cached accounts data
    const accounts = await accountsService.getAll();
    const account = accounts.find(acc => acc.id === parseInt(accountId));
    if (!account) {
      throw new Error(`Account with ID ${accountId} not found`);
    }
    return account;
  },

  create: async (accountData) => {
    if (!DATA_CONFIG.useBackendAPI) {
      throw new Error('Account creation requires backend API');
    }
    return API.accounts.create(accountData);
  },

  update: async (accountId, accountData) => {
    if (!DATA_CONFIG.useBackendAPI) {
      throw new Error('Account updates require backend API');
    }
    return API.accounts.update(accountId, accountData);
  },

  refreshUsage: async (accountId) => {
    if (!DATA_CONFIG.useBackendAPI) {
      throw new Error('Usage refresh requires backend API');
    }
    return API.accounts.refreshUsage(accountId);
  },
};

// ESIIDs Data Service
export const esiidsService = {
  getAll: async (params = {}) => {
    return loadData(
      () => API.esiids.getAll(params),
      () => import('../data/esiids.json'),
      'esiids'
    );
  },

  getById: async (esiidId) => {
    if (DATA_CONFIG.useBackendAPI) {
      try {
        return await API.esiids.getById(esiidId);
      } catch (error) {
        console.warn('Backend API failed for ESIID details');
      }
    }
    
    const esiids = await esiidsService.getAll();
    const esiid = esiids.find(e => e.id === parseInt(esiidId));
    if (!esiid) {
      throw new Error(`ESIID with ID ${esiidId} not found`);
    }
    return esiid;
  },

  getByAccount: async (accountId) => {
    if (DATA_CONFIG.useBackendAPI) {
      try {
        return await API.esiids.getByAccount(accountId);
      } catch (error) {
        console.warn('Backend API failed for account ESIIDs');
      }
    }
    
    const esiids = await esiidsService.getAll();
    return esiids.filter(e => e.accountId === parseInt(accountId));
  },
};

// Managers Data Service
export const managersService = {
  getAll: async (params = {}) => {
    return loadData(
      () => API.managers.getAll(params),
      () => import('../data/managers.json'),
      'managers'
    );
  },

  getById: async (managerId) => {
    if (DATA_CONFIG.useBackendAPI) {
      try {
        return await API.managers.getById(managerId);
      } catch (error) {
        console.warn('Backend API failed for manager details');
      }
    }
    
    const managers = await managersService.getAll();
    const manager = managers.find(m => m.id === parseInt(managerId));
    if (!manager) {
      throw new Error(`Manager with ID ${managerId} not found`);
    }
    return manager;
  },
};

// Companies Data Service
export const companiesService = {
  getAll: async (params = {}) => {
    return loadData(
      () => API.companies.getAll(params),
      () => import('../data/companies.json'),
      'companies'
    );
  },
};

// Commissions Data Service
export const commissionsService = {
  getAll: async (params = {}) => {
    return loadData(
      () => API.commissions.getAll(params),
      () => import('../data/commissions.json'),
      'commissions'
    );
  },

  getStats: async () => {
    if (DATA_CONFIG.useBackendAPI) {
      try {
        return await API.commissions.getStats();
      } catch (error) {
        console.warn('Backend API failed for commission stats');
      }
    }
    
    // Calculate stats from cached data
    const commissions = await commissionsService.getAll();
    return {
      total: commissions.length,
      totalAmount: commissions.reduce((sum, c) => sum + (c.amount || 0), 0),
      averageAmount: commissions.length > 0 
        ? commissions.reduce((sum, c) => sum + (c.amount || 0), 0) / commissions.length 
        : 0,
    };
  },
};

// Providers Data Service
export const providersService = {
  getAll: async (params = {}) => {
    return loadData(
      () => API.providers.getAll(params),
      () => import('../data/providers.json'),
      'providers'
    );
  },
};

// Pricing Data Service
export const pricingService = {
  getAll: async (params = {}) => {
    return loadData(
      () => API.pricing.getAll(params),
      () => import('../data/pricing.json'),
      'pricing'
    );
  },

  getStats: async () => {
    if (DATA_CONFIG.useBackendAPI) {
      try {
        return await API.pricing.getStats();
      } catch (error) {
        console.warn('Backend API failed for pricing stats');
      }
    }
    
    // Calculate stats from cached data
    const pricing = await pricingService.getAll();
    return {
      total: pricing.length,
      averagePrice: pricing.length > 0 
        ? pricing.reduce((sum, p) => sum + (p.price || 0), 0) / pricing.length 
        : 0,
    };
  },
};

// Analytics Data Service
export const analyticsService = {
  getResults: async () => {
    return loadData(
      () => API.analytics.getResults(),
      () => import('../data/analytics-results.json'),
      'analytics'
    );
  },

  runAnalysis: async (analysisType) => {
    if (!DATA_CONFIG.useBackendAPI) {
      throw new Error('Running analysis requires backend API');
    }
    return API.analytics.runAnalysis(analysisType);
  },
};

// Health Check Service
export const healthService = {
  checkBackend: async () => {
    try {
      await API.health.check();
      return true;
    } catch (error) {
      return false;
    }
  },

  getSystemHealth: async () => {
    if (!DATA_CONFIG.useBackendAPI) {
      return { status: 'static', message: 'Using static data mode' };
    }
    
    try {
      return await API.health.getSystemHealth();
    } catch (error) {
      return { status: 'error', message: 'Backend unavailable' };
    }
  },
};

// Cache management
export const cacheService = {
  clear: () => {
    dataCache.clear();
    console.log('Data cache cleared');
  },

  clearKey: (key) => {
    dataCache.delete(key);
    console.log(`Cache cleared for ${key}`);
  },

  getStats: () => {
    return {
      size: dataCache.size,
      keys: Array.from(dataCache.keys()),
    };
  },
};

// Export all services
export const dataServices = {
  accounts: accountsService,
  esiids: esiidsService,
  managers: managersService,
  companies: companiesService,
  commissions: commissionsService,
  providers: providersService,
  pricing: pricingService,
  analytics: analyticsService,
  health: healthService,
  cache: cacheService,
};
