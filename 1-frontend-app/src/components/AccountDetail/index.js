import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Tabs,
  Tab,
  Grid,
  Alert,
  IconButton,
  Container
} from '@mui/material';
import {
  ArrowBack,
  Warning,
  Edit,
  Phone,
  Email,
  LocationOn
} from '@mui/icons-material';
import NavBar from '../shared/NavBar';

const AccountDetail = ({ accountId, onNavigate, onLogout }) => {
  const [account, setAccount] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [showRefreshAlert, setShowRefreshAlert] = useState(false);

  useEffect(() => {
    const mockAccount = {
      id: accountId,
      name: 'ABC Corporation',
      managerName: 'Sarah Johnson',
      managementCompany: 'Property Management Inc.',
      status: 'Needs Pricing',
      address: '123 Business Ave, Suite 100, Houston, TX 77001',
      phone: '(713) 555-0123',
      email: 'contact@abc-corp.com',
      esiidCount: 5,
      usage: '125,000 kWh/month'
    };
    setAccount(mockAccount);
  }, [accountId]);

  const handleRunRefreshUsage = () => {
    setShowRefreshAlert(true);
    
    // Hide alert after 10 seconds
    setTimeout(() => {
      setShowRefreshAlert(false);
    }, 10000);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'good': return 'success';
      case 'needs pricing': return 'warning';
      case 'needs contract sent': return 'error';
      case 'needs providers selected': return 'info';
      default: return 'default';
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (!account) return null;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <NavBar 
        onNavigate={onNavigate}
        onProfileMenuOpen={onLogout}
        userProfile={{ name: 'Profile' }}
        currentPage="accounts"
        searchQuery=""
        setSearchQuery={() => {}}
      />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => onNavigate('accounts')} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1">
            Accounts
          </Typography>
        </Box>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                  {account.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Manager: {account.managerName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Management Co: {account.managementCompany}
                  </Typography>
                </Box>
              </Box>
              <Chip
                label={account.status}
                color={getStatusColor(account.status)}
                size="medium"
              />
            </Box>

            {account.status === 'Needs Pricing' && (
              <Alert 
                severity="warning" 
                icon={<Warning />}
                sx={{ mb: 3 }}
              >
                This account needs providers selected before a pricing sheet can be generated.
              </Alert>
            )}

            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              sx={{ mb: 3 }}
            >
              <Tab label="Overview" />
              <Tab label="Contracts & Pricing" />
              <Tab label="ESIIDs & Usage" />
              <Tab label="Commissions" />
              <Tab label="Activity History" />
              <Tab label="Change Provider" />
            </Tabs>

            {activeTab === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Contact Information
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">{account.address}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">{account.phone}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Email sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">{account.email}</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">
                          Management Details
                        </Typography>
                        <Button size="small" startIcon={<Edit />}>
                          Change Manager
                        </Button>
                      </Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Current Manager:</strong> {account.managerName}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Management Company:</strong> {account.managementCompany}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}

            {activeTab === 1 && (
              <Typography>Contracts & Pricing content goes here</Typography>
            )}

            {activeTab === 2 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">ESIIDs & Usage</Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleRunRefreshUsage}
                      sx={{ 
                        bgcolor: '#C82828',
                        '&:hover': { bgcolor: '#B71C1C' }
                      }}
                    >
                      Run Refresh Usage Automation
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                    >
                      + Add Meter
                    </Button>
                  </Box>
                </Box>
                
                {showRefreshAlert && (
                  <Alert severity="info" sx={{ mb: 3 }}>
                    Pending refresh ...
                  </Alert>
                )}

                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      ESIIDs and Usage Table
                    </Typography>
                    <Box sx={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid #ddd' }}>
                            <th style={{ padding: '12px', textAlign: 'left' }}>ESIID</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Rep</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Load Profile</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>kWh per Month</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>kWh Per Year</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '12px' }}>10123456789012345</td>
                            <td style={{ padding: '12px' }}>CNTR</td>
                            <td style={{ padding: '12px' }}>Commercial</td>
                            <td style={{ padding: '12px' }}>25,000</td>
                            <td style={{ padding: '12px' }}>300,000</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '12px' }}>10123456789012346</td>
                            <td style={{ padding: '12px' }}>CNTR</td>
                            <td style={{ padding: '12px' }}>Commercial</td>
                            <td style={{ padding: '12px' }}>18,500</td>
                            <td style={{ padding: '12px' }}>222,000</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '12px' }}>10123456789012347</td>
                            <td style={{ padding: '12px' }}>CNTR</td>
                            <td style={{ padding: '12px' }}>Commercial</td>
                            <td style={{ padding: '12px' }}>32,200</td>
                            <td style={{ padding: '12px' }}>386,400</td>
                          </tr>
                        </tbody>
                      </table>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            )}

            {activeTab === 3 && (
              <Typography>Commissions content goes here</Typography>
            )}

            {activeTab === 4 && (
              <Typography>Activity History content goes here</Typography>
            )}

            {activeTab === 5 && (
              <Typography>Change Provider content goes here</Typography>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default AccountDetail;











