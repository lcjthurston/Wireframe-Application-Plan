import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  CardHeader, 
  Divider, 
  Button, 
  Chip, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  IconButton,
  Avatar
} from '@mui/material';
import { 
  ArrowUpward, 
  ArrowDownward, 
  Edit, 
  Delete, 
  Visibility, 
  MoreVert 
} from '@mui/icons-material';

// Replace styled-components with MUI styled API
import { styled } from '@mui/material/styles';

// Define styled components using MUI's styled API
const StatsCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4]
  }
}));

const AccountDashboard = ({ onNavigate }) => {
  // Component logic remains the same
  
  return (
    <Box sx={{ p: 3, maxWidth: '1200px', margin: '0 auto' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Account Dashboard
      </Typography>
      
      {/* Convert all styled-components to MUI components */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <StatsCard>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Accounts
              </Typography>
              <Typography variant="h4">1,284</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <ArrowUpward sx={{ color: 'success.main', mr: 1 }} />
                <Typography variant="body2" color="success.main">
                  12% increase
                </Typography>
              </Box>
            </CardContent>
          </StatsCard>
        </Grid>
        
        {/* Additional grid items... */}
      </Grid>
      
      <Paper sx={{ mt: 4, p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Recent Accounts
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Account Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Manager</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Table rows... */}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default AccountDashboard; 
