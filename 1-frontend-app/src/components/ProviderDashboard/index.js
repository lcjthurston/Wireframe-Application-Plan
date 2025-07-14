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
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
  Visibility,
  Business,
  TrendingUp,
  AttachMoney,
  Assessment,
  Phone,
  Email,
  LocationOn
} from '@mui/icons-material';

const ProviderDashboard = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Mock provider data
  const mockProviders = [
    {
      id: 1,
      name: 'Green Energy Solutions',
      type: 'Renewable',
      status: 'Active',
      contracts: 45,
      avgRate: 0.12,
      totalRevenue: 125000,
      contact: {
        name: 'John Smith',
        email: 'john@greenenergy.com',
        phone: '(555) 123-4567'
      },
      address: '123 Green St, Austin, TX',
      rating: 4.8
    },
    {
      id: 2,
      name: 'PowerCorp Utilities',
      type: 'Traditional',
      status: 'Active',
      contracts: 78,
      avgRate: 0.10,
      totalRevenue: 245000,
      contact: {
        name: 'Sarah Johnson',
        email: 'sarah@powercorp.com',
        phone: '(555) 987-6543'
      },
      address: '456 Power Ave, Dallas, TX',
      rating: 4.2
    },
    {
      id: 3,
      name: 'Solar Dynamics',
      type: 'Solar',
      status: 'Pending',
      contracts: 23,
      avgRate: 0.08,
      totalRevenue: 89000,
      contact: {
        name: 'Mike Wilson',
        email: 'mike@solardynamics.com',
        phone: '(555) 456-7890'
      },
      address: '789 Solar Blvd, Houston, TX',
      rating: 4.6
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
    totalContracts: providers.reduce((sum, p) => sum + p.contracts, 0),
    totalRevenue: providers.reduce((sum, p) => sum + p.totalRevenue, 0),
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
              <Assessment sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {providerStats.totalContracts}
              </Typography>
              <Typography color="textSecondary">Total Contracts</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <AttachMoney sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                ${(providerStats.totalRevenue / 1000).toFixed(0)}K
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
                <TableCell>Contracts</TableCell>
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
                          {provider.contact.name}
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
                      {provider.contracts}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      ${provider.avgRate.toFixed(3)}/kWh
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      ${provider.totalRevenue.toLocaleString()}
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
                      <Typography>{selectedProvider.contact.phone}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Email fontSize="small" />
                      <Typography>{selectedProvider.contact.email}</Typography>
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
                    <Typography>Contracts: {selectedProvider.contracts}</Typography>
                    <Typography>Average Rate: ${selectedProvider.avgRate.toFixed(3)}/kWh</Typography>
                    <Typography>Total Revenue: ${selectedProvider.totalRevenue.toLocaleString()}</Typography>
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
