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
import NavBar from '../shared/NavBar';

const ProviderDashboard = ({ onLogout, onNavigate }) => {
  const [providers, setProviders] = useState([]);

  // Load real provider data
  useEffect(() => {
    const loadProviderData = async () => {
      try {
        // Import the real provider data
        const providersData = await import('../../data/providers.json');
        const realProviders = providersData.default || providersData;

        console.log(`📊 Loaded ${realProviders.length} real providers from database`);
        setProviders(realProviders);
      } catch (error) {
        console.error('❌ Error loading provider data:', error);

        // Fallback to a few sample providers if import fails
        const fallbackProviders = [
          {
            id: 1,
            name: 'Sample Provider',
            contact: 'Sample Contact',
            phone: '(555) 123-4567',
            email: 'sample@example.com',
            refundType: 'Unknown',
            isRepActive: true,
            location: 'Sample Location',
            paymentTerms: 'Sample Terms',
            accountCount: 0,
            commissionTotal: 0
          }
        ];
        setProviders(fallbackProviders);
      }
    };

    loadProviderData();
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
  const activeProviders = providers.filter(p => p.isRepActive).length;
  const totalAccounts = providers.reduce((sum, p) => sum + (p.accountCount || 0), 0);
  const totalCommissions = providers.reduce((sum, p) => sum + (p.commissionTotal || 0), 0);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <NavBar 
        onNavigate={onNavigate}
        onProfileMenuOpen={onLogout}
        userProfile={{ name: 'Profile' }}
        currentPage="provider"
        searchQuery=""
        setSearchQuery={() => {}}
      />

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
                  {totalAccounts.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Accounts
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <AttachMoney sx={{ fontSize: 40, color: '#4CAF50', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  ${totalCommissions.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Commissions
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
                    <TableCell sx={{ fontWeight: 600, color: '#333' }}>Contact Info</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333' }}>Refund Type</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333' }}>Location</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333' }}>Accounts</TableCell>
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
                        <Box>
                          {provider.phone && provider.phone !== 'No Phone' && (
                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              📞 {provider.phone}
                            </Typography>
                          )}
                          {provider.email && provider.email !== 'No Email' && (
                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                              ✉️ {provider.email}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={provider.isRepActive ? 'Active' : 'Inactive'}
                          color={provider.isRepActive ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={provider.refundType}
                          color={provider.refundType === 'State' ? 'info' : provider.refundType === 'Check' ? 'success' : 'default'}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {provider.location && provider.location !== 'No Location' ? provider.location : 'Not specified'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {provider.accountCount || 0}
                        </Typography>
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
