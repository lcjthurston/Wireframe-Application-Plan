/**
 * Lottie Utility Functions
 * Helper functions for managing Lottie animations, preloading, and performance optimization
 */

// Animation cache for preloaded animations
const animationCache = new Map();

/**
 * Preload a Lottie animation
 * @param {string} url - URL or path to the Lottie JSON file
 * @param {string} key - Cache key for the animation
 * @returns {Promise<Object>} - Promise that resolves to animation data
 */
export const preloadAnimation = async (url, key) => {
  if (animationCache.has(key)) {
    return animationCache.get(key);
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load animation: ${response.statusText}`);
    }
    
    const animationData = await response.json();
    animationCache.set(key, animationData);
    return animationData;
  } catch (error) {
    console.error(`Error preloading animation ${key}:`, error);
    throw error;
  }
};

/**
 * Preload multiple animations
 * @param {Array<{url: string, key: string}>} animations - Array of animation configs
 * @returns {Promise<Object>} - Promise that resolves to object with all animation data
 */
export const preloadAnimations = async (animations) => {
  const promises = animations.map(({ url, key }) => 
    preloadAnimation(url, key).then(data => ({ key, data }))
  );

  try {
    const results = await Promise.all(promises);
    return results.reduce((acc, { key, data }) => {
      acc[key] = data;
      return acc;
    }, {});
  } catch (error) {
    console.error('Error preloading animations:', error);
    throw error;
  }
};

/**
 * Get cached animation data
 * @param {string} key - Cache key
 * @returns {Object|null} - Animation data or null if not cached
 */
export const getCachedAnimation = (key) => {
  return animationCache.get(key) || null;
};

/**
 * Clear animation cache
 * @param {string} key - Optional key to clear specific animation, or clear all if not provided
 */
export const clearAnimationCache = (key) => {
  if (key) {
    animationCache.delete(key);
  } else {
    animationCache.clear();
  }
};

/**
 * Get cache size and statistics
 * @returns {Object} - Cache statistics
 */
export const getCacheStats = () => {
  return {
    size: animationCache.size,
    keys: Array.from(animationCache.keys()),
    memoryUsage: JSON.stringify(Array.from(animationCache.values())).length
  };
};

/**
 * Optimize animation data for web
 * @param {Object} animationData - Original animation data
 * @param {Object} options - Optimization options
 * @returns {Object} - Optimized animation data
 */
export const optimizeAnimation = (animationData, options = {}) => {
  const {
    removeHiddenLayers = true,
    simplifyPaths = true,
    reduceKeyframes = false,
    maxDuration = null
  } = options;

  // Create a deep copy to avoid mutating original data
  const optimized = JSON.parse(JSON.stringify(animationData));

  if (removeHiddenLayers && optimized.layers) {
    optimized.layers = optimized.layers.filter(layer => 
      layer.hd !== true && layer.td === undefined
    );
  }

  if (maxDuration && optimized.op) {
    optimized.op = Math.min(optimized.op, maxDuration);
  }

  return optimized;
};

/**
 * Create a responsive animation configuration
 * @param {Object} baseConfig - Base animation configuration
 * @param {Object} breakpoints - Responsive breakpoints
 * @returns {Object} - Responsive configuration
 */
export const createResponsiveConfig = (baseConfig, breakpoints = {}) => {
  const defaultBreakpoints = {
    mobile: 768,
    tablet: 1024,
    desktop: 1200
  };

  const bp = { ...defaultBreakpoints, ...breakpoints };

  return {
    ...baseConfig,
    getConfigForWidth: (width) => {
      if (width <= bp.mobile) {
        return {
          ...baseConfig,
          speed: baseConfig.speed * 0.8,
          loop: true,
          autoplay: false // Save battery on mobile
        };
      } else if (width <= bp.tablet) {
        return {
          ...baseConfig,
          speed: baseConfig.speed * 0.9
        };
      } else {
        return baseConfig;
      }
    }
  };
};

/**
 * Validate animation data
 * @param {Object} animationData - Animation data to validate
 * @returns {Object} - Validation result
 */
export const validateAnimation = (animationData) => {
  const errors = [];
  const warnings = [];

  if (!animationData) {
    errors.push('Animation data is null or undefined');
    return { isValid: false, errors, warnings };
  }

  if (!animationData.v) {
    warnings.push('Missing version information');
  }

  if (!animationData.fr) {
    warnings.push('Missing frame rate information');
  }

  if (animationData.ip === undefined || animationData.ip === null ||
      animationData.op === undefined || animationData.op === null) {
    errors.push('Missing in-point or out-point');
  }

  if (!animationData.layers || !Array.isArray(animationData.layers)) {
    errors.push('Missing or invalid layers');
  }

  if (animationData.assets && animationData.assets.length > 50) {
    warnings.push('Large number of assets may impact performance');
  }

  const duration = animationData.op - animationData.ip;
  if (duration > 300) { // 10 seconds at 30fps
    warnings.push('Long animation duration may impact performance');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    duration,
    frameRate: animationData.fr,
    version: animationData.v
  };
};

/**
 * Create animation variants for different states
 * @param {Object} baseAnimation - Base animation data
 * @param {Object} variants - Variant configurations
 * @returns {Object} - Animation variants
 */
export const createAnimationVariants = (baseAnimation, variants = {}) => {
  const defaultVariants = {
    normal: { speed: 1, direction: 1 },
    fast: { speed: 2, direction: 1 },
    slow: { speed: 0.5, direction: 1 },
    reverse: { speed: 1, direction: -1 }
  };

  const allVariants = { ...defaultVariants, ...variants };

  return Object.keys(allVariants).reduce((acc, key) => {
    acc[key] = {
      animationData: baseAnimation,
      ...allVariants[key]
    };
    return acc;
  }, {});
};

/**
 * Performance monitor for Lottie animations
 */
export class LottiePerformanceMonitor {
  constructor() {
    this.animations = new Map();
    this.metrics = {
      totalAnimations: 0,
      activeAnimations: 0,
      averageFrameRate: 0,
      memoryUsage: 0
    };
  }

  registerAnimation(id, animation) {
    this.animations.set(id, {
      animation,
      startTime: Date.now(),
      frameCount: 0,
      lastFrameTime: Date.now()
    });
    this.metrics.totalAnimations++;
    this.metrics.activeAnimations++;
  }

  unregisterAnimation(id) {
    if (this.animations.has(id)) {
      this.animations.delete(id);
      this.metrics.activeAnimations--;
    }
  }

  updateFrameCount(id) {
    const animData = this.animations.get(id);
    if (animData) {
      animData.frameCount++;
      animData.lastFrameTime = Date.now();
    }
  }

  getMetrics() {
    const now = Date.now();
    let totalFrameRate = 0;
    let activeCount = 0;

    this.animations.forEach((data) => {
      const duration = (now - data.startTime) / 1000;
      if (duration > 0) {
        const frameRate = data.frameCount / duration;
        totalFrameRate += frameRate;
        activeCount++;
      }
    });

    this.metrics.averageFrameRate = activeCount > 0 ? totalFrameRate / activeCount : 0;
    this.metrics.memoryUsage = this.animations.size * 1024; // Rough estimate

    return { ...this.metrics };
  }
}

// Global performance monitor instance
export const performanceMonitor = new LottiePerformanceMonitor();
