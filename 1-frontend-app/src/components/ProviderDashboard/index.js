import React, { useState } from 'react';
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
  CardContent,
  TextField,
  MenuItem,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
  Visibility,
  Business,
  TrendingUp,
  ElectricBolt,
  AttachMoney,
  Phone,
  Email,
  LocationOn,
  Star
} from '@mui/icons-material';

const ProviderDashboard = ({ onNavigate }) => {
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  // Mock provider data
  const mockProviders = [
    {
      id: 1,
      name: 'Green Energy Solutions',
      type: 'Renewable',
      status: 'Active',
      rating: 4.8,
      customersCount: 1250,
      totalCapacity: 500000,
      avgRate: 0.085,
      contactPerson: 'John Smith',
      phone: '(555) 123-4567',
      email: 'john@greenenergy.com',
      address: '123 Solar Ave, Austin, TX',
      contractStart: '2023-01-01',
      contractEnd: '2025-12-31',
      performance: 95
    },
    {
      id: 2,
      name: 'PowerCorp Utilities',
      type: 'Traditional',
      status: 'Active',
      rating: 4.2,
      customersCount: 2100,
      totalCapacity: 750000,
      avgRate: 0.092,
      contactPerson: 'Sarah Johnson',
      phone: '(555) 987-6543',
      email: 'sarah@powercorp.com',
      address: '456 Power St, Dallas, TX',
      contractStart: '2022-06-01',
      contractEnd: '2024-06-01',
      performance: 88
    },
    {
      id: 3,
      name: 'Solar Dynamics',
      type: 'Solar',
      status: 'Active',
      rating: 4.6,
      customersCount: 850,
      totalCapacity: 300000,
      avgRate: 0.078,
      contactPerson: 'Mike Wilson',
      phone: '(555) 456-7890',
      email: 'mike@solardynamics.com',
      address: '789 Sun Blvd, Houston, TX',
      contractStart: '2023-03-15',
      contractEnd: '2026-03-15',
      performance: 92
    },
    {
      id: 4,
      name: 'Wind Power Inc',
      type: 'Wind',
      status: 'Pending',
      rating: 4.0,
      customersCount: 0,
      totalCapacity: 200000,
      avgRate: 0.088,
      contactPerson: 'Lisa Brown',
      phone: '(555) 321-6543',
      email: 'lisa@windpower.com',
      address: '321 Windy Way, Denver, CO',
      contractStart: '2023-06-01',
      contractEnd: '2025-06-01',
      performance: 85
    }
  ];

  React.useEffect(() => {
    setProviders(mockProviders);
  }, []);

  const getStatusChip = (status) => {
    const statusConfig = {
      'Active': { color: 'success', label: 'Active' },
      'Pending': { color: 'warning', label: 'Pending' },
      'Inactive': { color: 'error', label: 'Inactive' },
      'Suspended': { color: 'default', label: 'Suspended' }
    };

    const config = statusConfig[status] || statusConfig['Pending'];
    
    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        sx={{ fontWeight: 500 }}
      />
    );
  };

  const getTypeChip = (type) => {
    const typeConfig = {
      'Renewable': { color: 'success', label: 'Renewable' },
      'Solar': { color: 'warning', label: 'Solar' },
      'Traditional': { color: 'primary', label: 'Traditional' },
      'Wind': { color: 'info', label: 'Wind' }
    };

    const config = typeConfig[type] || typeConfig['Traditional'];
    
    return (
      <Chip
        label={config.label}
        color={config.color}
        variant="outlined"
        size="small"
      />
    );
  };

  const handleViewProvider = (provider) => {
    setSelectedProvider(provider);
    setDialogOpen(true);
  };

  const providerStats = {
    total: providers.length,
    active: providers.filter(p => p.status === 'Active').length,
    totalCapacity: providers.reduce((sum, p) => sum + p.totalCapacity, 0),
    totalRevenue: providers.reduce((sum, p) => sum + p.totalCapacity * p.avgRate, 0),
    avgRate: providers.reduce((sum, p) => sum + p.avgRate, 0) / providers.length || 0
  };

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Energy Provider Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {/* handle add provider */}}
        >
          Add Provider
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <Business sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {providerStats.total}
              </Typography>
              <Typography color="textSecondary">Total Providers</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <TrendingUp sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'success.main' }}>
                {providerStats.active}
              </Typography>
              <Typography color="textSecondary">Active Providers</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <ElectricBolt sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {providerStats.totalCapacity.toLocaleString()}
              </Typography>
              <Typography color="textSecondary">Total Capacity (kW)</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <AttachMoney sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                ${providerStats.totalRevenue.toLocaleString()}
              </Typography>
              <Typography color="textSecondary">Total Revenue</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Providers Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Provider</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Capacity (kW)</TableCell>
                <TableCell>Avg Rate</TableCell>
                <TableCell>Revenue</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {providers.map((provider) => (
                <TableRow key={provider.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {provider.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {provider.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {provider.contactPerson}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {getTypeChip(provider.type)}
                  </TableCell>
                  <TableCell>
                    {getStatusChip(provider.status)}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {provider.totalCapacity.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      ${provider.avgRate.toFixed(3)}/kWh
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      ${provider.totalCapacity * provider.avgRate.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="body2">⭐</Typography>
                      <Typography variant="body2">{provider.rating}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton size="small" onClick={() => handleViewProvider(provider)}>
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton size="small">
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small">
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Provider Details Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Provider Details: {selectedProvider?.name}
        </DialogTitle>
        <DialogContent>
          {selectedProvider && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Contact Information</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Phone fontSize="small" />
                      <Typography>{selectedProvider.phone}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Email fontSize="small" />
                      <Typography>{selectedProvider.email}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationOn fontSize="small" />
                      <Typography>{selectedProvider.address}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Performance Metrics</Typography>
                    <Typography>Capacity: {selectedProvider.totalCapacity.toLocaleString()} kW</Typography>
                    <Typography>Average Rate: ${selectedProvider.avgRate.toFixed(3)}/kWh</Typography>
                    <Typography>Revenue: ${selectedProvider.totalCapacity * selectedProvider.avgRate.toLocaleString()}</Typography>
                    <Typography>Rating: ⭐ {selectedProvider.rating}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
          <Button variant="contained">Edit Provider</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProviderDashboard; 
