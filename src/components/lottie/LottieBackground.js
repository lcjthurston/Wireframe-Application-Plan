import React from 'react';
import styled from 'styled-components';
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
    <BackgroundContainer
      $position={position}
      $zIndex={zIndex}
      $opacity={opacity}
      className={className}
      style={style}
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
      {overlay && <Overlay $color={overlayColor} />}
      {children && <ContentLayer>{children}</ContentLayer>}
    </BackgroundContainer>
  );
};

// Styled Components
const BackgroundContainer = styled.div`
  position: ${props => props.$position};
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: ${props => props.$zIndex};
  opacity: ${props => props.$opacity};
  overflow: hidden;
  pointer-events: none;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${props => props.$color};
  pointer-events: none;
`;

const ContentLayer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: auto;
  z-index: 1;
`;

export default LottieBackground;
