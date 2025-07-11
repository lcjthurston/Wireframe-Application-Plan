import React, { useState, useRef, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Badge,
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  InputAdornment,
  Container
} from '@mui/material';
import {
  Search as SearchIcon,
  AccountCircle,
  Business,
  Phone,
  Email,
  LocationOn,
  Person,
  AttachMoney,
  Description,
  History,
  Refresh,
  GetApp,
  Edit,
  MoreVert,
  CheckCircle,
  Warning,
  Error,
  Info,
  Add,
  Remove,
  Sort,
  Dashboard as DashboardIcon,
  Email as EmailIcon,
  AttachMoney as MoneyIcon,
  HealthAndSafety as HealthIcon,
  Assignment as TaskIcon
} from '@mui/icons-material';
import kilowattImage from '../../assets/image.png';
import './ManagerDashboard.scss';

const ManagerDashboard = ({ onLogout, onNavigate }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('accountName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);

  // Mock data for manager/company
  const managerData = {
    name: 'Sarah Johnson',
    type: 'manager', // or 'company'
    email: 'sarah.johnson@company.com',
    phone: '(713) 555-0123',
    company: 'Property Management Inc.'
  };

  const summaryStats = {
    totalActiveAccounts: 24,
    totalEsiids: 48,
    totalYtdCommissions: 125000,
    totalPendingContracts: 3
  };

  const accounts = [
    {
      id: 1,
      accountName: 'ABC Corporation',
      status: 'Active',
      contractEndDate: '2024-12-31',
      manager: 'Sarah Johnson',
      esiids: 2,
      monthlyCommission: 5200
    },
    {
      id: 2,
      accountName: 'XYZ Industries',
      status: 'Needs Pricing',
      contractEndDate: '2024-06-30',
      manager: 'Sarah Johnson',
      esiids: 1,
      monthlyCommission: 3800
    },
    {
      id: 3,
      accountName: 'Main Street Plaza',
      status: 'Pending Contract',
      contractEndDate: '2024-09-15',
      manager: 'Sarah Johnson',
      esiids: 3,
      monthlyCommission: 7200
    },
    {
      id: 4,
      accountName: 'Downtown Center',
      status: 'Active',
      contractEndDate: '2024-11-30',
      manager: 'Sarah Johnson',
      esiids: 2,
      monthlyCommission: 4500
    },
    {
      id: 5,
      accountName: 'Tech Park LLC',
      status: 'Super Flagged',
      contractEndDate: '2024-08-15',
      manager: 'Sarah Johnson',
      esiids: 1,
      monthlyCommission: 3100
    }
  ];

  const activityHistory = [
    {
      timestamp: '2024-01-15 15:30',
      action: 'Account "ABC Corporation" added',
      type: 'account_added'
    },
    {
      timestamp: '2024-01-15 14:00',
      action: 'Manager updated for "XYZ Industries"',
      type: 'manager_updated'
    },
    {
      timestamp: '2024-01-15 10:15',
      action: 'Contract renewed for "Main Street Plaza"',
      type: 'contract_renewed'
    },
    {
      timestamp: '2024-01-14 16:45',
      action: 'Account "Downtown Center" status changed to Active',
      type: 'status_changed'
    },
    {
      timestamp: '2024-01-14 12:30',
      action: 'Commission data updated for "Tech Park LLC"',
      type: 'commission_updated'
    }
  ];

  const tabs = [
    { id: 'accounts', label: 'Accounts', icon: <Business /> },
    { id: 'activity', label: 'Activity History', icon: <History /> }
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

  const handleProfileAction = (action) => {
    console.log('Profile action:', action);
    if (action === 'logout') {
      onLogout();
    }
    setProfileAnchorEl(null);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleGoToAccount = (accountName) => {
    console.log('Navigating to account:', accountName);
    // TODO: Navigate to account dashboard
  };

  const getFilteredAccounts = () => {
    let filtered = accounts;

    if (searchQuery) {
      filtered = filtered.filter(account =>
        account.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        account.status.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'contractEndDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Needs Pricing': return 'warning';
      case 'Pending Contract': return 'info';
      case 'Super Flagged': return 'error';
      default: return 'default';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'account_added': return <Add />;
      case 'manager_updated': return <Edit />;
      case 'contract_renewed': return <CheckCircle />;
      case 'status_changed': return <Info />;
      case 'commission_updated': return <AttachMoney />;
      default: return <Info />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'account_added': return 'success';
      case 'manager_updated': return 'info';
      case 'contract_renewed': return 'warning';
      case 'status_changed': return 'secondary';
      case 'commission_updated': return 'primary';
      default: return 'default';
    }
  };

  const filteredAccounts = getFilteredAccounts();

  return (
    <div className="manager-dashboard-container">
      <AppBar position="static" className="manager-dashboard-app-bar">
        <Toolbar sx={{
          minHeight: 72,
          padding: '0 24px',
          '@media (max-width: 1200px)': {
            flexWrap: 'wrap',
            minHeight: 80
          }
        }}>
          {/* Logo Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box
              sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => handleNavigation('home')}
            >
              <img src={kilowattImage} alt="Kilowatt" className="manager-dashboard-logo" />
              <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
                Kilowatt
              </Typography>
            </Box>
          </Box>

          {/* Navigation Buttons */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mr: 2,
            '@media (max-width: 900px)': {
              '& .MuiButton-root': {
                fontSize: '0.75rem',
                padding: '4px 8px',
                '& .MuiButton-startIcon': {
                  marginRight: '4px'
                }
              }
            },
            '@media (max-width: 768px)': {
              '& .MuiButton-root': {
                '& .MuiButton-startIcon': {
                  marginRight: 0
                },
                '& span:not(.MuiButton-startIcon)': {
                  display: 'none'
                }
              }
            }
          }}>
            <Button
              color="inherit"
              variant="contained"
              startIcon={<DashboardIcon />}
              onClick={() => handleNavigation('manager')}
              size="small"
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
            >
              Manager
            </Button>
            <Button
              color="inherit"
              startIcon={<EmailIcon />}
              onClick={() => handleNavigation('email-draft')}
              size="small"
            >
              Email Drafts
            </Button>
            <Button
              color="inherit"
              startIcon={<MoneyIcon />}
              onClick={() => handleNavigation('commission')}
              size="small"
            >
              Commission
            </Button>
            <Button
              color="inherit"
              startIcon={<Business />}
              onClick={() => handleNavigation('provider')}
              size="small"
            >
              Providers
            </Button>
            <Button
              color="inherit"
              startIcon={<HealthIcon />}
              onClick={() => handleNavigation('system-health')}
              size="small"
            >
              System Health
            </Button>
            <Button
              color="inherit"
              startIcon={<TaskIcon />}
              onClick={() => handleNavigation('task-queue')}
              size="small"
            >
              Task Queue
            </Button>
            <Button
              color="inherit"
              startIcon={<Business />}
              onClick={() => handleNavigation('accounts')}
              size="small"
            >
              Accounts
            </Button>
          </Box>

          {/* Search Bar */}
          <Box sx={{ mr: 2 }}>
            <TextField
              placeholder="Search managers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255,255,255,0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgba(255,255,255,0.7)',
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
                  <SearchIcon sx={{ color: 'rgba(255,255,255,0.7)', mr: 1 }} />
                ),
              }}
            />
          </Box>

          {/* Profile Button */}
          <Button
            color="inherit"
            className="manager-dashboard-profile-button"
            onClick={(e) => setProfileAnchorEl(e.currentTarget)}
            startIcon={<AccountCircle />}
          >
            {managerData.name}
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" className="manager-dashboard-content">
        <Box className="manager-dashboard-header">
          <Typography variant="h4" className="manager-dashboard-title">
            Manager Dashboard
          </Typography>
          <Typography variant="body1" className="manager-dashboard-subtitle">
            Manage accounts and track activity for {managerData.name}
          </Typography>
        </Box>

        {/* Profile Section */}
        <Card className="manager-dashboard-profile-section">
          <Box className="manager-dashboard-profile-header">
            <Avatar className="manager-dashboard-profile-avatar">
              <Person />
            </Avatar>
            <Box className="manager-dashboard-profile-info">
              <Typography variant="h5" className="manager-dashboard-profile-name">
                {managerData.name}
              </Typography>
              <Typography variant="body2" className="manager-dashboard-profile-role">
                {managerData.type === 'manager' ? 'Account Manager' : 'Management Company'}
              </Typography>
            </Box>
          </Box>
          <Grid container spacing={2} className="manager-dashboard-profile-details">
            <Grid item xs={12} sm={6} md={3}>
              <Box className="manager-dashboard-profile-detail">
                <Email className="manager-dashboard-profile-detail-icon" />
                <Typography className="manager-dashboard-profile-detail-text">
                  {managerData.email}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box className="manager-dashboard-profile-detail">
                <Phone className="manager-dashboard-profile-detail-icon" />
                <Typography className="manager-dashboard-profile-detail-text">
                  {managerData.phone}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box className="manager-dashboard-profile-detail">
                <Business className="manager-dashboard-profile-detail-icon" />
                <Typography className="manager-dashboard-profile-detail-text">
                  {managerData.company}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Card>

        {/* Statistics Cards */}
        <Grid container spacing={3} className="manager-dashboard-stats">
          <Grid item xs={12} sm={6} md={3}>
            <Card className="manager-dashboard-stat-card">
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
                  <Business className="manager-dashboard-stat-icon" color="primary" />
                  <Typography variant="h4" className="manager-dashboard-stat-value">
                    {summaryStats.totalActiveAccounts}
                  </Typography>
                  <Typography variant="body2" className="manager-dashboard-stat-label">
                    Active Accounts
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="manager-dashboard-stat-card">
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
                  <AttachMoney className="manager-dashboard-stat-icon" color="success" />
                  <Typography variant="h4" className="manager-dashboard-stat-value">
                    {summaryStats.totalEsiids}
                  </Typography>
                  <Typography variant="body2" className="manager-dashboard-stat-label">
                    Total ESIIDs
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="manager-dashboard-stat-card">
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
                  <AttachMoney className="manager-dashboard-stat-icon" color="warning" />
                  <Typography variant="h4" className="manager-dashboard-stat-value">
                    ${summaryStats.totalYtdCommissions.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" className="manager-dashboard-stat-label">
                    YTD Commissions
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="manager-dashboard-stat-card">
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
                  <Description className="manager-dashboard-stat-icon" color="info" />
                  <Typography variant="h4" className="manager-dashboard-stat-value">
                    {summaryStats.totalPendingContracts}
                  </Typography>
                  <Typography variant="body2" className="manager-dashboard-stat-label">
                    Pending Contracts
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          className="manager-dashboard-tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabs.map((tab, index) => (
            <Tab
              key={tab.id}
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  {tab.icon}
                  {tab.label}
                </Box>
              }
            />
          ))}
        </Tabs>

        {/* Tab Content */}
        {activeTab === 0 && (
          <Box>
            {/* Accounts Table */}
            <TableContainer component={Paper} className="manager-dashboard-table-container">
              <Table className="manager-dashboard-table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Button
                        onClick={() => handleSort('accountName')}
                        className="manager-dashboard-sort-button"
                        startIcon={<Sort />}
                      >
                        Account Name
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleSort('status')}
                        className="manager-dashboard-sort-button"
                        startIcon={<Sort />}
                      >
                        Status
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleSort('contractEndDate')}
                        className="manager-dashboard-sort-button"
                        startIcon={<Sort />}
                      >
                        Contract End Date
                      </Button>
                    </TableCell>
                    <TableCell>ESIIDs</TableCell>
                    <TableCell>Monthly Commission</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAccounts.map(account => (
                    <TableRow key={account.id}>
                      <TableCell>
                        <Button
                          onClick={() => handleGoToAccount(account.accountName)}
                          className="manager-dashboard-account-link"
                        >
                          {account.accountName}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={account.status}
                          color={getStatusColor(account.status)}
                          className="manager-dashboard-status-chip"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography className="manager-dashboard-contract-date">
                          {new Date(account.contractEndDate).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography className="manager-dashboard-esiid-count">
                          {account.esiids}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography className="manager-dashboard-commission-value">
                          ${account.monthlyCommission.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleGoToAccount(account.accountName)}
                            className="manager-dashboard-action-button"
                          >
                            View
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            className="manager-dashboard-action-button"
                          >
                            Edit
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {filteredAccounts.length === 0 && (
              <Box className="manager-dashboard-empty-state">
                <Business className="manager-dashboard-empty-icon" />
                <Typography variant="h6" className="manager-dashboard-empty-text">
                  No accounts found
                </Typography>
                <Typography variant="body2" className="manager-dashboard-empty-subtext">
                  {searchQuery ? 'Try adjusting your search criteria.' : 'No accounts are currently assigned to this manager.'}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            {/* Activity History */}
            <Card className="manager-dashboard-activity-section">
              <Typography variant="h6" className="manager-dashboard-activity-title">
                Recent Activity
              </Typography>
              <List>
                {activityHistory.map((activity, index) => (
                  <ListItem key={index} className="manager-dashboard-activity-item">
                    <Avatar
                      className={`manager-dashboard-activity-icon ${activity.type}`}
                      color={getActivityColor(activity.type)}
                    >
                      {getActivityIcon(activity.type)}
                    </Avatar>
                    <Box className="manager-dashboard-activity-content">
                      <Typography className="manager-dashboard-activity-action">
                        {activity.action}
                      </Typography>
                      <Typography className="manager-dashboard-activity-timestamp">
                        {activity.timestamp}
                      </Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Card>
          </Box>
        )}
      </Container>

      {/* Profile Menu */}
      <Menu
        anchorEl={profileAnchorEl}
        open={Boolean(profileAnchorEl)}
        onClose={() => setProfileAnchorEl(null)}
      >
        <MenuItem onClick={() => handleProfileAction('settings')} className="manager-dashboard-menu-item">
          Settings
        </MenuItem>
        <MenuItem onClick={() => handleProfileAction('logout')} className="manager-dashboard-menu-item">
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
};

export default ManagerDashboard; 