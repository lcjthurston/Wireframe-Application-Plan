import React from 'react';
import { Box, Typography, Paper, Button, Divider } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { getAccessToken, getRefreshToken, getUserData, clearAuthData } from '../utils/auth';

const AuthDebug = () => {
  const { isAuthenticated, user, loading, error } = useAuth();

  const handleClearStorage = () => {
    clearAuthData();
    window.location.reload();
  };

  return (
    <Paper sx={{ p: 2, m: 2, backgroundColor: '#f5f5f5' }}>
      <Typography variant="h6" gutterBottom>
        Authentication Debug Info
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2">
          <strong>Loading:</strong> {loading ? 'Yes' : 'No'}
        </Typography>
        <Typography variant="body2">
          <strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}
        </Typography>
        <Typography variant="body2">
          <strong>Error:</strong> {error || 'None'}
        </Typography>
      </Box>

      <Divider sx={{ my: 1 }} />

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2">
          <strong>User Data:</strong>
        </Typography>
        <pre style={{ fontSize: '12px', overflow: 'auto' }}>
          {user ? JSON.stringify(user, null, 2) : 'None'}
        </pre>
      </Box>

      <Divider sx={{ my: 1 }} />

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2">
          <strong>Stored Tokens:</strong>
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '12px' }}>
          Access Token: {getAccessToken() ? 'Present' : 'None'}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '12px' }}>
          Refresh Token: {getRefreshToken() ? 'Present' : 'None'}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '12px' }}>
          Stored User: {getUserData() ? 'Present' : 'None'}
        </Typography>
      </Box>

      <Button 
        variant="outlined" 
        color="secondary" 
        size="small" 
        onClick={handleClearStorage}
      >
        Clear Auth Data & Reload
      </Button>
    </Paper>
  );
};

export default AuthDebug;
