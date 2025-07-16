import { useState, useEffect, useRef, useCallback } from 'react';
import { preloadAnimation, getCachedAnimation, validateAnimation, performanceMonitor } from './lottieUtils';

/**
 * Custom hook for managing Lottie animations
 * @param {Object} config - Configuration object
 * @returns {Object} - Hook return object with animation state and controls
 */
export const useLottie = (config = {}) => {
  const {
    src,
    animationData: initialAnimationData,
    autoplay = true,
    loop = true,
    speed = 1,
    direction = 1,
    preload = false,
    cacheKey,
    onLoad,
    onError,
    onComplete,
    onLoopComplete
  } = config;

  const [animationData, setAnimationData] = useState(initialAnimationData);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(!!initialAnimationData);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const animationRef = useRef(null);
  const animationId = useRef(`lottie-${Date.now()}-${Math.random()}`);

  // Load animation data
  const loadAnimation = useCallback(async () => {
    if (!src) return;

    setIsLoading(true);
    setError(null);

    try {
      let data;
      
      // Check cache first if cacheKey is provided
      if (cacheKey) {
        data = getCachedAnimation(cacheKey);
      }

      // Load from source if not cached
      if (!data) {
        data = await preloadAnimation(src, cacheKey || src);
      }

      // Validate animation data
      const validation = validateAnimation(data);
      if (!validation.isValid) {
        throw new Error(`Invalid animation data: ${validation.errors.join(', ')}`);
      }

      if (validation.warnings.length > 0) {
        console.warn('Animation warnings:', validation.warnings);
      }

      setAnimationData(data);
      setIsLoaded(true);
      onLoad && onLoad(data);
    } catch (err) {
      setError(err);
      onError && onError(err);
    } finally {
      setIsLoading(false);
    }
  }, [src, cacheKey, onLoad, onError]);

  // Preload animation if requested
  useEffect(() => {
    if (preload && src && !animationData) {
      loadAnimation();
    }
  }, [preload, src, animationData, loadAnimation]);

  // Load animation when src changes
  useEffect(() => {
    if (src && !preload && !animationData) {
      loadAnimation();
    }
  }, [src, preload, animationData, loadAnimation]);

  // Handle directly passed animation data
  useEffect(() => {
    if (initialAnimationData && !src) {
      try {
        // Validate the animation data
        const validation = validateAnimation(initialAnimationData);
        if (validation.isValid) {
          setAnimationData(initialAnimationData);
          setIsLoaded(true);
          setIsLoading(false);
          setError(null);
          if (onLoad) {
            onLoad(initialAnimationData);
          }
        } else {
          throw new Error(`Invalid animation data: ${validation.errors.join(', ')}`);
        }
      } catch (err) {
        console.error('Error validating animation data:', err);
        setError(err);
        setIsLoaded(false);
        setIsLoading(false);
        if (onError) {
          onError(err);
        }
      }
    }
  }, [initialAnimationData, src, onLoad, onError]);

  // Register animation with performance monitor
  useEffect(() => {
    if (animationRef.current) {
      performanceMonitor.registerAnimation(animationId.current, animationRef.current);
      
      return () => {
        performanceMonitor.unregisterAnimation(animationId.current);
      };
    }
  }, [animationRef.current]);

  // Animation control methods
  const play = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.play();
      setIsPlaying(true);
    }
  }, []);

  const pause = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.stop();
      setIsPlaying(false);
    }
  }, []);

  const goToAndStop = useCallback((value, isFrame = false) => {
    if (animationRef.current) {
      animationRef.current.goToAndStop(value, isFrame);
      setIsPlaying(false);
    }
  }, []);

  const goToAndPlay = useCallback((value, isFrame = false) => {
    if (animationRef.current) {
      animationRef.current.goToAndPlay(value, isFrame);
      setIsPlaying(true);
    }
  }, []);

  const setSpeed = useCallback((newSpeed) => {
    if (animationRef.current) {
      animationRef.current.setSpeed(newSpeed);
    }
  }, []);

  const setDirection = useCallback((newDirection) => {
    if (animationRef.current) {
      animationRef.current.setDirection(newDirection);
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  // Get animation info
  const getAnimationInfo = useCallback(() => {
    if (!animationRef.current) return null;

    return {
      currentFrame: animationRef.current.currentFrame,
      totalFrames: animationRef.current.totalFrames,
      currentTime: animationRef.current.currentTime,
      duration: animationRef.current.getDuration(),
      isPaused: animationRef.current.isPaused,
      playDirection: animationRef.current.playDirection,
      playSpeed: animationRef.current.playSpeed
    };
  }, []);

  return {
    // Animation data and state
    animationData,
    isLoading,
    isLoaded,
    error,
    isPlaying,
    
    // Animation reference
    animationRef,
    
    // Control methods
    play,
    pause,
    stop,
    goToAndStop,
    goToAndPlay,
    setSpeed,
    setDirection,
    togglePlayPause,
    
    // Utility methods
    getAnimationInfo,
    reload: loadAnimation,
    
    // Event handlers for LottiePlayer
    onComplete: useCallback(() => {
      setIsPlaying(false);
      onComplete && onComplete();
    }, [onComplete]),
    
    onLoopComplete: useCallback(() => {
      performanceMonitor.updateFrameCount(animationId.current);
      onLoopComplete && onLoopComplete();
    }, [onLoopComplete])
  };
};

/**
 * Hook for preloading multiple animations
 * @param {Array} animations - Array of animation configs
 * @returns {Object} - Preload state and data
 */
export const useLottiePreloader = (animations = []) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadedAnimations, setLoadedAnimations] = useState({});
  const [errors, setErrors] = useState({});
  const [progress, setProgress] = useState(0);

  const preloadAll = useCallback(async () => {
    if (animations.length === 0) return;

    setIsLoading(true);
    setErrors({});
    setProgress(0);

    const results = {};
    const errorResults = {};
    let completed = 0;

    for (const animation of animations) {
      try {
        const data = await preloadAnimation(animation.src, animation.key);
        results[animation.key] = data;
      } catch (error) {
        errorResults[animation.key] = error;
      }
      
      completed++;
      setProgress((completed / animations.length) * 100);
    }

    setLoadedAnimations(results);
    setErrors(errorResults);
    setIsLoading(false);
  }, [animations]);

  useEffect(() => {
    preloadAll();
  }, [preloadAll]);

  return {
    isLoading,
    loadedAnimations,
    errors,
    progress,
    reload: preloadAll
  };
};

export default useLottie;
