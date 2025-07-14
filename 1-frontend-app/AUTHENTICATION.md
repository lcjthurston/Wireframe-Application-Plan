# Authentication System

This document describes the persistent authentication system implemented for the Kilowatt application.

## Overview

The authentication system provides:
- **Persistent login state** - Users remain logged in after page refresh
- **Automatic token refresh** - Seamless token renewal without user intervention
- **Secure token storage** - JWT tokens stored in localStorage
- **Mock authentication** - For development and testing purposes

## Components

### 1. Authentication Context (`src/contexts/AuthContext.js`)
- Manages global authentication state
- Provides login/logout functions
- Handles session restoration on app load
- Includes loading states and error handling

### 2. Authentication Utilities (`src/utils/auth.js`)
- Token storage and retrieval functions
- API communication for login/refresh
- Mock authentication for testing
- Automatic token refresh logic

### 3. Updated App Component (`src/App.js`)
- Wrapped with AuthProvider
- Shows loading screen during auth check
- Conditionally renders login or main app

### 4. Updated Login Page (`src/components/LoginPage/index.js`)
- Integrated with authentication context
- Real API calls for login
- Error handling and user feedback

## How It Works

### Initial Load
1. App starts and shows loading screen
2. AuthContext checks for stored tokens
3. If tokens exist, validates them and restores user session
4. If no tokens or invalid, shows login page

### Login Process
1. User enters credentials
2. System calls login API (or mock)
3. Tokens and user data stored in localStorage
4. Auth state updated, main app rendered

### Page Refresh
1. App reloads and checks localStorage
2. Finds existing tokens and user data
3. Restores authentication state
4. User remains logged in

### Logout
1. Clears all stored authentication data
2. Updates auth state
3. Redirects to login page

## Testing

### Mock Authentication
Currently enabled for testing. Use these credentials:
- **Username:** admin
- **Password:** password

### Real Backend
To use the real backend:
1. Start the FastAPI backend server
2. Set `USE_MOCK_AUTH = false` in `src/utils/auth.js`
3. Ensure backend has the refresh token endpoint

## Configuration

### Environment Variables
- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:8000)
- `REACT_APP_USE_MOCK_AUTH` - Enable mock authentication (default: true)

### Token Storage
Tokens are stored in localStorage with these keys:
- `kilowatt_access_token` - JWT access token
- `kilowatt_refresh_token` - JWT refresh token  
- `kilowatt_user_data` - User profile information

## Security Considerations

1. **Token Expiration** - Access tokens expire in 30 minutes
2. **Refresh Tokens** - Refresh tokens expire in 7 days
3. **Automatic Cleanup** - Invalid tokens are automatically cleared
4. **HTTPS Required** - Use HTTPS in production for token security

## Debugging

The app includes an AuthDebug component that shows:
- Current authentication state
- Stored token information
- User data
- Clear storage functionality

## Backend Requirements

The backend must provide these endpoints:
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Token refresh
- `GET /api/v1/auth/me` - Get current user

## Future Enhancements

1. **Remember Me** - Optional persistent login
2. **Multiple Sessions** - Handle multiple browser tabs
3. **Session Timeout** - Automatic logout after inactivity
4. **Biometric Auth** - Fingerprint/face recognition
5. **2FA Support** - Two-factor authentication
