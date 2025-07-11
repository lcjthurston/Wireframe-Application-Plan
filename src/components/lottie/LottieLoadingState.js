import React from 'react';
import styled, { keyframes } from 'styled-components';
import LottiePlayer from './LottiePlayer';
import spinnerDotsAnimation from '../../assets/lottie/loading/spinner-dots.json';

const LottieLoadingState = ({
  type = 'spinner',
  size = 48,
  message = 'Loading...',
  showMessage = true,
  animationData,
  overlay = false,
  overlayColor = 'rgba(255, 255, 255, 0.9)',
  className,
  style,
  speed = 1,
  color = '#3b82f6',
  ...props
}) => {
  const loadingSize = typeof size === 'number' ? `${size}px` : size;

  // Fallback animations for different types
  const getFallbackAnimation = () => {
    switch (type) {
      case 'dots':
        return <DotsLoader $color={color} />;
      case 'pulse':
        return <PulseLoader $color={color} />;
      case 'bars':
        return <BarsLoader $color={color} />;
      default:
        return <SpinnerLoader $color={color} />;
    }
  };

  const LoadingContent = (
    <LoadingContainer className={className} style={style}>
      <AnimationContainer $size={loadingSize}>
        {animationData ? (
          <LottiePlayer
            animationData={animationData}
            loop={true}
            autoplay={true}
            speed={speed}
            width="100%"
            height="100%"
            renderer="svg"
            onError={() => {
              // Fallback to CSS animation on error
              console.warn('Lottie animation failed, using CSS fallback');
            }}
            {...props}
          />
        ) : (
          getFallbackAnimation()
        )}
      </AnimationContainer>
      {showMessage && <LoadingMessage>{message}</LoadingMessage>}
    </LoadingContainer>
  );

  if (overlay) {
    return (
      <OverlayContainer $color={overlayColor}>
        {LoadingContent}
      </OverlayContainer>
    );
  }

  return LoadingContent;
};

// CSS Fallback Animations
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
`;

const bounce = keyframes`
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
`;

const bars = keyframes`
  0%, 40%, 100% { transform: scaleY(0.4); }
  20% { transform: scaleY(1); }
`;

// Styled Components
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

const AnimationContainer = styled.div`
  width: ${props => props.$size};
  height: ${props => props.$size};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingMessage = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #666;
  text-align: center;
`;

const OverlayContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: ${props => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(2px);
`;

// CSS Fallback Loaders
const SpinnerLoader = styled.div`
  width: 100%;
  height: 100%;
  border: 3px solid rgba(59, 130, 246, 0.1);
  border-top: 3px solid ${props => props.$color};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const PulseLoader = styled.div`
  width: 60%;
  height: 60%;
  background: ${props => props.$color};
  border-radius: 50%;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const DotsLoader = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  &::before,
  &::after {
    content: '';
    width: 8px;
    height: 8px;
    background: ${props => props.$color};
    border-radius: 50%;
    animation: ${bounce} 1.4s ease-in-out infinite both;
  }

  &::before {
    animation-delay: -0.32s;
  }

  &::after {
    animation-delay: -0.16s;
  }
`;

const BarsLoader = styled.div`
  display: flex;
  gap: 2px;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  &::before,
  &::after {
    content: '';
    width: 4px;
    height: 60%;
    background: ${props => props.$color};
    animation: ${bars} 1.2s infinite ease-in-out;
  }

  &::before {
    animation-delay: -0.24s;
  }

  &::after {
    animation-delay: -0.12s;
  }
`;

// Default loading animations
export const defaultLoadingAnimations = {
  spinner: spinnerDotsAnimation,
  dots: null, // Will use CSS fallback
  pulse: null, // Will use CSS fallback
  bars: null, // Will use CSS fallback
};

export default LottieLoadingState;
