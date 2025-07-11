# Lottie Assets Directory

This directory contains all Lottie animation files organized by category.

## Directory Structure

- **`icons/`** - Small icon animations (buttons, status indicators, etc.)
- **`backgrounds/`** - Background animations and decorative elements
- **`loading/`** - Loading spinners and progress indicators
- **`ui/`** - UI-specific animations (transitions, interactions, etc.)

## File Naming Convention

Use descriptive names with the following pattern:
- `{category}-{description}-{variant}.json`
- Examples:
  - `icon-search-pulse.json`
  - `loading-spinner-dots.json`
  - `background-particles-floating.json`
  - `ui-button-hover.json`

## Usage

Import Lottie files in your components:

```javascript
import searchIcon from '../assets/lottie/icons/search-pulse.json';
import loadingSpinner from '../assets/lottie/loading/spinner-dots.json';
```

## File Formats

- **`.json`** - Standard Lottie JSON format (recommended)
- **`.lottie`** - Compressed Lottie format (for larger animations)

## Performance Tips

1. Keep file sizes small (< 100KB for icons, < 500KB for backgrounds)
2. Optimize animations for web (reduce complexity, limit layers)
3. Use appropriate loop settings
4. Consider preloading critical animations
