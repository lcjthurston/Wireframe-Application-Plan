import React, { useState, useRef, useEffect } from 'react';
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
  Badge,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress
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
  Error as ErrorIcon,
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  Memory as MemoryIcon,
  Speed as SpeedIcon,
  Storage as StorageIcon,
  NetworkCheck as NetworkIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import kilowattImage from '../assets/image.png';

const SystemHealthDashboard = ({ onLogout, onNavigate }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  // Mock system health summary
  const systemStats = {
    totalAutomations: 12,
    runningAutomations: 8,
    failedAutomations: 2,
    systemUptime: '99.8%',
    averageResponseTime: '1.2s',
    memoryUsage: '67%',
    cpuUsage: '45%',
    diskUsage: '78%'
  };

  // Mock automation systems
  const automationSystems = [
    {
      name: 'Email Monitoring System',
      status: 'running',
      lastRun: '2 minutes ago',
      nextRun: '5 minutes',
      successRate: '98.5%',
      description: 'Monitors email accounts for new messages and processes them automatically'
    },
    {
      name: 'Usage Data Retrieval',
      status: 'running',
      lastRun: '5 minutes ago',
      nextRun: '10 minutes',
      successRate: '99.2%',
      description: 'Retrieves usage data from Centerpoint and other providers'
    },
    {
      name: 'Pricing Import System',
      status: 'failed',
      lastRun: '1 hour ago',
      nextRun: 'Retry in 30 minutes',
      successRate: '85.3%',
      description: 'Imports daily pricing data from energy providers'
    },
    {
      name: 'Contract Follow-up Bot',
      status: 'running',
      lastRun: '15 minutes ago',
      nextRun: '1 hour',
      successRate: '96.8%',
      description: 'Automatically follows up on pending contracts'
    }
  ];

  // Mock system logs
  const systemLogs = [
    {
      timestamp: '2024-01-15 14:30:22',
      level: 'INFO',
      message: 'Email monitoring system started successfully',
      component: 'EmailMonitor'
    },
    {
      timestamp: '2024-01-15 14:29:15',
      level: 'ERROR',
      message: 'Failed to connect to pricing API - timeout',
      component: 'PricingImport'
    },
    {
      timestamp: '2024-01-15 14:28:45',
      level: 'WARNING',
      message: 'High memory usage detected (85%)',
      component: 'SystemMonitor'
    },
    {
      timestamp: '2024-01-15 14:27:30',
      level: 'INFO',
      message: 'Usage data retrieval completed - 150 records processed',
      component: 'UsageRetrieval'
    }
  ];

  // Mock performance metrics
  const performanceMetrics = [
    { name: 'CPU Usage', value: 45, unit: '%', color: 'primary' },
    { name: 'Memory Usage', value: 67, unit: '%', color: 'warning' },
    { name: 'Disk Usage', value: 78, unit: '%', color: 'error' },
    { name: 'Network I/O', value: 12, unit: 'MB/s', color: 'info' },
    { name: 'Database Connections', value: 24, unit: 'active', color: 'success' },
    { name: 'API Response Time', value: 1.2, unit: 's', color: 'primary' }
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'running':
        return 'success';
      case 'failed':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running':
        return <PlayIcon />;
      case 'failed':
        return <ErrorIcon />;
      case 'warning':
        return <WarningIcon />;
      default:
        return <StopIcon />;
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

  const MetricCard = styled(Card)(({ theme }) => ({
    textAlign: 'center',
    padding: theme.spacing(2),
    '& .MuiLinearProgress-root': {
      height: 8,
      borderRadius: 4,
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
            <Button color="inherit" variant="contained" sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
              System Health
            </Button>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 2 }}>
            <Paper component="form" onSubmit={handleSearch} sx={{ display: 'flex', alignItems: 'center', px: 2 }}>
              <TextField
                size="small"
                placeholder="Search automations, logs..."
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

            <IconButton onClick={onLogout} sx={{ color: 'inherit' }}>
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </StyledAppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            System Health Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor automation systems, performance metrics, and system logs
          </Typography>
        </Box>

        {/* System Health Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <HealthIcon sx={{ mr: 1, color: 'success.main' }} />
                  <Typography variant="h6">Total Automations</Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {systemStats.totalAutomations}
                </Typography>
              </CardContent>
            </DashboardCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PlayIcon sx={{ mr: 1, color: 'success.main' }} />
                  <Typography variant="h6">Running</Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                  {systemStats.runningAutomations}
                </Typography>
              </CardContent>
            </DashboardCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ErrorIcon sx={{ mr: 1, color: 'error.main' }} />
                  <Typography variant="h6">Failed</Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'error.main' }}>
                  {systemStats.failedAutomations}
                </Typography>
              </CardContent>
            </DashboardCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUpIcon sx={{ mr: 1, color: 'info.main' }} />
                  <Typography variant="h6">Uptime</Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                  {systemStats.systemUptime}
                </Typography>
              </CardContent>
            </DashboardCard>
          </Grid>
        </Grid>

        {/* Tabs for different sections */}
        <Paper sx={{ mb: 4 }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label="Automation Systems" />
            <Tab label="System Logs" />
            <Tab label="Performance Metrics" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        {activeTab === 0 && (
          <Grid container spacing={3}>
            {automationSystems.map((system, index) => (
              <Grid item xs={12} md={6} key={index}>
                <DashboardCard>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" component="h3">
                        {system.name}
                      </Typography>
                      <Chip
                        icon={getStatusIcon(system.status)}
                        label={system.status}
                        color={getStatusColor(system.status)}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {system.description}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Last Run
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {system.lastRun}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Next Run
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {system.nextRun}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Success Rate
                        </Typography>
                        <Typography variant="body1" fontWeight={600} color="success.main">
                          {system.successRate}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </DashboardCard>
              </Grid>
            ))}
          </Grid>
        )}

        {activeTab === 1 && (
          <DashboardCard>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Recent System Logs
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>Level</TableCell>
                      <TableCell>Component</TableCell>
                      <TableCell>Message</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {systemLogs.map((log, index) => (
                      <TableRow key={index}>
                        <TableCell>{log.timestamp}</TableCell>
                        <TableCell>
                          <Chip
                            label={log.level}
                            color={log.level === 'ERROR' ? 'error' : log.level === 'WARNING' ? 'warning' : 'success'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{log.component}</TableCell>
                        <TableCell>{log.message}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </DashboardCard>
        )}

        {activeTab === 2 && (
          <Grid container spacing={3}>
            {performanceMetrics.map((metric, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <MetricCard>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {metric.name === 'CPU Usage' && <SpeedIcon sx={{ mr: 1, color: 'primary.main' }} />}
                      {metric.name === 'Memory Usage' && <MemoryIcon sx={{ mr: 1, color: 'warning.main' }} />}
                      {metric.name === 'Disk Usage' && <StorageIcon sx={{ mr: 1, color: 'error.main' }} />}
                      {metric.name === 'Network I/O' && <NetworkIcon sx={{ mr: 1, color: 'info.main' }} />}
                      <Typography variant="h6">{metric.name}</Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      {metric.value}{metric.unit}
                    </Typography>
                    {metric.name.includes('Usage') && (
                      <LinearProgress
                        variant="determinate"
                        value={parseInt(metric.value)}
                        color={metric.color}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    )}
                  </CardContent>
                </MetricCard>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default SystemHealthDashboard; 