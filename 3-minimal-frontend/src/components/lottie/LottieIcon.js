import React from 'react';
import styled from 'styled-components';
import LottiePlayer from './LottiePlayer';

const LottieIcon = ({
  animationData,
  size = 24,
  color,
  loop = true,
  autoplay = true,
  speed = 1,
  hover = false,
  onClick,
  className,
  style,
  ...props
}) => {
  const iconSize = typeof size === 'number' ? `${size}px` : size;

  return (
    <IconContainer
      $size={iconSize}
      $color={color}
      $hover={hover}
      onClick={onClick}
      className={className}
      style={style}
      $clickable={!!onClick}
    >
      <LottiePlayer
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        speed={speed}
        width="100%"
        height="100%"
        renderer="svg"
        {...props}
      />
    </IconContainer>
  );
};

// Styled Components
const IconContainer = styled.div`
  width: ${props => props.$size};
  height: ${props => props.$size};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  transition: all 0.2s ease;

  ${props => props.$color && `
    filter: hue-rotate(${props.$color === 'white' ? '0deg' : '180deg'});
  `}

  ${props => props.$hover && `
    &:hover {
      transform: scale(1.1);
      opacity: 0.8;
    }
  `}

  ${props => props.$clickable && `
    &:active {
      transform: scale(0.95);
    }
  `}
`;

export default LottieIcon;
