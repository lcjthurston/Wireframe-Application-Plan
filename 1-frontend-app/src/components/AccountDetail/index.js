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
  Divider,
  IconButton
} from '@mui/material';
import {
  ArrowBack,
  Warning,
  Edit,
  Business,
  Phone,
  Email,
  LocationOn
} from '@mui/icons-material';

const AccountDetail = ({ accountId, onNavigate }) => {
  const [account, setAccount] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

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
    <Box sx={{ p: 3 }}>
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
            <Typography>ESIIDs & Usage content goes here</Typography>
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
    </Box>
  );
};

export default AccountDetail;
