# Kilowatt Business Intelligence Application

A React-based business intelligence application for managing accounts, tasks, commissions, and system automation. Built with Material-UI (MUI) for a modern, professional interface.

## Features

- **Modern UI**: Material-UI components with professional styling and Lottie animations
- **Responsive Design**: Mobile-first approach with MUI's responsive system
- **Dashboard Components**: Multiple specialized dashboards for different business functions
- **Authentication**: Secure login system with form validation and animated feedback
- **Data Management**: Comprehensive data entry and management capabilities
- **System Monitoring**: Real-time system health and automation monitoring
- **Lottie Animations**: Integrated Lottie animations for enhanced user experience
- **Performance Optimized**: Efficient animation loading with caching and error handling

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd kilowatt-wireframe-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
src/
├── components/
│   ├── LoginPage.js              # MUI-styled login component
│   ├── HomePage.js               # MUI-styled main dashboard
│   ├── SystemHealthDashboard.js  # MUI-styled system monitoring
│   ├── CommissionDashboard.js    # MUI-styled commission tracking
│   ├── EmailDraftDashboard.js    # MUI-styled email management
│   ├── AccountDashboard.js       # Account management (styled-components)
│   ├── ManagerDashboard.js       # Manager management (styled-components)
│   ├── TaskQueue.js              # Task queue management (styled-components)
│   ├── ProviderDashboard.js      # Provider management (styled-components)
│   └── DataEntryModal.js         # Data entry modal (styled-components)
├── assets/
│   ├── colors.js                 # Color definitions
│   └── image.png                 # Application logo
├── theme.js                      # MUI theme configuration
├── App.js                        # Main app component with MUI ThemeProvider
├── App.css                       # Global styles
└── index.js                      # Application entry point
```

## Technology Stack

### Frontend
- **React 18**: Modern React with hooks
- **Material-UI (MUI)**: Professional UI component library
- **Styled-Components**: CSS-in-JS styling (legacy components)
- **React Router**: Navigation (planned)

### Styling
- **MUI Theme**: Custom theme with professional color palette
- **Responsive Design**: Mobile-first approach
- **Typography**: Inter font family with consistent hierarchy
- **Animations**: Smooth transitions and hover effects

## Design System

### MUI Theme Configuration
- **Primary**: Deep Red (`#C82828`) - Main brand color
- **Secondary**: Orange (`#E68228`) - Accent color
- **Success**: Green (`#4caf50`) - Positive states
- **Warning**: Golden Orange (`#F0A028`) - Warning states
- **Error**: Deep Red (`#C82828`) - Error states
- **Info**: Orange-Brown (`#E66E28`) - Information states

### Typography
- **Font Family**: Inter, Roboto, system fonts
- **Font Weights**: 400, 500, 600, 700
- **Responsive**: Scales appropriately on all devices

### Components
- **Cards**: Elevated with hover effects
- **Buttons**: Consistent styling with proper states
- **Forms**: Professional input fields with validation
- **Tables**: Sortable data tables with actions
- **Navigation**: Modern AppBar with responsive design

## Lottie Animations

This project integrates Lottie animations for enhanced user experience and modern interactions.

### Animation Components

#### LottiePlayer
Base component for rendering Lottie animations with full control:
```javascript
import { LottiePlayer } from './components/lottie';
import animationData from './assets/lottie/my-animation.json';

<LottiePlayer
  animationData={animationData}
  loop={true}
  autoplay={true}
  speed={1}
  width="200px"
  height="200px"
/>
```

#### LottieIcon
Optimized for small icon animations:
```javascript
import { LottieIcon } from './components/lottie';

<LottieIcon
  animationData={iconAnimation}
  size={24}
  hover={true}
  onClick={handleClick}
/>
```

#### LottieWithStates
Complete component with loading and error handling:
```javascript
import { LottieWithStates } from './components/lottie';

<LottieWithStates
  src="/path/to/animation.json"
  showLoading={true}
  showErrorBoundary={true}
  cacheKey="my-animation"
  preload={true}
/>
```

### Animation Assets

Animations are organized in `src/assets/lottie/`:
- **`icons/`** - Small icon animations (24-48px)
- **`loading/`** - Loading spinners and progress indicators
- **`ui/`** - UI interaction animations
- **`backgrounds/`** - Background and decorative animations

### Performance Features

- **Caching**: Automatic animation caching for improved performance
- **Preloading**: Optional preloading for critical animations
- **Error Handling**: Graceful fallbacks when animations fail to load
- **Lazy Loading**: Animations load only when needed
- **Memory Management**: Automatic cleanup to prevent memory leaks

### Usage Examples

Current integrations include:
- **Login Page**: Welcome animation and loading spinner
- **Dashboard**: Animated stat card icons
- **Navigation**: Interactive button states
- **Loading States**: Custom loading animations throughout the app

## Dashboard Components

### ✅ MUI-Converted Components

#### LoginPage
- Modern authentication form
- Gradient background
- Form validation with error states
- Loading spinner
- Professional styling

#### HomePage
- Dashboard overview with widgets
- System health summary
- Recent activity feed
- Task statistics
- **Consistent Top Navigation Bar**: All dashboard buttons in header for easy access
  - Manager Dashboard
  - Email Drafts
  - Commission
  - Providers
  - System Health
  - Task Queue
  - Accounts
- Responsive navigation with mobile-friendly design
- Clickable Kilowatt logo for home navigation

#### SystemHealthDashboard
- Automation system monitoring
- Performance metrics
- System logs table
- Status indicators
- Tabbed interface

#### CommissionDashboard
- Commission tracking
- Payment history
- Financial reports
- Sortable data tables
- Status chips

#### EmailDraftDashboard
- Email queue management
- Draft previews
- Bulk actions
- Filter and sort options
- Modal dialogs

### 🔄 Legacy Components (Styled-Components)

#### AccountDashboard
- Account management
- Account details
- Usage tracking
- Contract management

#### ManagerDashboard
- Manager profiles
- Account assignments
- Performance metrics
- Contact information

#### TaskQueue
- Task management
- Priority sorting
- Status tracking
- Assignment handling

#### ProviderDashboard
- Energy provider management
- Pricing sheets
- Contract management
- Provider analytics

#### DataEntryModal
- Multi-step forms
- Data validation
- Account creation
- Commission entry

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App

## Development Status

### ✅ Completed
- MUI theme integration
- Login page with MUI
- Home dashboard with MUI
- System health dashboard with MUI
- Commission dashboard with MUI
- Email draft dashboard with MUI

### 🔄 In Progress
- Converting remaining components to MUI
- Enhancing responsive design
- Adding more interactive features

### 📋 Planned
- Complete MUI conversion for all components
- Advanced data visualization
- Real-time updates
- Enhanced accessibility
- Performance optimizations

## Key Features

### Authentication
- Secure login system
- Form validation
- Error handling
- Loading states

### Dashboard Management
- Multiple specialized dashboards
- Real-time data display
- Interactive charts and tables
- Status monitoring

### Data Management
- Comprehensive data entry
- Bulk operations
- Search and filtering
- Export capabilities

### System Monitoring
- Automation health tracking
- Performance metrics
- Error logging
- Status alerts

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is proprietary to Kilowatt. 