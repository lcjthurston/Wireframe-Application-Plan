import React from 'react';
import styled from 'styled-components';
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
    <LoaderContainer className={className} style={style}>
      <AnimationContainer size={loaderSize}>
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
      </AnimationContainer>
      {showMessage && <LoaderMessage>{message}</LoaderMessage>}
    </LoaderContainer>
  );

  if (overlay) {
    return (
      <OverlayContainer color={overlayColor}>
        {LoaderContent}
      </OverlayContainer>
    );
  }

  return LoaderContent;
};

// Styled Components
const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

const AnimationContainer = styled.div`
  width: ${props => props.size};
  height: ${props => props.size};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoaderMessage = styled.div`
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
  background: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(2px);
`;

export default LottieLoader;
