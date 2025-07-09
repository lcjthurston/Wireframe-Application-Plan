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
  Badge,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  FormControl,
  InputLabel,
  InputAdornment
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
  FilterList as FilterIcon,
  Sort as SortIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import kilowattImage from '../assets/image.png';
import './CommissionDashboard.scss';

const CommissionDashboard = ({ onLogout, onNavigate }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('accountName');
  const [sortDirection, setSortDirection] = useState('asc');

  // Mock commission data
  const commissionStats = {
    totalCommissions: 125000,
    pendingCommissions: 25000,
    paidCommissions: 100000,
    averageCommission: 5200,
    totalAccounts: 24,
    activeAccounts: 20
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

  return (
    <Box className="commission-dashboard">
      <AppBar position="static" className="commission-app-bar">
        <Toolbar className="commission-toolbar">
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <img src={kilowattImage} alt="Kilowatt" className="commission-logo" />
            <Typography variant="h6" component="div" className="commission-brand">
              Kilowatt
            </Typography>
          </Box>

          <Box className="commission-search-container">
            <TextField
              placeholder="Search commissions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              variant="outlined"
              size="small"
              className="commission-search-field"
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                ),
              }}
            />
          </Box>

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
          <Tab label="Commission History" />
          <Tab label="Payment History" />
          <Tab label="Analytics" />
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
                  onClick={() => handleSort('paymentStatus')}
                  className="commission-sort-button"
                >
                  Sort by Status
                </Button>
              </Box>
            </Paper>

            <TableContainer className="commission-table-container">
              <Table className="commission-table">
                <TableHead>
                  <TableRow>
                    <TableCell>Account</TableCell>
                    <TableCell>Manager</TableCell>
                    <TableCell>Commission Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Payment Date</TableCell>
                    <TableCell>Contract Type</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCommissions.map((commission) => (
                    <TableRow key={commission.id}>
                      <TableCell>{commission.accountName}</TableCell>
                      <TableCell>{commission.manager}</TableCell>
                      <TableCell>
                        <Typography className="commission-amount">
                          ${commission.commissionAmount.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={commission.paymentStatus}
                          color={getStatusColor(commission.paymentStatus)}
                          size="small"
                          className={`commission-status-chip ${getStatusClass(commission.paymentStatus)}`}
                        />
                      </TableCell>
                      <TableCell>
                        {commission.paymentDate || 'Pending'}
                      </TableCell>
                      <TableCell>{commission.contractType}</TableCell>
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
                  <TableCell>Payment Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Account</TableCell>
                  <TableCell>Method</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Reference</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paymentHistory.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.paymentDate}</TableCell>
                    <TableCell>
                      <Typography className="commission-amount">
                        ${payment.amount.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>{payment.account}</TableCell>
                    <TableCell>
                      <Typography className="commission-payment-method">
                        {payment.method}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography className={`commission-payment-status ${getPaymentStatusClass(payment.status)}`}>
                        {payment.status}
                      </Typography>
                    </TableCell>
                    <TableCell>{payment.reference}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handlePaymentAction('view', payment.id)}
                        className="commission-action-button"
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {activeTab === 2 && (
          <Box className="commission-chart-container">
            <Typography variant="h6" className="commission-chart-title">
              Commission Analytics
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Charts and analytics will be displayed here
            </Typography>
          </Box>
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