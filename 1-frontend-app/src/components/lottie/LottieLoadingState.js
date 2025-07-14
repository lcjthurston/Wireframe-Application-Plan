import React from 'react';
import { Box, Typography, keyframes } from '@mui/material';
import { styled } from '@mui/material/styles';
import LottiePlayer from './LottiePlayer';
import spinnerDotsAnimation from '../../assets/lottie/loading/spinner-dots.json';

// Keyframes for CSS fallback animations
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.7; }
`;

const bounce = keyframes`
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
`;

const bars = keyframes`
  0%, 40%, 100% { transform: scaleY(0.4); }
  20% { transform: scaleY(1); }
`;

// Styled fallback loaders
const SpinnerLoader = styled(Box)(({ theme, color }) => ({
  width: '100%',
  height: '100%',
  border: `3px solid rgba(59, 130, 246, 0.1)`,
  borderTop: `3px solid ${color}`,
  borderRadius: '50%',
  animation: `${spin} 1s linear infinite`
}));

const PulseLoader = styled(Box)(({ theme, color }) => ({
  width: '60%',
  height: '60%',
  backgroundColor: color,
  borderRadius: '50%',
  animation: `${pulse} 1.5s ease-in-out infinite`
}));

const DotsLoader = styled(Box)(({ theme, color }) => ({
  display: 'flex',
  gap: '4px',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  '&::before, &::after': {
    content: '""',
    width: '8px',
    height: '8px',
    backgroundColor: color,
    borderRadius: '50%',
    animation: `${bounce} 1.4s ease-in-out infinite both`
  },
  '&::before': {
    animationDelay: '-0.32s'
  },
  '&::after': {
    animationDelay: '-0.16s'
  }
}));

const BarsLoader = styled(Box)(({ theme, color }) => ({
  display: 'flex',
  gap: '2px',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  '&::before, &::after': {
    content: '""',
    width: '4px',
    height: '60%',
    backgroundColor: color,
    animation: `${bars} 1.2s infinite ease-in-out`
  },
  '&::before': {
    animationDelay: '-0.24s'
  },
  '&::after': {
    animationDelay: '-0.12s'
  }
}));

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

  const getFallbackAnimation = () => {
    switch (type) {
      case 'dots':
        return <DotsLoader color={color} />;
      case 'pulse':
        return <PulseLoader color={color} />;
      case 'bars':
        return <BarsLoader color={color} />;
      default:
        return <SpinnerLoader color={color} />;
    }
  };

  const LoadingContent = (
    <Box
      className={className}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        ...style
      }}
    >
      <Box
        sx={{
          width: loadingSize,
          height: loadingSize,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
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
              console.warn('Lottie animation failed, using CSS fallback');
            }}
            {...props}
          />
        ) : (
          getFallbackAnimation()
        )}
      </Box>
      {showMessage && (
        <Typography
          variant="body2"
          sx={{
            fontSize: 14,
            fontWeight: 500,
            color: 'text.secondary',
            textAlign: 'center'
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );

  if (overlay) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: overlayColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(2px)'
        }}
      >
        {LoadingContent}
      </Box>
    );
  }

  return LoadingContent;
};

export const defaultLoadingAnimations = {
  spinner: spinnerDotsAnimation,
  dots: null,
  pulse: null,
  bars: null,
};

export default LottieLoadingState;
