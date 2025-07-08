import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const TestComponent = () => {
  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
        MUI Test Component
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        If you can see this, MUI is working correctly!
      </Typography>
      <Button variant="contained" color="primary">
        Test Button
      </Button>
    </Box>
  );
};

export default TestComponent; 