import React from 'react';
import { Box, Typography } from '@mui/material';
import LottiePlayer from './LottiePlayer';

const LottieLoader = ({
  animationData,
  size = 48,
  message = 'Loading...',
  showMessage = true,
  speed = 1,
  overlay = false,
  overlayColor = 'rgba(255, 255, 255, 0.9)',
  className,
  style,
  ...props
}) => {
  const loaderSize = typeof size === 'number' ? `${size}px` : size;

  const LoaderContent = (
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
          width: loaderSize,
          height: loaderSize,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <LottiePlayer
          animationData={animationData}
          loop={true}
          autoplay={true}
          speed={speed}
          width="100%"
          height="100%"
          renderer="svg"
          {...props}
        />
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
        {LoaderContent}
      </Box>
    );
  }

  return LoaderContent;
};

export default LottieLoader;
