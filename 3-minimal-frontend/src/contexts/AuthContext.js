import React, { createContext, useContext, useReducer, useEffect } from 'react';
import {
  isAuthenticated,
  getUserData,
  loginUser,
  logoutUser,
  getCurrentUser,
  clearAuthData,
  getAccessToken,
} from '../utils/auth';

// Auth action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  RESTORE_SESSION: 'RESTORE_SESSION',
  UPDATE_USER: 'UPDATE_USER',
};

// Initial auth state
const initialState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
};

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        loading: false,
        error: null,
      };
    
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: action.payload.error,
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      };
    
    case AUTH_ACTIONS.RESTORE_SESSION:
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        user: action.payload.user,
        loading: false,
        error: null,
      };
    
    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: action.payload.user,
      };
    
    default:
      return state;
  }
};

// Create auth context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restore authentication session on app load
  useEffect(() => {
    const restoreSession = async () => {
      console.log('Restoring authentication session...');

      try {
        if (isAuthenticated()) {
          console.log('Found stored tokens, checking validity...');
          const userData = getUserData();

          if (userData) {
            console.log('Found stored user data:', userData);
            // For now, just restore from localStorage without API call
            // TODO: Verify the session is still valid by fetching current user
            dispatch({
              type: AUTH_ACTIONS.RESTORE_SESSION,
              payload: {
                isAuthenticated: true,
                user: userData,
              },
            });
            console.log('Session restored successfully');
          } else {
            console.log('No user data found, clearing auth data');
            clearAuthData();
            dispatch({
              type: AUTH_ACTIONS.RESTORE_SESSION,
              payload: {
                isAuthenticated: false,
                user: null,
              },
            });
          }
        } else {
          console.log('No stored tokens found');
          dispatch({
            type: AUTH_ACTIONS.RESTORE_SESSION,
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (error) {
        console.error('Error restoring session:', error);
        clearAuthData();
        dispatch({
          type: AUTH_ACTIONS.RESTORE_SESSION,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    restoreSession();
  }, []);

  // Login function
  const login = async (username, password) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    
    try {
      const result = await loginUser(username, password);
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: {
          user: result.user,
        },
      });
      
      return result;
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: {
          error: error.message,
        },
      });
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    logoutUser();
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  // Update user data
  const updateUser = (userData) => {
    dispatch({
      type: AUTH_ACTIONS.UPDATE_USER,
      payload: {
        user: userData,
      },
    });
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return state.user?.role === role;
  };

  // Check if user is admin
  const isAdmin = () => {
    return hasRole('admin');
  };

  const value = {
    ...state,
    login,
    logout,
    updateUser,
    hasRole,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;
