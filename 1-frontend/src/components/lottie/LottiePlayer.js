import React, { useRef, useEffect, useState, forwardRef } from 'react';
import Lottie from 'lottie-react';
import { Box, Typography } from '@mui/material';

const LottiePlayer = forwardRef(({
  animationData,
  loop = true,
  autoplay = true,
  speed = 1,
  direction = 1,
  width = '100%',
  height = '100%',
  renderer = 'svg',
  preserveAspectRatio = 'xMidYMid meet',
  onLoad,
  onError,
  onComplete,
  onLoopComplete,
  className,
  style,
  ...props
}, ref) => {
  const containerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!animationData) {
      setHasError(true);
      if (onError) onError(new Error('No animation data provided'));
    }
  }, [animationData, onError]);

  if (hasError) {
    return (
      <Box
        sx={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'grey.100',
          borderRadius: 1,
          ...style
        }}
        className={className}
      >
        <Typography variant="body2" color="error">
          Failed to load animation
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      ref={ref || containerRef}
      sx={{
        width,
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.3s ease',
        ...style
      }}
      className={className}
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
    </Box>
  );
});

LottiePlayer.displayName = 'LottiePlayer';

export default LottiePlayer;
