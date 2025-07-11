# Lottie Animation Integration Guide

This guide covers how to use Lottie animations in the Kilowatt Business Intelligence Application.

## Overview

The project includes a comprehensive Lottie animation system with:
- Multiple reusable components
- Performance optimization
- Error handling and fallbacks
- Caching and preloading
- TypeScript support

## Quick Start

### Basic Usage

```javascript
import { LottieIcon } from '../components/lottie';
import myAnimation from '../assets/lottie/icons/my-icon.json';

function MyComponent() {
  return (
    <LottieIcon
      animationData={myAnimation}
      size={32}
      loop={true}
      autoplay={true}
    />
  );
}
```

### With Loading States

```javascript
import { LottieWithStates } from '../components/lottie';

function MyComponent() {
  return (
    <LottieWithStates
      src="/path/to/animation.json"
      showLoading={true}
      loadingMessage="Loading animation..."
      showErrorBoundary={true}
      cacheKey="my-animation"
    />
  );
}
```

## Components

### LottiePlayer

The base component for rendering Lottie animations.

**Props:**
- `animationData` (object): Lottie JSON data
- `loop` (boolean): Whether to loop the animation
- `autoplay` (boolean): Whether to start automatically
- `speed` (number): Animation playback speed
- `direction` (number): 1 for forward, -1 for reverse
- `width`, `height` (string): Dimensions
- `onComplete`, `onLoopComplete` (function): Event callbacks

### LottieIcon

Optimized for small icon animations with hover effects.

**Props:**
- All LottiePlayer props
- `size` (number|string): Icon size
- `hover` (boolean): Enable hover effects
- `onClick` (function): Click handler

### LottieBackground

For background animations with overlay support.

**Props:**
- All LottiePlayer props
- `opacity` (number): Background opacity
- `overlay` (boolean): Show overlay
- `overlayColor` (string): Overlay color
- `position` (string): CSS position

### LottieLoader

Loading state component with message support.

**Props:**
- All LottiePlayer props
- `message` (string): Loading message
- `showMessage` (boolean): Show/hide message
- `overlay` (boolean): Full-screen overlay

### LottieWithStates

Complete component with loading, error handling, and caching.

**Props:**
- `src` (string): Animation file URL
- `animationData` (object): Direct animation data
- `showLoading` (boolean): Show loading state
- `showErrorBoundary` (boolean): Enable error boundary
- `cacheKey` (string): Cache identifier
- `preload` (boolean): Preload animation
- `errorFallback` (component): Custom error component

## Hooks

### useLottie

Custom hook for animation management.

```javascript
import { useLottie } from '../utils/useLottie';

function MyComponent() {
  const {
    animationData,
    isLoading,
    error,
    play,
    pause,
    stop
  } = useLottie({
    src: '/path/to/animation.json',
    cacheKey: 'my-animation',
    preload: true
  });

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {animationData && (
        <LottiePlayer animationData={animationData} />
      )}
    </div>
  );
}
```

## Utilities

### Animation Management

```javascript
import {
  preloadAnimation,
  preloadAnimations,
  getCachedAnimation,
  clearAnimationCache
} from '../utils/lottieUtils';

// Preload single animation
const animation = await preloadAnimation('/path/to/animation.json', 'my-key');

// Preload multiple animations
const animations = await preloadAnimations([
  { url: '/animation1.json', key: 'anim1' },
  { url: '/animation2.json', key: 'anim2' }
]);

// Get cached animation
const cached = getCachedAnimation('my-key');

// Clear cache
clearAnimationCache(); // Clear all
clearAnimationCache('my-key'); // Clear specific
```

### Performance Monitoring

```javascript
import { performanceMonitor } from '../utils/lottieUtils';

// Get performance metrics
const metrics = performanceMonitor.getMetrics();
console.log('Active animations:', metrics.activeAnimations);
console.log('Average frame rate:', metrics.averageFrameRate);
```

## Best Practices

### File Organization

```
src/assets/lottie/
├── icons/           # Small icons (24-48px)
│   ├── search-pulse.json
│   ├── task-bounce.json
│   └── email-pulse.json
├── loading/         # Loading animations
│   ├── spinner-dots.json
│   └── button-spinner.json
├── ui/             # UI interactions
│   ├── login-welcome.json
│   └── button-hover.json
└── backgrounds/    # Background animations
    └── particles-float.json
```

### Performance Tips

1. **Keep file sizes small**: < 100KB for icons, < 500KB for backgrounds
2. **Use appropriate loop settings**: Avoid unnecessary loops
3. **Preload critical animations**: Use `preload={true}` for important animations
4. **Cache animations**: Use `cacheKey` for reused animations
5. **Optimize for mobile**: Reduce complexity for mobile devices

### Error Handling

Always provide fallbacks for animations:

```javascript
<LottieWithStates
  animationData={myAnimation}
  errorFallback={<div>🎨 Animation unavailable</div>}
  showErrorBoundary={true}
/>
```

### Accessibility

- Provide `alt` text or descriptions for meaningful animations
- Respect `prefers-reduced-motion` settings
- Ensure animations don't interfere with screen readers

## Troubleshooting

### Common Issues

1. **Animation not loading**: Check file path and JSON validity
2. **Performance issues**: Reduce animation complexity or file size
3. **Memory leaks**: Ensure proper cleanup with error boundaries
4. **Mobile performance**: Use lower frame rates and simpler animations

### Debug Mode

Enable debug logging:

```javascript
// In development
if (process.env.NODE_ENV === 'development') {
  console.log('Lottie cache stats:', getCacheStats());
}
```

## Examples

See the following components for implementation examples:
- `src/components/LoginPage/index.js` - Welcome animation
- `src/components/HomePage/index.js` - Icon animations
- `src/components/lottie/` - All Lottie components

## Resources

- [Lottie Files](https://lottiefiles.com/) - Free animations
- [After Effects](https://www.adobe.com/products/aftereffects.html) - Create custom animations
- [Bodymovin](https://github.com/airbnb/lottie-web) - Export plugin for After Effects
