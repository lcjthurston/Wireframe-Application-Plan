import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
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

  // Reset retry count when animation loads successfully
  useEffect(() => {
    if (isLoaded && !error) {
      setRetryCount(0);
    }
  }, [isLoaded, error]);

  const containerStyle = {
    width,
    height,
    ...style
  };

  // Show loading state
  if (showLoading && isLoading && !animationData) {
    return (
      <Container style={containerStyle} className={className}>
        <LottieLoadingState
          type={loadingType}
          size={loadingSize}
          message={loadingMessage}
          width="100%"
          height="100%"
        />
      </Container>
    );
  }

  // Show error state
  if (error && !isLoading) {
    const ErrorComponent = (
      <ErrorContainer style={containerStyle} className={className}>
        <ErrorIcon>⚠️</ErrorIcon>
        <ErrorTitle>Animation Failed</ErrorTitle>
        <ErrorMessage>{error.message}</ErrorMessage>
        {retryCount < maxRetries && (
          <RetryButton onClick={handleRetry}>
            Retry ({maxRetries - retryCount} attempts left)
          </RetryButton>
        )}
        {retryCount >= maxRetries && (
          <MaxRetriesMessage>
            Maximum retry attempts reached. Please check your connection.
          </MaxRetriesMessage>
        )}
      </ErrorContainer>
    );

    if (errorFallback) {
      return typeof errorFallback === 'function' 
        ? errorFallback(error, handleRetry)
        : errorFallback;
    }

    return ErrorComponent;
  }

  // Show animation
  if (animationData) {
    const AnimationComponent = (
      <Container style={containerStyle} className={className}>
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
      </Container>
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

  // Fallback empty state
  return (
    <Container style={containerStyle} className={className}>
      <EmptyState>No animation data</EmptyState>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(255, 0, 0, 0.05);
  border: 1px solid rgba(255, 0, 0, 0.2);
  border-radius: 8px;
  text-align: center;
  gap: 12px;
`;

const ErrorIcon = styled.div`
  font-size: 24px;
`;

const ErrorTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #d32f2f;
`;

const ErrorMessage = styled.p`
  margin: 0;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
`;

const RetryButton = styled.button`
  background: #d32f2f;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #b71c1c;
  }
`;

const MaxRetriesMessage = styled.div`
  font-size: 12px;
  color: #999;
  font-style: italic;
`;

const EmptyState = styled.div`
  color: #999;
  font-size: 14px;
  font-style: italic;
`;

export default LottieWithStates;
