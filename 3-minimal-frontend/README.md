# Kilowatt Minimal Frontend

This is a streamlined version of the Kilowatt Business Intelligence frontend application, containing only the essential files needed to run the application with full functionality and styling.

## 🎯 What's Included

### Essential Core Files
- **`package.json`** - Dependencies and build scripts
- **`craco.config.js`** - Build configuration
- **`public/index.html`** - Main HTML template

### Source Code (`src/`)
- **`App.js`** - Main application component and routing
- **`index.js`** - React app entry point
- **`theme.js`** - Material-UI theme configuration
- **`App.css`** - Global styles

### Authentication & State Management
- **`contexts/AuthContext.js`** - Authentication state management
- **`utils/auth.js`** - Authentication utilities and API calls
- **`utils/lottieUtils.js`** - Animation utilities
- **`utils/useLottie.js`** - Lottie animation hooks

### Styling & Assets
- **`assets/colors.js`** - Color theme definitions
- **`assets/lottie/`** - Animation files for UI enhancements
- **`assets/*.png`** - Image assets

### All UI Components
- **`components/LoginPage/`** - User authentication
- **`components/HomePage/`** - Main dashboard
- **`components/AccountsList/`** - Account management list
- **`components/AccountDetail/`** - Individual account details
- **`components/AccountDashboard/`** - Account overview dashboard
- **`components/ManagerDashboard/`** - Manager management
- **`components/ManagerDetail/`** - Individual manager details
- **`components/TaskQueue/`** - Task management
- **`components/CommissionDashboard/`** - Commission tracking
- **`components/EmailDraftDashboard/`** - Email management
- **`components/ProviderDashboard/`** - Provider management
- **`components/SystemHealthDashboard/`** - System monitoring
- **`components/DataEntryModal/`** - Data entry popup
- **`components/lottie/`** - Animation components
- **`components/shared/`** - Shared UI components

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## 📊 What Was Removed

The following files were excluded as they are not essential for core functionality:

### Documentation & Development Files
- Screenshots and wireframe documentation
- Development notes and planning documents
- Test files (can be added back if needed)

### Optional Files
- `.gitignore` (can be recreated)
- Lock files (will be regenerated on npm install)
- IDE configuration files

## 🎨 Features Preserved

- ✅ **Full Authentication Flow** - Login/logout with persistent sessions
- ✅ **Complete UI** - All dashboards and components
- ✅ **Material-UI Styling** - Professional red-themed design
- ✅ **Lottie Animations** - Enhanced user experience
- ✅ **Responsive Design** - Mobile-friendly interface
- ✅ **API Integration** - Ready for backend connection

## 🔧 Configuration

The app is configured to work with:
- **Backend API**: `http://localhost:8000` (configurable via environment variables)
- **Mock Authentication**: Enabled for development (username: `admin`, password: `password`)

## 📁 Directory Size Comparison

- **Original**: ~50+ files across multiple directories
- **Minimal**: ~40 essential files with same functionality

This minimal version maintains 100% of the original functionality while removing unnecessary development and documentation files.
