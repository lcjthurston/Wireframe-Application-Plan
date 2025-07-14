import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import LottiePlayer from './LottiePlayer';
import LottieErrorBoundary from './LottieErrorBoundary';
import LottieLoadingState from './LottieLoadingState';
import { useLottie } from '../../utils/useLottie';

const LottieWithStates = ({
  src,
  animationData: initialAnimationData,
  width = '100%',
  height = '100%',
  
  // Loading state props
  showLoading = true,
  loadingType = 'spinner',
  loadingMessage = 'Loading animation...',
  loadingSize = 48,
  
  // Error state props
  showErrorBoundary = true,
  errorFallback,
  onError,
  onRetry,
  
  // Animation props
  loop = true,
  autoplay = true,
  speed = 1,
  direction = 1,
  
  // Caching props
  preload = false,
  cacheKey,
  
  // Event handlers
  onLoad,
  onComplete,
  onLoopComplete,
  
  // Styling
  className,
  style,
  
  ...props
}) => {
  const {
    animationData,
    isLoading,
    isLoaded,
    error,
    animationRef,
    play,
    pause,
    stop,
    reload
  } = useLottie({
    src,
    animationData: initialAnimationData,
    autoplay,
    loop,
    speed,
    direction,
    preload,
    cacheKey,
    onLoad,
    onError,
    onComplete,
    onLoopComplete
  });

  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const handleRetry = () => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      reload();
      if (onRetry) {
        onRetry(retryCount + 1);
      }
    }
  };

  const handleError = (error, errorInfo) => {
    console.error('Lottie animation error:', error);
    if (onError) {
      onError(error, errorInfo);
    }
  };

  const containerStyle = {
    width,
    height,
    ...style
  };

  // Show loading state
  if (isLoading && showLoading) {
    return (
      <Box sx={containerStyle} className={className}>
        <LottieLoadingState
          type={loadingType}
          size={loadingSize}
          message={loadingMessage}
          showMessage={true}
        />
      </Box>
    );
  }

  // Show animation
  if (animationData) {
    const AnimationComponent = (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          ...containerStyle
        }}
        className={className}
      >
        <LottiePlayer
          ref={animationRef}
          animationData={animationData}
          loop={loop}
          autoplay={autoplay}
          speed={speed}
          direction={direction}
          width="100%"
          height="100%"
          onComplete={onComplete}
          onLoopComplete={onLoopComplete}
          onError={handleError}
          {...props}
        />
      </Box>
    );

    if (showErrorBoundary) {
      return (
        <LottieErrorBoundary
          onError={handleError}
          onRetry={handleRetry}
          fallback={errorFallback}
          width={width}
          height={height}
          className={className}
          style={style}
        >
          {AnimationComponent}
        </LottieErrorBoundary>
      );
    }

    return AnimationComponent;
  }

  // Show error state
  if (error) {
    return (
      <LottieErrorBoundary
        onError={handleError}
        onRetry={handleRetry}
        fallback={errorFallback}
        width={width}
        height={height}
        className={className}
        style={style}
      >
        <div>Error loading animation</div>
      </LottieErrorBoundary>
    );
  }

  // Default empty state
  return (
    <Box sx={containerStyle} className={className}>
      <LottieLoadingState
        type="spinner"
        size={loadingSize}
        message="No animation data"
        showMessage={true}
      />
    </Box>
  );
};

export default LottieWithStates;
