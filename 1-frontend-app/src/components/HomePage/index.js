import React, { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  InputAdornment,
  Divider,
  Paper
} from '@mui/material';
import {
  Search,
  Person,
  Email,
  Assignment,
  Business,
  HealthAndSafety,
  QueueMusic,
  CheckCircle,
  Error,
  Warning,
  Info,
  TrendingUp,
  SupervisedUserCircle,
  Drafts,
  AccountBalance
} from '@mui/icons-material';
import kilowattImage from '../../assets/image.png';

const HomePage = ({ onLogout, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for dashboard
  const stats = {
    providerSelections: 37,
    superFlagged: 10,
    draftedEmails: 23,
    newAccounts: 17
  };

  const systemHealth = [
    { name: 'Email Monitoring', status: 'OK', time: '2 minutes ago', icon: <Email /> },
    { name: 'Centerpoint Usage Retrieval', status: 'OK', time: '5 minutes ago', icon: <TrendingUp /> },
    { name: 'Daily Pricing Imports', status: 'ERROR', time: '1 hour ago', icon: <Warning /> },
    { name: 'Contract Follow-up Bot', status: 'OK', time: '10 minutes ago', icon: <Assignment /> }
  ];

  const recentActivity = [
    { 
      type: 'contract', 
      message: 'Contract sent to ABC Corp.', 
      time: '2 minutes ago',
      icon: <Assignment />,
      color: '#2196F3'
    },
    { 
      type: 'manager', 
      message: 'Sarah Johnson Updated manager for XYZ Inc.', 
      time: '5 minutes ago',
      icon: <Person />,
      color: '#4CAF50'
    },
    { 
      type: 'account', 
      message: 'New account "Main Street Plaza" created from email', 
      time: '8 minutes ago',
      icon: <Business />,
      color: '#FF9800'
    },
    { 
      type: 'pricing', 
      message: 'Mike Chen Generated pricing sheet for Downtown Center', 
      time: '12 minutes ago',
      icon: <TrendingUp />,
      color: '#9C27B0'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'OK': return 'success';
      case 'ERROR': return 'error';
      case 'WARNING': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'OK': return <CheckCircle />;
      case 'ERROR': return <Error />;
      case 'WARNING': return <Warning />;
      default: return <Info />;
    }
  };

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
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
            <img 
              src={kilowattImage} 
              alt="Kilowatt Logo" 
              style={{ width: 44, height: 44, marginRight: 14, borderRadius: 9 }}
            />
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
              Kilowatt
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mr: 4 }}>
            <Button
              startIcon={<SupervisedUserCircle />}
              onClick={() => onNavigate('managers')}
              sx={{ color: 'white', textTransform: 'none', fontWeight: 500 }}
            >
              Manager
            </Button>
            <Button
              startIcon={<Drafts />}
              onClick={() => onNavigate('emailDrafts')}
              sx={{ color: 'white', textTransform: 'none', fontWeight: 500 }}
            >
              Email Drafts
            </Button>
            <Button
              startIcon={<AccountBalance />}
              onClick={() => onNavigate('commissions')}
              sx={{ color: 'white', textTransform: 'none', fontWeight: 500 }}
            >
              Commission
            </Button>
            <Button
              startIcon={<Business />}
              onClick={() => onNavigate('providers')}
              sx={{ color: 'white', textTransform: 'none', fontWeight: 500 }}
            >
              Providers
            </Button>
            <Button
              startIcon={<HealthAndSafety />}
              onClick={() => onNavigate('systemHealth')}
              sx={{ color: 'white', textTransform: 'none', fontWeight: 500 }}
            >
              System Health
            </Button>
            <Button
              startIcon={<QueueMusic />}
              onClick={() => onNavigate('taskQueue')}
              sx={{ color: 'white', textTransform: 'none', fontWeight: 500 }}
            >
              Task Queue
            </Button>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <TextField
            placeholder="Search accounts, providers, or tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{
              mr: 2,
              minWidth: 300,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255,255,255,0.15)',
                borderRadius: 3,
                '& fieldset': {
                  borderColor: 'rgba(255,255,255,0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255,255,255,0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'white',
                },
                '& input': {
                  color: 'white',
                  '&::placeholder': {
                    color: 'rgba(255,255,255,0.7)',
                    opacity: 1,
                  },
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'rgba(255,255,255,0.7)' }} />
                </InputAdornment>
              ),
            }}
          />

          <Button
            onClick={onLogout}
            sx={{ 
              color: 'white', 
              textTransform: 'none', 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.2)' }}>
              <Person />
            </Avatar>
            John Doe
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Welcome Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            Welcome back, John Doe!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's what's happening with your accounts and team today.
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                borderRadius: 3, 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                }
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#C82828', mb: 1 }}>
                  {stats.providerSelections}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Provider Selections
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                borderRadius: 3, 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                }
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#C82828', mb: 1 }}>
                  {stats.superFlagged}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Super Flagged
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                borderRadius: 3, 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                }
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#C82828', mb: 1 }}>
                  {stats.draftedEmails}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Drafted Emails
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                borderRadius: 3, 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                }
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#C82828', mb: 1 }}>
                  {stats.newAccounts}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  New Accounts
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* System Health and Recent Activity */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
                  <HealthAndSafety sx={{ mr: 1, color: '#C82828' }} />
                  System Health
                </Typography>
                <List sx={{ p: 0 }}>
                  {systemHealth.map((item, index) => (
                    <React.Fragment key={index}>
                      <ListItem sx={{ px: 0, py: 2 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'transparent', color: '#666' }}>
                            {item.icon}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                                {item.name}
                              </Typography>
                              <Chip 
                                icon={getStatusIcon(item.status)}
                                label={item.status} 
                                color={getStatusColor(item.status)}
                                size="small"
                              />
                            </Box>
                          }
                          secondary={
                            <Typography variant="body2" color="text.secondary">
                              {item.time}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {index < systemHealth.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
                  <Assignment sx={{ mr: 1, color: '#C82828' }} />
                  Recent Activity
                </Typography>
                <List sx={{ p: 0 }}>
                  {recentActivity.map((item, index) => (
                    <React.Fragment key={index}>
                      <ListItem sx={{ px: 0, py: 2 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: item.color, width: 40, height: 40 }}>
                            {item.icon}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.5 }}>
                              {item.message}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body2" color="text.secondary">
                              {item.time}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {index < recentActivity.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage; 
