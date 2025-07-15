# Kilowatt Business Intelligence Frontend

A React-based business intelligence application for managing accounts, tasks, commissions, and system automation. Built with Material-UI (MUI) for a modern, professional interface.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## 🎯 Features

- **Modern UI**: Material-UI components with professional styling and Lottie animations
- **Responsive Design**: Mobile-first approach with MUI's responsive system
- **Persistent Authentication**: Secure login with automatic session restoration
- **Dashboard Management**: Multiple specialized dashboards for different business functions
- **Real-time Data**: Live updates and synchronization
- **Performance Optimized**: Efficient loading with caching and error handling

## 📁 Project Structure

```
src/
├── components/
│   ├── LoginPage/              # Authentication interface
│   ├── HomePage/               # Main dashboard
│   ├── AccountDashboard/       # Account management
│   ├── ManagerDashboard/       # Manager profiles
│   ├── TaskQueue/              # Task management
│   ├── CommissionDashboard/    # Commission tracking
│   ├── EmailDraftDashboard/    # Email management
│   ├── ProviderDashboard/      # Provider management
│   ├── SystemHealthDashboard/  # System monitoring
│   └── lottie/                 # Animation components
├── contexts/
│   └── AuthContext.js          # Authentication state management
├── utils/
│   └── auth.js                 # Authentication utilities
├── assets/
│   ├── lottie/                 # Animation files
│   └── colors.js               # Design system colors
├── theme.js                    # MUI theme configuration
└── App.js                      # Main application component
```

## 🎨 Design System

### MUI Theme Configuration
- **Primary**: Deep Red (`#C82828`) - Main brand color
- **Secondary**: Orange (`#E68228`) - Accent color
- **Typography**: Inter font family with consistent hierarchy
- **Responsive**: Mobile-first breakpoints

### Component Status
- ✅ **MUI Converted**: LoginPage, HomePage, SystemHealthDashboard, CommissionDashboard, EmailDraftDashboard
- 🔄 **Legacy (Styled-Components)**: AccountDashboard, ManagerDashboard, TaskQueue, ProviderDashboard

## 🔐 Authentication

### Features
- **Persistent Login**: Users remain logged in after page refresh
- **Automatic Token Refresh**: Seamless token renewal
- **Secure Storage**: JWT tokens in localStorage
- **Mock Authentication**: For development and testing

### Usage
```javascript
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { isAuthenticated, user, login, logout } = useAuth();
  // Component logic
}
```

### Mock Credentials
- **Username**: admin
- **Password**: password

## 🎬 Lottie Animations

### Components
- **LottiePlayer**: Full-featured animation player
- **LottieIcon**: Optimized for small icons
- **LottieWithStates**: Complete with loading/error handling

### Usage
```javascript
import { LottieIcon } from './components/lottie';
import animationData from './assets/lottie/icons/my-icon.json';

<LottieIcon
  animationData={animationData}
  size={32}
  hover={true}
/>
```

## 📊 Dashboard Components

### HomePage
- System overview with key metrics
- Navigation to all dashboard sections
- Recent activity feed
- **Persistent Navigation**: Maintains current page on refresh

### Account Management
- Account CRUD operations
- Usage tracking and analytics
- Contract management
- Pricing generation

### Manager Dashboard
- Manager profiles and contact information
- Account assignments and performance metrics
- Searchable manager directory

### Task Queue
- Task creation and assignment
- Priority and status tracking
- Progress monitoring

### Commission Tracking
- Commission calculations and payments
- Financial reporting and analytics
- Payment processing

### Email Management
- Email draft creation and editing
- Bulk email operations
- Template management

### Provider Management
- Energy provider information
- Pricing and contract management
- Performance analytics

### System Health
- Real-time system monitoring
- Performance metrics and alerts
- Automation status tracking

## 🛠️ Development

### Environment Variables
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_USE_MOCK_AUTH=true
```

### Available Scripts
- `npm start` - Development server
- `npm build` - Production build
- `npm test` - Run tests
- `npm run lint` - Code linting
- `npm run format` - Code formatting

### Code Quality
```bash
# Linting
npm run lint

# Formatting
npm run format

# Type checking (if TypeScript)
npm run type-check
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Heroku Deployment
The app is ready for Heroku deployment. Add deployment configuration files as needed:
- `Procfile` - Deployment commands (to be created)
- `static.json` - Static file serving (to be created)

### Docker Deployment
```bash
docker build -t kilowatt-frontend .
docker run -p 3000:3000 kilowatt-frontend
```

## 🔧 Configuration

### API Integration
Configure the backend API URL in environment variables or `src/utils/auth.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
```

### Theme Customization
Modify `src/theme.js` to customize the MUI theme:

```javascript
const theme = createTheme({
  palette: {
    primary: { main: '#C82828' },
    secondary: { main: '#E68228' }
  }
});
```

## 📱 Responsive Design

- **Mobile-first**: Optimized for mobile devices
- **Breakpoints**: xs, sm, md, lg, xl
- **Flexible Layouts**: Grid system and flexible components
- **Touch-friendly**: Appropriate touch targets and interactions

## 🧪 Testing

### Test Structure
```bash
src/
├── __tests__/
│   ├── components/
│   ├── utils/
│   └── contexts/
```

### Running Tests
```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test LoginPage.test.js
```

## 🤝 Contributing

1. Follow the existing code style and patterns
2. Use MUI components for new features
3. Add tests for new functionality
4. Update documentation as needed
5. Ensure responsive design principles

## 📚 Resources

- [Material-UI Documentation](https://mui.com/)
- [React Documentation](https://reactjs.org/)
- [Lottie React Documentation](https://github.com/chenqingspring/react-lottie)
- [Authentication Implementation](./src/contexts/AuthContext.js)
This project is proprietary to Kilowatt. 
