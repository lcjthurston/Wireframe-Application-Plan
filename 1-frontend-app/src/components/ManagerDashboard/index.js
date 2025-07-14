import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip,
  Button,
  IconButton,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { 
  Edit, 
  Delete, 
  Add,
  ArrowUpward,
  ArrowDownward
} from '@mui/icons-material';

// Replace SCSS with MUI styling
const ManagerDashboard = ({ onNavigate }) => {
  // Component logic remains the same
  
  // Define status chip styles
  const getChipProps = (status) => {
    switch(status) {
      case 'Active':
        return { 
          color: 'success', 
          sx: { fontWeight: 500, borderRadius: '16px' } 
        };
      case 'Needs Pricing':
        return { 
          color: 'warning', 
          sx: { fontWeight: 500, borderRadius: '16px' } 
        };
      case 'Pending':
        return { 
          color: 'error', 
          sx: { fontWeight: 500, borderRadius: '16px' } 
        };
      default:
        return { 
          color: 'default', 
          sx: { fontWeight: 500, borderRadius: '16px' } 
        };
    }
  };
  
  return (
    <Box sx={{ p: 3, maxWidth: '1200px', margin: '0 auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Manager Dashboard
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => {/* handle add */}}
        >
          Add Manager
        </Button>
      </Box>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Managers
              </Typography>
              <Typography variant="h4">24</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <ArrowUpward sx={{ color: 'success.main', mr: 1 }} />
                <Typography variant="body2" color="success.main">
                  2 new this month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Additional stats cards... */}
      </Grid>
      
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Accounts</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Sample row */}
              <TableRow hover>
                <TableCell>John Smith</TableCell>
                <TableCell>john.smith@example.com</TableCell>
                <TableCell>12</TableCell>
                <TableCell>
                  <Chip 
                    label="Active" 
                    {...getChipProps('Active')}
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small">
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton size="small">
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
              {/* Additional rows... */}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default ManagerDashboard; 
