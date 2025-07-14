import React from 'react';
import { Box } from '@mui/material';
import LottiePlayer from './LottiePlayer';

const LottieBackground = ({
  animationData,
  opacity = 0.3,
  speed = 0.5,
  loop = true,
  autoplay = true,
  position = 'absolute',
  zIndex = -1,
  overlay = false,
  overlayColor = 'rgba(0, 0, 0, 0.1)',
  className,
  style,
  children,
  ...props
}) => {
  return (
    <Box
      sx={{
        position,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex,
        opacity,
        ...style
      }}
      className={className}
    >
      <LottiePlayer
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        speed={speed}
        width="100%"
        height="100%"
        renderer="canvas"
        preserveAspectRatio="xMidYMid slice"
        {...props}
      />
      {overlay && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: overlayColor,
            pointerEvents: 'none'
          }}
        />
      )}
      {children && (
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            height: '100%'
          }}
        >
          {children}
        </Box>
      )}
    </Box>
  );
};

export default LottieBackground;
