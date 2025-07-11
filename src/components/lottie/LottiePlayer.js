import React, { useRef, useEffect, useState, forwardRef } from 'react';
import lottie from 'lottie-web';
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
    if (!animationData || !containerRef.current) return;

    try {
      // Destroy existing animation if it exists
      if (animationRef.current) {
        animationRef.current.destroy();
      }

      // Create new animation
      animationRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer,
        loop,
        autoplay,
        animationData,
        rendererSettings: {
          preserveAspectRatio,
          progressiveLoad: true,
          hideOnTransparent: true,
        },
      });

      // Set speed and direction
      animationRef.current.setSpeed(speed);
      animationRef.current.setDirection(direction);

      // Event listeners
      animationRef.current.addEventListener('complete', () => {
        onComplete && onComplete();
      });

      animationRef.current.addEventListener('loopComplete', () => {
        onLoopComplete && onLoopComplete();
      });

      animationRef.current.addEventListener('data_ready', () => {
        setIsLoaded(true);
        onLoad && onLoad();
      });

      animationRef.current.addEventListener('data_failed', () => {
        setHasError(true);
        onError && onError(new Error('Failed to load animation data'));
      });

    } catch (error) {
      setHasError(true);
      onError && onError(error);
    }

    // Cleanup function
    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
        animationRef.current = null;
      }
    };
  }, [animationData, loop, autoplay, speed, direction, renderer, preserveAspectRatio, onComplete, onLoopComplete, onError, onLoad]);

  // Control methods
  const play = () => {
    if (animationRef.current) {
      animationRef.current.play();
    }
  };

  const pause = () => {
    if (animationRef.current) {
      animationRef.current.pause();
    }
  };

  const stop = () => {
    if (animationRef.current) {
      animationRef.current.stop();
    }
  };

  const goToAndStop = (value, isFrame = false) => {
    if (animationRef.current) {
      animationRef.current.goToAndStop(value, isFrame);
    }
  };

  const goToAndPlay = (value, isFrame = false) => {
    if (animationRef.current) {
      animationRef.current.goToAndPlay(value, isFrame);
    }
  };

  const setSpeed = (newSpeed) => {
    if (animationRef.current) {
      animationRef.current.setSpeed(newSpeed);
    }
  };

  const setDirection = (newDirection) => {
    if (animationRef.current) {
      animationRef.current.setDirection(newDirection);
    }
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
    animation: animationRef.current,
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
    />
  );
});

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
