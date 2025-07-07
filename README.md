# Kilowatt Business Intelligence Application

A React-based business intelligence application for managing accounts, tasks, commissions, and system automation.

## Features

- **Login Page**: Secure authentication with form validation
- **Responsive Design**: Mobile-first approach with styled-components
- **Modern UI**: Clean, professional interface following design system
- **Accessibility**: WCAG compliant with proper focus management

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
│   └── LoginPage.js          # Login page component
├── App.js                    # Main app component
├── App.css                   # Global styles
└── index.js                  # Application entry point
```

## Design System

### Colors
- **Primary Blue**: `#3b82f6`
- **Background**: `#f8fafc`
- **Text Primary**: `#1f2937`
- **Text Secondary**: `#374151`
- **Border**: `#d1d5db`
- **Error**: `#ef4444`

### Typography
- **Font Family**: Inter, system fonts
- **Font Weights**: 400, 500, 600, 700
- **Responsive**: Scales appropriately on mobile devices

### Spacing
- **Container Padding**: 48px (desktop), 32px (mobile)
- **Form Spacing**: 24px between form groups
- **Input Height**: 48px (desktop), 44px (mobile)

## Components

### LoginPage
The main login component featuring:
- Form validation with error handling
- Loading states
- Responsive design
- Accessibility features
- Smooth animations

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App

## Future Enhancements

- Dashboard implementation
- Task queue management
- Account management
- Commission tracking
- System health monitoring
- Email draft management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is proprietary to Kilowatt. 