import React, { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  Grid,
  Chip,
  Avatar,
  IconButton,
  Rating
} from '@mui/material';
import {
  Add,
  ArrowBack,
  Business,
  TrendingUp,
  Bolt,
  AttachMoney,
  Visibility,
  Edit,
  Delete
} from '@mui/icons-material';
import kilowattImage from '../../assets/image.png';

const ProviderDashboard = ({ onLogout, onNavigate }) => {
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    const mockProviders = [
      {
        id: 1,
        name: 'Green Energy Solutions',
        contact: 'John Smith',
        type: 'Renewable',
        status: 'Active',
        capacity: 500000,
        avgRate: 0.085,
        revenue: 42500,
        rating: 4.8
      },
      {
        id: 2,
        name: 'PowerCorp Utilities',
        contact: 'Sarah Johnson',
        type: 'Traditional',
        status: 'Active',
        capacity: 750000,
        avgRate: 0.092,
        revenue: 69000,
        rating: 4.2
      },
      {
        id: 3,
        name: 'Solar Dynamics',
        contact: 'Mike Wilson',
        type: 'Solar',
        status: 'Active',
        capacity: 300000,
        avgRate: 0.078,
        revenue: 23400,
        rating: 4.6
      },
      {
        id: 4,
        name: 'Wind Power Inc',
        contact: 'Lisa Brown',
        type: 'Wind',
        status: 'Pending',
        capacity: 200000,
        avgRate: 0.088,
        revenue: 17600,
        rating: 4.0
      }
    ];
    setProviders(mockProviders);
  }, []);

  const getTypeColor = (type) => {
    switch (type) {
      case 'Renewable': return 'success';
      case 'Traditional': return 'default';
      case 'Solar': return 'warning';
      case 'Wind': return 'info';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Pending': return 'warning';
      case 'Inactive': return 'error';
      default: return 'default';
    }
  };

  const totalProviders = providers.length;
  const activeProviders = providers.filter(p => p.status === 'Active').length;
  const totalCapacity = providers.reduce((sum, p) => sum + p.capacity, 0);
  const totalRevenue = providers.reduce((sum, p) => sum + p.revenue, 0);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <AppBar 
        position="static" 
        sx={{ 
          background: 'linear-gradient(135deg, #C82828 0%, #B71C1C 100%)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        <Toolbar sx={{ minHeight: 72 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => onNavigate('home')}
            sx={{ color: 'white', mr: 2 }}
          >
            Back
          </Button>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <img 
              src={kilowattImage} 
              alt="Kilowatt Logo" 
              style={{ width: 44, height: 44, marginRight: 14, borderRadius: 9 }}
            />
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
              Kilowatt
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Button
            onClick={onLogout}
            sx={{ color: 'white', textTransform: 'none', fontWeight: 600 }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Energy Provider Dashboard
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => onNavigate('addProvider')}
            size="large"
            sx={{ 
              background: 'linear-gradient(135deg, #C82828 0%, #B71C1C 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #B71C1C 0%, #A01818 100%)'
              }
            }}
          >
            Add Provider
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Business sx={{ fontSize: 40, color: '#C82828', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {totalProviders}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Providers
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <TrendingUp sx={{ fontSize: 40, color: '#4CAF50', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {activeProviders}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Providers
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Bolt sx={{ fontSize: 40, color: '#FF9800', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {totalCapacity.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Capacity (kW)
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <AttachMoney sx={{ fontSize: 40, color: '#4CAF50', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  ${totalRevenue.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Revenue
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Providers Table */}
        <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <CardContent>
            <TableContainer 
              component={Paper} 
              variant="outlined"
              sx={{ 
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}
            >
              <Table>
                <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: '#333' }}>Provider</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333' }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333' }}>Capacity (kW)</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333' }}>Avg Rate</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333' }}>Revenue</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333' }}>Rating</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {providers.map((provider) => (
                    <TableRow 
                      key={provider.id}
                      hover
                      sx={{ 
                        '&:hover': {
                          backgroundColor: '#f8f9fa'
                        }
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              mr: 2, 
                              bgcolor: '#C82828',
                              width: 40,
                              height: 40
                            }}
                          >
                            {provider.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="medium">
                              {provider.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {provider.contact}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={provider.type} 
                          color={getTypeColor(provider.type)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={provider.status} 
                          color={getStatusColor(provider.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{provider.capacity.toLocaleString()}</TableCell>
                      <TableCell>${provider.avgRate}/kWh</TableCell>
                      <TableCell>${provider.revenue.toLocaleString()}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Rating value={provider.rating} readOnly size="small" />
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            {provider.rating}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton size="small" color="primary">
                            <Visibility />
                          </IconButton>
                          <IconButton size="small" color="primary">
                            <Edit />
                          </IconButton>
                          <IconButton size="small" color="error">
                            <Delete />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ProviderDashboard; 
