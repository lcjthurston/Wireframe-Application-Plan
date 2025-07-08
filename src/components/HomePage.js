import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Grid,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Chip,
  Container,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge
} from '@mui/material';
import {
  Search as SearchIcon,
  Dashboard as DashboardIcon,
  Assignment as TaskIcon,
  AccountCircle as AccountIcon,
  Email as EmailIcon,
  AttachMoney as MoneyIcon,
  Business as BusinessIcon,
  HealthAndSafety as HealthIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import kilowattImage from '../assets/image.png';

const HomePage = ({ onLogout, onNavigate, onOpenDataEntry }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@kilowatt.com',
    avatar: null
  });

  // Mock data for widgets
  const myTasks = {
    providerSelection: 12,
    superFlagged: 3,
    draftedEmails: 8,
    newAccounts: 5
  };

  const teamTasks = {
    providerSelection: 25,
    superFlagged: 7,
    draftedEmails: 15,
    newAccounts: 12
  };

  const systemHealth = [
    {
      name: 'Email Monitoring',
      status: 'OK',
      lastRun: '2 minutes ago',
      icon: '📧'
    },
    {
      name: 'Centerpoint Usage Retrieval',
      status: 'OK',
      lastRun: '5 minutes ago',
      icon: '⚡'
    },
    {
      name: 'Daily Pricing Imports',
      status: 'ERROR',
      lastRun: '1 hour ago',
      icon: '💰'
    },
    {
      name: 'Contract Follow-up Bot',
      status: 'OK',
      lastRun: '15 minutes ago',
      icon: '📋'
    }
  ];

  const recentActivity = [
    {
      type: 'bot',
      action: 'Contract sent to ABC Corp.',
      timestamp: '2 minutes ago',
      icon: '🤖'
    },
    {
      type: 'user',
      user: 'Sarah Johnson',
      action: 'Updated manager for XYZ Inc.',
      timestamp: '5 minutes ago',
      icon: '👤'
    },
    {
      type: 'bot',
      action: 'New account "Main Street Plaza" created from email',
      timestamp: '8 minutes ago',
      icon: '🤖'
    },
    {
      type: 'user',
      user: 'Mike Chen',
      action: 'Generated pricing sheet for Downtown Center',
      timestamp: '12 minutes ago',
      icon: '👤'
    },
    {
      type: 'bot',
      action: 'Usage data updated for 15 accounts',
      timestamp: '15 minutes ago',
      icon: '🤖'
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // TODO: Implement search functionality
  };

  const handleNavigation = (page) => {
    console.log('Navigating to:', page);
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileAction = (action) => {
    console.log('Profile action:', action);
    if (action === 'logout') {
      onLogout();
    }
    handleProfileMenuClose();
    // TODO: Implement other profile actions
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'OK':
        return 'success';
      case 'ERROR':
        return 'error';
      case 'WARNING':
        return 'warning';
      default:
        return 'default';
    }
  };

  const StyledAppBar = styled(AppBar)(({ theme }) => ({
    background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  }));

  const LogoImage = styled('img')({
    width: 40,
    height: 40,
    marginRight: 12,
    borderRadius: 8,
  });

  const DashboardCard = styled(Card)(({ theme }) => ({
    height: '100%',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
    },
  }));

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <StyledAppBar position="static">
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <LogoImage src={kilowattImage} alt="Kilowatt" />
            <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
              Kilowatt
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button color="inherit" onClick={() => handleNavigation('home')}>
              Home
            </Button>
            <Button color="inherit" onClick={() => handleNavigation('task-queue')}>
              Task Queue
            </Button>
            <Button color="inherit" onClick={() => handleNavigation('accounts')}>
              Accounts
            </Button>
            <Button color="inherit" onClick={() => handleNavigation('managers')}>
              Managers
            </Button>
            <Button color="inherit" onClick={() => handleNavigation('email-drafts')}>
              Email Drafts
            </Button>
            <Button color="inherit" onClick={() => handleNavigation('commissions')}>
              Commissions
            </Button>
            <Button color="inherit" onClick={() => handleNavigation('providers')}>
              Providers
            </Button>
            <Button color="inherit" onClick={() => handleNavigation('system-health')}>
              System Health
            </Button>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 2 }}>
            <Paper component="form" onSubmit={handleSearch} sx={{ display: 'flex', alignItems: 'center', px: 2 }}>
              <TextField
                size="small"
                placeholder="Search accounts, managers, etc..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="standard"
                sx={{ minWidth: 200 }}
                InputProps={{ disableUnderline: true }}
              />
              <IconButton type="submit" size="small">
                <SearchIcon />
              </IconButton>
            </Paper>

            <IconButton
              onClick={handleProfileMenuOpen}
              sx={{ color: 'inherit' }}
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                {userProfile.avatar ? (
                  <img src={userProfile.avatar} alt={userProfile.name} />
                ) : (
                  userProfile.name.charAt(0)
                )}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
            >
              <MenuItem onClick={() => handleProfileAction('settings')}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
              <MenuItem onClick={() => handleProfileAction('logout')}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </StyledAppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            Welcome back, {userProfile.name}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's what's happening with your business intelligence platform today.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* My Tasks Widget */}
          <Grid item xs={12} md={6}>
            <DashboardCard>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TaskIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" component="h2">
                    My Tasks
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.light', borderRadius: 2 }}>
                      <Typography variant="h4" color="white" sx={{ fontWeight: 700 }}>
                        {myTasks.providerSelection}
                      </Typography>
                      <Typography variant="body2" color="white">
                        Provider Selection
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.light', borderRadius: 2 }}>
                      <Typography variant="h4" color="white" sx={{ fontWeight: 700 }}>
                        {myTasks.superFlagged}
                      </Typography>
                      <Typography variant="body2" color="white">
                        Super Flagged
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.light', borderRadius: 2 }}>
                      <Typography variant="h4" color="white" sx={{ fontWeight: 700 }}>
                        {myTasks.draftedEmails}
                      </Typography>
                      <Typography variant="body2" color="white">
                        Drafted Emails
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
                      <Typography variant="h4" color="white" sx={{ fontWeight: 700 }}>
                        {myTasks.newAccounts}
                      </Typography>
                      <Typography variant="body2" color="white">
                        New Accounts
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </DashboardCard>
          </Grid>

          {/* Team Tasks Widget */}
          <Grid item xs={12} md={6}>
            <DashboardCard>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUpIcon sx={{ mr: 1, color: 'secondary.main' }} />
                  <Typography variant="h6" component="h2">
                    Team Tasks
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.light', borderRadius: 2 }}>
                      <Typography variant="h4" color="white" sx={{ fontWeight: 700 }}>
                        {teamTasks.providerSelection}
                      </Typography>
                      <Typography variant="body2" color="white">
                        Provider Selection
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.light', borderRadius: 2 }}>
                      <Typography variant="h4" color="white" sx={{ fontWeight: 700 }}>
                        {teamTasks.superFlagged}
                      </Typography>
                      <Typography variant="body2" color="white">
                        Super Flagged
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.light', borderRadius: 2 }}>
                      <Typography variant="h4" color="white" sx={{ fontWeight: 700 }}>
                        {teamTasks.draftedEmails}
                      </Typography>
                      <Typography variant="body2" color="white">
                        Drafted Emails
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
                      <Typography variant="h4" color="white" sx={{ fontWeight: 700 }}>
                        {teamTasks.newAccounts}
                      </Typography>
                      <Typography variant="body2" color="white">
                        New Accounts
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </DashboardCard>
          </Grid>

          {/* System Health Widget */}
          <Grid item xs={12} md={6}>
            <DashboardCard>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <HealthIcon sx={{ mr: 1, color: 'success.main' }} />
                  <Typography variant="h6" component="h2">
                    System Health
                  </Typography>
                </Box>
                <List>
                  {systemHealth.map((system, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <span style={{ fontSize: '1.2rem' }}>{system.icon}</span>
                      </ListItemIcon>
                      <ListItemText
                        primary={system.name}
                        secondary={system.lastRun}
                      />
                      <Chip
                        label={system.status}
                        color={getStatusColor(system.status)}
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </DashboardCard>
          </Grid>

          {/* Recent Activity Widget */}
          <Grid item xs={12} md={6}>
            <DashboardCard>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <DashboardIcon sx={{ mr: 1, color: 'info.main' }} />
                  <Typography variant="h6" component="h2">
                    Recent Activity
                  </Typography>
                </Box>
                <List>
                  {recentActivity.map((activity, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <span style={{ fontSize: '1.2rem' }}>{activity.icon}</span>
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.action}
                        secondary={activity.timestamp}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </DashboardCard>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage; 