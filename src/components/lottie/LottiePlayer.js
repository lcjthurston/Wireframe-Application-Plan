import React, { useRef, useEffect, useState, forwardRef } from 'react';
import Lottie from 'lottie-react';
import styled from 'styled-components';

const LottiePlayer = forwardRef(({
  animationData,
  loop = true,
  autoplay = true,
  speed = 1,
  direction = 1,
  width = '100%',
  height = '100%',
  className,
  onComplete,
  onLoopComplete,
  onError,
  onLoad,
  style,
  renderer = 'svg',
  preserveAspectRatio = 'xMidYMid meet',
  ...props
}, ref) => {
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!animationData) return;

    // Mark as loaded immediately since lottie-react handles the loading
    setIsLoaded(true);
    setHasError(false);

    if (onLoad) {
      onLoad();
    }
  }, [animationData, onLoad]);

  // Control methods (simplified for lottie-react)
  const play = () => {
    // Handled by lottie-react autoplay prop
  };

  const pause = () => {
    // Handled by lottie-react
  };

  const stop = () => {
    // Handled by lottie-react
  };

  const goToAndStop = (value, isFrame = false) => {
    // Handled by lottie-react
  };

  const goToAndPlay = (value, isFrame = false) => {
    // Handled by lottie-react
  };

  const setSpeed = (newSpeed) => {
    // Handled by lottie-react
  };

  const setDirection = (newDirection) => {
    // Handled by lottie-react
  };

  // Expose control methods via ref
  React.useImperativeHandle(props.ref, () => ({
    play,
    pause,
    stop,
    goToAndStop,
    goToAndPlay,
    setSpeed,
    setDirection,
    animation: null, // lottie-react doesn't expose the animation instance
  }));

  if (hasError) {
    return (
      <ErrorContainer style={{ width, height, ...style }} className={className}>
        <ErrorMessage>Failed to load animation</ErrorMessage>
      </ErrorContainer>
    );
  }

  return (
    <Container
      ref={ref || containerRef}
      style={{ width, height, ...style }}
      className={className}
      $isLoaded={isLoaded}
      {...props}
    >
      <Lottie
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        style={{ width: '100%', height: '100%' }}
        onComplete={onComplete}
        onLoopComplete={onLoopComplete}
        onLoadedImages={() => {
          setIsLoaded(true);
          if (onLoad) onLoad();
        }}
        onError={(error) => {
          setHasError(true);
          if (onError) onError(error);
        }}
      />
    </Container>
  );
});

LottiePlayer.displayName = 'LottiePlayer';

// Styled Components
const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${props => props.$isLoaded ? 1 : 0};
  transition: opacity 0.3s ease;
`;

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 0, 0, 0.1);
  border: 1px solid rgba(255, 0, 0, 0.3);
  border-radius: 4px;
`;

const ErrorMessage = styled.span`
  color: #ff4444;
  font-size: 12px;
  font-weight: 500;
`;

// Add display name for debugging
LottiePlayer.displayName = 'LottiePlayer';

export default LottiePlayer;
