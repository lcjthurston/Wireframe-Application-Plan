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
import kilowattImage from '../../assets/image.png';
import { LottieIcon } from '../lottie';
import dashboardPulseAnimation from '../../assets/lottie/icons/dashboard-pulse.json';
import taskBounceAnimation from '../../assets/lottie/icons/task-bounce.json';
import emailPulseAnimation from '../../assets/lottie/icons/email-pulse.json';
import warningFlashAnimation from '../../assets/lottie/icons/warning-flash.json';
import './HomePage.scss';

const HomePage = ({ onLogout, onNavigate, onOpenDataEntry }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@kilowatt.com',
    avatar: null
  });

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

  return (
    <Box className="home-page">
      <AppBar position="static" className="home-app-bar">
        <Toolbar className="home-toolbar">
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <img src={kilowattImage} alt="Kilowatt" className="home-logo" />
            <Typography variant="h6" component="div" className="home-brand">
              Kilowatt
            </Typography>
          </Box>

          <Box className="home-search-container">
            <TextField
              placeholder="Search accounts, providers, or tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              variant="outlined"
              size="small"
              className="home-search-field"
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                ),
              }}
            />
          </Box>

          <Button
            color="inherit"
            onClick={handleProfileMenuOpen}
            className="home-profile-button"
            startIcon={<AccountIcon />}
          >
            {userProfile.name}
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" className="home-content">
        <Box className="home-welcome-section">
          <Typography variant="h4" className="home-welcome-title">
            Welcome back, {userProfile.name}!
          </Typography>
          <Typography variant="body1" className="home-welcome-subtitle">
            Here's what's happening with your accounts and team today.
          </Typography>
        </Box>

        <Grid container spacing={3} className="home-stats-grid">
          <Grid item xs={12} sm={6} md={3}>
            <Card className="home-stat-card">
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h3" className="home-stat-value">
                  {myTasks.providerSelection + teamTasks.providerSelection}
                </Typography>
                <Typography variant="body2" className="home-stat-label">
                  Provider Selections
                </Typography>
                <Box className="home-stat-icon" sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                  <LottieIcon
                    animationData={dashboardPulseAnimation}
                    size={48}
                    loop={true}
                    autoplay={true}
                    speed={0.8}
                    hover={true}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="home-stat-card">
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h3" className="home-stat-value">
                  {myTasks.superFlagged + teamTasks.superFlagged}
                </Typography>
                <Typography variant="body2" className="home-stat-label">
                  Super Flagged
                </Typography>
                <Box className="home-stat-icon" sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                  <LottieIcon
                    animationData={warningFlashAnimation}
                    size={48}
                    loop={true}
                    autoplay={true}
                    speed={1.2}
                    hover={true}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="home-stat-card">
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h3" className="home-stat-value">
                  {myTasks.draftedEmails + teamTasks.draftedEmails}
                </Typography>
                <Typography variant="body2" className="home-stat-label">
                  Drafted Emails
                </Typography>
                <Box className="home-stat-icon" sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                  <LottieIcon
                    animationData={emailPulseAnimation}
                    size={48}
                    loop={true}
                    autoplay={true}
                    speed={1.0}
                    hover={true}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="home-stat-card">
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h3" className="home-stat-value">
                  {myTasks.newAccounts + teamTasks.newAccounts}
                </Typography>
                <Typography variant="body2" className="home-stat-label">
                  New Accounts
                </Typography>
                <Box className="home-stat-icon" sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                  <LottieIcon
                    animationData={taskBounceAnimation}
                    size={48}
                    loop={true}
                    autoplay={true}
                    speed={0.6}
                    hover={true}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" className="home-section-title">
              System Health
            </Typography>
            <Box className="home-health-grid">
              {systemHealth.map((item, index) => (
                <Box key={index} className="home-health-item">
                  <Typography className="home-health-icon">
                    {item.icon}
                  </Typography>
                  <Box className="home-health-info">
                    <Typography variant="body1" className="home-health-name">
                      {item.name}
                    </Typography>
                    <Typography variant="body2" className="home-health-status">
                      {item.lastRun}
                    </Typography>
                  </Box>
                  <Chip
                    label={item.status}
                    color={getStatusColor(item.status)}
                    size="small"
                    className={`home-status-chip home-status-${item.status.toLowerCase()}`}
                  />
                </Box>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" className="home-section-title">
              Recent Activity
            </Typography>
            <Paper className="home-activity-list">
              {recentActivity.map((activity, index) => (
                <Box key={index} className="home-activity-item">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography className="home-activity-icon">
                      {activity.icon}
                    </Typography>
                    <Box className="home-activity-content">
                      <Typography variant="body2" className="home-activity-text">
                        {activity.type === 'user' ? (
                          <>
                            <span className="home-activity-user">{activity.user}</span> {activity.action}
                          </>
                        ) : (
                          activity.action
                        )}
                      </Typography>
                      <Typography variant="caption" className="home-activity-timestamp">
                        {activity.timestamp}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>

        <Box className="home-quick-actions">
          <Typography variant="h6" className="home-section-title">
            Quick Actions
          </Typography>
          <Button
            variant="contained"
            startIcon={<DashboardIcon />}
            onClick={() => handleNavigation('manager')}
            className="home-action-button"
          >
            Manager Dashboard
          </Button>
          <Button
            variant="outlined"
            startIcon={<EmailIcon />}
            onClick={() => handleNavigation('email-draft')}
            className="home-action-button"
          >
            Email Drafts
          </Button>
          <Button
            variant="outlined"
            startIcon={<MoneyIcon />}
            onClick={() => handleNavigation('commission')}
            className="home-action-button"
          >
            Commission Dashboard
          </Button>
          <Button
            variant="outlined"
            startIcon={<BusinessIcon />}
            onClick={() => handleNavigation('provider')}
            className="home-action-button"
          >
            Provider Management
          </Button>
          <Button
            variant="outlined"
            startIcon={<HealthIcon />}
            onClick={() => handleNavigation('system-health')}
            className="home-action-button"
          >
            System Health
          </Button>
          <Button
            variant="outlined"
            startIcon={<TaskIcon />}
            onClick={() => handleNavigation('task-queue')}
            className="home-action-button"
          >
            Task Queue
          </Button>
        </Box>
      </Container>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        className="home-menu"
      >
        <MenuItem onClick={() => handleProfileAction('profile')} className="home-menu-item">
          <AccountIcon sx={{ mr: 1 }} />
          Profile
        </MenuItem>
        <MenuItem onClick={() => handleProfileAction('settings')} className="home-menu-item">
          <SettingsIcon sx={{ mr: 1 }} />
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleProfileAction('logout')} className="home-menu-item">
          <LogoutIcon sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default HomePage; 