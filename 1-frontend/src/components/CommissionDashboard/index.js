import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Grid,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  AppBar,
  Toolbar,
  Container,
  TextField
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Download as DownloadIcon,
  Sort as SortIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  AccountCircle as AccountIcon,
  Dashboard as DashboardIcon,
  Email as EmailIcon,
  AttachMoney as MoneyIcon,
  Business as BusinessIcon,
  HealthAndSafety as HealthIcon,
  Assignment as TaskIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import kilowattImage from '../../assets/image.png';
import './CommissionDashboard.scss';

const CommissionDashboard = ({ onLogout, onNavigate }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('accountName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedRep, setSelectedRep] = useState('all');
  const [dateRange, setDateRange] = useState('current-month');
  const [commissions, setCommissions] = useState([]);
  const [commissionStats, setCommissionStats] = useState({
    totalCommissions: 0,
    pendingCommissions: 0,
    paidCommissions: 0,
    averageCommission: 0,
    totalAccounts: 0,
    activeAccounts: 0
  });

  // Load real commission data
  useEffect(() => {
    const loadCommissionData = async () => {
      try {
        // Import the real commission data
        const commissionsData = await import('../../data/commissions.json');
        const realCommissions = commissionsData.default || commissionsData;

        console.log(`📊 Loaded ${realCommissions.length} real commissions from database`);
        setCommissions(realCommissions);

        // Load statistics
        const statsData = await import('../../data/commission-stats.json');
        const realStats = statsData.default || statsData;

        // Map real stats to expected format
        setCommissionStats({
          totalCommissions: realStats.totalReceivedAmount || 0,
          pendingCommissions: (realStats.scheduledCount || 0) * 1000, // Estimate
          paidCommissions: realStats.totalReceivedAmount || 0,
          averageCommission: realStats.avgReceivedAmount || 0,
          totalAccounts: realStats.totalCommissions || 0,
          activeAccounts: realStats.activeSchedules || 0
        });

      } catch (error) {
        console.error('❌ Error loading commission data:', error);

        // Fallback to sample data if import fails
        const fallbackCommissions = [
          {
            id: 1,
            accountName: 'Sample Account',
            kRep: 'Sample REP',
            commissionType: 'received',
            actualPaymentAmount: 1000,
            status: 'paid'
          }
        ];
        setCommissions(fallbackCommissions);
      }
    };

    loadCommissionData();
  }, []);

  // Energy Rep Overview data - derived from real commission stats
  const [energyRepData, setEnergyRepData] = useState([]);

  // Process commission data to create energy rep overview
  useEffect(() => {
    const loadEnergyRepData = async () => {
      try {
        const statsData = await import('../../data/commission-stats.json');
        const realStats = statsData.default || statsData;

        if (realStats.topReps) {
          const repData = realStats.topReps.slice(0, 6).map((rep, index) => ({
            id: index + 1,
            name: rep.rep,
            projectedCommissions: rep.totalAmount * 1.2, // Estimate projected as 20% higher
            receivedCommissions: rep.totalAmount,
            variance: rep.totalAmount * 0.2,
            performance: Math.min(95, 85 + (rep.commissionCount / 10)) // Performance based on commission count
          }));
          setEnergyRepData(repData);
        }
      } catch (error) {
        console.error('❌ Error loading energy rep data:', error);
        // Fallback data
        setEnergyRepData([
          {
            id: 1,
            name: 'Sample REP',
            projectedCommissions: 45000,
            receivedCommissions: 42000,
            variance: -3000,
            performance: 93
          }]);
      }
    };

    loadEnergyRepData();
  }, [commissions]);

  // Projected vs Received summary - calculated from real data
  const projectedVsReceived = {
    totalProjected: energyRepData.reduce((sum, rep) => sum + rep.projectedCommissions, 0),
    totalReceived: energyRepData.reduce((sum, rep) => sum + rep.receivedCommissions, 0),
    variance: energyRepData.reduce((sum, rep) => sum + rep.variance, 0)
  };

  const commissionHistory = [
    {
      id: 1,
      accountName: 'ABC Corporation',
      manager: 'Sarah Johnson',
      commissionAmount: 5200,
      paymentStatus: 'Paid',
      paymentDate: '2024-01-15',
      contractType: 'Standard',
      esiidCount: 2,
      usageKwh: 45000
    },
    {
      id: 2,
      accountName: 'XYZ Industries',
      manager: 'Sarah Johnson',
      commissionAmount: 3800,
      paymentStatus: 'Pending',
      paymentDate: null,
      contractType: 'Premium',
      esiidCount: 1,
      usageKwh: 32000
    },
    {
      id: 3,
      accountName: 'Main Street Plaza',
      manager: 'Sarah Johnson',
      commissionAmount: 7200,
      paymentStatus: 'Paid',
      paymentDate: '2024-01-10',
      contractType: 'Standard',
      esiidCount: 3,
      usageKwh: 68000
    },
    {
      id: 4,
      accountName: 'Downtown Center',
      manager: 'Sarah Johnson',
      commissionAmount: 4500,
      paymentStatus: 'Pending',
      paymentDate: null,
      contractType: 'Standard',
      esiidCount: 2,
      usageKwh: 38000
    },
    {
      id: 5,
      accountName: 'Tech Park LLC',
      manager: 'Sarah Johnson',
      commissionAmount: 3100,
      paymentStatus: 'Paid',
      paymentDate: '2024-01-05',
      contractType: 'Premium',
      esiidCount: 1,
      usageKwh: 28000
    }
  ];

  const paymentHistory = [
    {
      id: 1,
      paymentDate: '2024-01-15',
      amount: 5200,
      account: 'ABC Corporation',
      method: 'Direct Deposit',
      status: 'Completed',
      reference: 'PAY-2024-001'
    },
    {
      id: 2,
      paymentDate: '2024-01-10',
      amount: 7200,
      account: 'Main Street Plaza',
      method: 'Check',
      status: 'Completed',
      reference: 'PAY-2024-002'
    },
    {
      id: 3,
      paymentDate: '2024-01-05',
      amount: 3100,
      account: 'Tech Park LLC',
      method: 'Direct Deposit',
      status: 'Completed',
      reference: 'PAY-2024-003'
    },
    {
      id: 4,
      paymentDate: '2024-01-20',
      amount: 25000,
      account: 'Bulk Payment',
      method: 'Wire Transfer',
      status: 'Pending',
      reference: 'PAY-2024-004'
    }
  ];

  const periodOptions = [
    { value: 'current-month', label: 'Current Month' },
    { value: 'last-month', label: 'Last Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
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

  const handleCommissionAction = (action, commissionId) => {
    console.log('Commission action:', action, 'for commission:', commissionId);
  };

  const handlePaymentAction = (action, paymentId) => {
    console.log('Payment action:', action, 'for payment:', paymentId);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getFilteredCommissions = () => {
    let filtered = commissionHistory;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(commission =>
        commission.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        commission.manager.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'commissionAmount') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
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
      case 'Paid':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Paid':
        return 'commission-status-paid';
      case 'Pending':
        return 'commission-status-pending';
      case 'Overdue':
        return 'commission-status-overdue';
      default:
        return '';
    }
  };

  const getPaymentStatusClass = (status) => {
    switch (status) {
      case 'Completed':
        return 'commission-payment-completed';
      case 'Pending':
        return 'commission-payment-pending';
      case 'Failed':
        return 'commission-payment-failed';
      default:
        return '';
    }
  };

  const filteredCommissions = getFilteredCommissions();

  const mockManagers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      company: 'Property Management Inc.',
      email: 'sarah.johnson@propmanage.com',
      phone: '(713) 555-0123',
      address: '123 Business Rd, Suite 500, Houston, TX 77001'
    },
    {
      id: 2,
      name: 'Michael Chen',
      company: 'Elite Property Solutions',
      email: 'michael.chen@eliteprop.com',
      phone: '(713) 555-0456',
      address: '456 Commerce St, Floor 12, Houston, TX 77002'
    },
    {
      id: 3,
      name: 'Jennifer Martinez',
      company: 'Skyline Management Group',
      email: 'j.martinez@skylinegroup.com',
      phone: '(281) 555-0789',
      address: '789 Tower Blvd, Suite 300, Sugar Land, TX 77478'
    },
    {
      id: 4,
      name: 'David Thompson',
      company: 'Metro Property Services',
      email: 'david.thompson@metroprop.com',
      phone: '(832) 555-0321',
      address: '321 Main Street, Suite 150, The Woodlands, TX 77380'
    },
    {
      id: 5,
      name: 'Lisa Rodriguez',
      company: 'Premier Realty Management',
      email: 'lisa.rodriguez@premierrealty.com',
      phone: '(713) 555-0654',
      address: '654 Park Avenue, Suite 200, Houston, TX 77019'
    },
    {
      id: 6,
      name: 'Robert Kim',
      company: 'Coastal Property Partners',
      email: 'robert.kim@coastalpartners.com',
      phone: '(409) 555-0987',
      address: '987 Bay Street, Suite 400, Galveston, TX 77550'
    }
  ];

  return (
    <Box className="commission-dashboard">
      <AppBar position="static" className="commission-app-bar">
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
              <img src={kilowattImage} alt="Kilowatt" className="commission-logo" />
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
              startIcon={<DashboardIcon />}
              onClick={() => handleNavigation('manager')}
              size="small"
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
              variant="contained"
              startIcon={<MoneyIcon />}
              onClick={() => handleNavigation('commission')}
              size="small"
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
            >
              Commission
            </Button>
            <Button
              color="inherit"
              startIcon={<BusinessIcon />}
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
              startIcon={<BusinessIcon />}
              onClick={() => handleNavigation('accounts')}
              size="small"
            >
              Accounts
            </Button>
          </Box>

          {/* Search Bar */}
          <Box sx={{ mr: 2 }}>
            <TextField
              placeholder="Search commissions..."
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
            onClick={() => handleNavigation('home')}
            className="commission-profile-button"
            startIcon={<AccountIcon />}
          >
            Profile
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" className="commission-content">
        <Box className="commission-header">
          <Typography variant="h4" className="commission-title">
            Commission Dashboard
          </Typography>
          <Typography variant="body1" className="commission-subtitle">
            Track and manage commission payments and earnings
          </Typography>
        </Box>

        <Grid container spacing={3} className="commission-stats">
          <Grid item xs={12} sm={6} md={3}>
            <Card className="commission-stat-card">
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h3" className="commission-stat-value">
                  ${commissionStats.totalCommissions.toLocaleString()}
                </Typography>
                <Typography variant="body2" className="commission-stat-label">
                  Total Commissions
                </Typography>
                <Typography variant="h2" className="commission-stat-icon">
                  💰
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="commission-stat-card">
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h3" className="commission-stat-value">
                  ${commissionStats.pendingCommissions.toLocaleString()}
                </Typography>
                <Typography variant="body2" className="commission-stat-label">
                  Pending Commissions
                </Typography>
                <Typography variant="h2" className="commission-stat-icon">
                  ⏳
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="commission-stat-card">
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h3" className="commission-stat-value">
                  ${commissionStats.averageCommission.toLocaleString()}
                </Typography>
                <Typography variant="body2" className="commission-stat-label">
                  Average Commission
                </Typography>
                <Typography variant="h2" className="commission-stat-icon">
                  📊
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="commission-stat-card">
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h3" className="commission-stat-value">
                  {commissionStats.activeAccounts}
                </Typography>
                <Typography variant="body2" className="commission-stat-label">
                  Active Accounts
                </Typography>
                <Typography variant="h2" className="commission-stat-icon">
                  🏢
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <FormControl className="commission-period-selector">
          <InputLabel>Select Period</InputLabel>
          <Select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            label="Select Period"
          >
            {periodOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          className="commission-tabs"
        >
          <Tab label="Account Overview" />
          <Tab label="Energy Rep Overview" />
          <Tab label="Projected vs Received Report" />
        </Tabs>

        {activeTab === 0 && (
          <>
            <Paper className="commission-filters">
              <Box className="commission-filter-row">
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  className="commission-export-button"
                >
                  Export Data
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<SortIcon />}
                  onClick={() => handleSort('commissionAmount')}
                  className="commission-sort-button"
                >
                  Sort by Amount
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<SortIcon />}
                  onClick={() => handleSort('contractExpiration')}
                  className="commission-sort-button"
                >
                  Sort by Expiration
                </Button>
              </Box>
            </Paper>

            <TableContainer className="commission-table-container">
              <Table className="commission-table">
                <TableHead>
                  <TableRow>
                    <TableCell>Account Name</TableCell>
                    <TableCell>Manager</TableCell>
                    <TableCell>Rep</TableCell>
                    <TableCell>Commission Amount</TableCell>
                    <TableCell>Contract Expiration</TableCell>
                    <TableCell>ESIID Count</TableCell>
                    <TableCell>Usage (kWh)</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCommissions.map((commission) => (
                    <TableRow key={commission.id}>
                      <TableCell>{commission.accountName}</TableCell>
                      <TableCell>{commission.manager}</TableCell>
                      <TableCell>{commission.rep || 'PowerGrid Solutions'}</TableCell>
                      <TableCell>
                        <Typography className="commission-amount">
                          ${commission.commissionAmount.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>{commission.contractExpiration || '12/31/2024'}</TableCell>
                      <TableCell>{commission.esiidCount}</TableCell>
                      <TableCell>{commission.usageKwh.toLocaleString()}</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={() => handleCommissionAction('view', commission.id)}
                          className="commission-action-button"
                        >
                          View
                        </Button>
                        <Button
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => handleCommissionAction('edit', commission.id)}
                          className="commission-action-button"
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {activeTab === 1 && (
          <TableContainer className="commission-table-container">
            <Table className="commission-table">
              <TableHead>
                <TableRow>
                  <TableCell>Rep Name</TableCell>
                  <TableCell>Projected Commissions</TableCell>
                  <TableCell>Received Commissions</TableCell>
                  <TableCell>Variance</TableCell>
                  <TableCell>Performance</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {energyRepData.map((rep) => (
                  <TableRow key={rep.id}>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="medium">
                        {rep.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography className="commission-amount">
                        ${rep.projectedCommissions.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography className="commission-amount">
                        ${rep.receivedCommissions.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography 
                        color={rep.variance >= 0 ? 'success.main' : 'error.main'}
                        fontWeight="medium"
                      >
                        ${Math.abs(rep.variance).toLocaleString()} 
                        {rep.variance >= 0 ? ' over' : ' under'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${rep.performance}%`}
                        color={rep.performance >= 100 ? 'success' : rep.performance >= 80 ? 'warning' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => console.log('View rep details', rep.id)}
                        className="commission-action-button"
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {activeTab === 2 && (
          <>
            <Paper className="commission-filters">
              <Box className="commission-filter-row">
                <FormControl className="commission-filter-item">
                  <InputLabel>Filter by Rep</InputLabel>
                  <Select
                    value={selectedRep}
                    onChange={(e) => setSelectedRep(e.target.value)}
                    label="Filter by Rep"
                  >
                    <MenuItem value="all">All Reps</MenuItem>
                    <MenuItem value="powergrid">PowerGrid Solutions</MenuItem>
                    <MenuItem value="energyconnect">Energy Connect Corp</MenuItem>
                    <MenuItem value="volt">Volt Energy Partners</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl className="commission-filter-item">
                  <InputLabel>Date Range</InputLabel>
                  <Select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    label="Date Range"
                  >
                    <MenuItem value="current-month">Current Month</MenuItem>
                    <MenuItem value="last-month">Last Month</MenuItem>
                    <MenuItem value="quarter">This Quarter</MenuItem>
                    <MenuItem value="year">This Year</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  className="commission-export-button"
                >
                  Export Report
                </Button>
              </Box>
            </Paper>

            <Box className="commission-chart-container">
              <Typography variant="h6" className="commission-chart-title">
                Projected vs Received Commission Analysis
              </Typography>
              
              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} md={4}>
                  <Card className="commission-summary-card">
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="primary.main" sx={{ fontWeight: 700 }}>
                        ${projectedVsReceived.totalProjected.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Projected
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Card className="commission-summary-card">
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="success.main" sx={{ fontWeight: 700 }}>
                        ${projectedVsReceived.totalReceived.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Received
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Card className="commission-summary-card">
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography 
                        variant="h4" 
                        color={projectedVsReceived.variance >= 0 ? 'success.main' : 'error.main'}
                        sx={{ fontWeight: 700 }}
                      >
                        {projectedVsReceived.variance >= 0 ? '+' : ''}${projectedVsReceived.variance.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Variance
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Typography variant="body1" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
                Detailed charts and analytics will be displayed here
              </Typography>
            </Box>
          </>
        )}

        {filteredCommissions.length === 0 && activeTab === 0 && (
          <Box className="commission-empty-state">
            <Typography className="commission-empty-icon">
              💰
            </Typography>
            <Typography variant="h6" className="commission-empty-text">
              No commission data found
            </Typography>
            <Typography variant="body2" className="commission-empty-subtext">
              Try adjusting your filters or search terms
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default CommissionDashboard; 
