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
  Container,
  TextField,
  InputAdornment
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
  Search as SearchIcon,
  Add as AddIcon
} from '@mui/icons-material';
import NavBar from '../shared/NavBar';
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
    <Box className="commission-dashboard" sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <NavBar
        onNavigate={onNavigate}
        onProfileMenuOpen={onLogout}
        userProfile={{ name: 'Profile' }}
        currentPage="commissions"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Commission Dashboard
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => onNavigate('addCommission')}
            size="large"
            sx={{
              background: 'linear-gradient(135deg, #C82828 0%, #B71C1C 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #B71C1C 0%, #A01818 100%)'
              }
            }}
          >
            Add Commission
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <MoneyIcon sx={{ fontSize: 40, color: '#C82828', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  ${commissionStats.totalCommissions.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Commissions
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <TrendingUpIcon sx={{ fontSize: 40, color: '#FF9800', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  ${commissionStats.pendingCommissions.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending Commissions
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <VisibilityIcon sx={{ fontSize: 40, color: '#4CAF50', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  ${commissionStats.averageCommission.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Average Commission
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <BusinessIcon sx={{ fontSize: 40, color: '#2196F3', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {commissionStats.activeAccounts}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Accounts
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search and Filters */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            fullWidth
            placeholder="Search commissions by account, REP, or amount..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 600 }}
          />

          <FormControl size="small" sx={{ minWidth: 150 }}>
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
        </Box>

        {/* Commission Tabs */}
        <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={activeTab}
              onChange={(event, newValue) => setActiveTab(newValue)}
              aria-label="commission tabs"
            >
              <Tab label="Account Overview" icon={<BusinessIcon />} />
              <Tab label="Energy Rep Overview" icon={<TrendingUpIcon />} />
              <Tab label="Projected vs Received Report" icon={<VisibilityIcon />} />
            </Tabs>
          </Box>

          <CardContent sx={{ p: 3 }}>
            {activeTab === 0 && (
              <Box>
                {/* Action Buttons */}
                <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    size="small"
                  >
                    Export Data
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<SortIcon />}
                    onClick={() => handleSort('commissionAmount')}
                    size="small"
                  >
                    Sort by Amount
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<SortIcon />}
                    onClick={() => handleSort('contractExpiration')}
                    size="small"
                  >
                    Sort by Expiration
                  </Button>
                </Box>

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
              </Box>
            )}

        {activeTab === 1 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Energy Rep Performance Overview
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Rep Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Projected Commissions</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Received Commissions</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Variance</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Performance</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
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
          </Box>
        )}

        {activeTab === 2 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Projected vs Received Report
            </Typography>

            {/* Filters */}
            <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
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

              <FormControl size="small" sx={{ minWidth: 150 }}>
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
                size="small"
              >
                Export Report
              </Button>
            </Box>

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
          </Box>
        )}

        {filteredCommissions.length === 0 && activeTab === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <MoneyIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No commission data found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your filters or search terms
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  </Container>
</Box>
  );
};

export default CommissionDashboard; 
