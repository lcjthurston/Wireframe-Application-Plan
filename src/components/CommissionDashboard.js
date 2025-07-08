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
import { styled } from '@mui/material/styles';
import kilowattImage from '../assets/image.png';

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

    if (searchQuery) {
      filtered = filtered.filter(commission =>
        commission.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        commission.manager.toLowerCase().includes(searchQuery.toLowerCase()) ||
        commission.paymentStatus.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

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

  const filteredCommissions = getFilteredCommissions();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
      case 'Completed':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Failed':
      case 'Cancelled':
        return 'error';
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
            <Button color="inherit" variant="contained" sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
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
                placeholder="Search commissions..."
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
            Commission Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track commissions, payments, and financial performance
          </Typography>
        </Box>

        {/* Period Selector */}
        <Box sx={{ mb: 4 }}>
          <FormControl sx={{ minWidth: 200 }}>
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

        {/* Commission Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <MoneyIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Total Commissions</Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  ${commissionStats.totalCommissions.toLocaleString()}
                </Typography>
              </CardContent>
            </DashboardCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <WarningIcon sx={{ mr: 1, color: 'warning.main' }} />
                  <Typography variant="h6">Pending</Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                  ${commissionStats.pendingCommissions.toLocaleString()}
                </Typography>
              </CardContent>
            </DashboardCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CheckCircleIcon sx={{ mr: 1, color: 'success.main' }} />
                  <Typography variant="h6">Paid</Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                  ${commissionStats.paidCommissions.toLocaleString()}
                </Typography>
              </CardContent>
            </DashboardCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUpIcon sx={{ mr: 1, color: 'info.main' }} />
                  <Typography variant="h6">Average</Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                  ${commissionStats.averageCommission.toLocaleString()}
                </Typography>
              </CardContent>
            </DashboardCard>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Paper sx={{ mb: 4 }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label="Commission Overview" />
            <Tab label="Payment History" />
            <Tab label="Reports" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        {activeTab === 0 && (
          <DashboardCard>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Commission History</Typography>
                <Button variant="outlined" startIcon={<DownloadIcon />}>
                  Export
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Button
                          startIcon={<SortIcon />}
                          onClick={() => handleSort('accountName')}
                          sx={{ textTransform: 'none' }}
                        >
                          Account Name
                        </Button>
                      </TableCell>
                      <TableCell>Manager</TableCell>
                      <TableCell>
                        <Button
                          startIcon={<SortIcon />}
                          onClick={() => handleSort('commissionAmount')}
                          sx={{ textTransform: 'none' }}
                        >
                          Commission Amount
                        </Button>
                      </TableCell>
                      <TableCell>Payment Status</TableCell>
                      <TableCell>Payment Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredCommissions.map((commission) => (
                      <TableRow key={commission.id}>
                        <TableCell>
                          <Typography variant="body1" fontWeight={600}>
                            {commission.accountName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {commission.contractType} • {commission.esiidCount} ESIIDs
                          </Typography>
                        </TableCell>
                        <TableCell>{commission.manager}</TableCell>
                        <TableCell>
                          <Typography variant="body1" fontWeight={600}>
                            ${commission.commissionAmount.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={commission.paymentStatus}
                            color={getStatusColor(commission.paymentStatus)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {commission.paymentDate ? commission.paymentDate : 'Pending'}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton size="small" onClick={() => handleCommissionAction('view', commission.id)}>
                              <VisibilityIcon />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleCommissionAction('edit', commission.id)}>
                              <EditIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </DashboardCard>
        )}

        {activeTab === 1 && (
          <DashboardCard>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Payment History
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Payment Date</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Account</TableCell>
                      <TableCell>Method</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Reference</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paymentHistory.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{payment.paymentDate}</TableCell>
                        <TableCell>
                          <Typography variant="body1" fontWeight={600}>
                            ${payment.amount.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>{payment.account}</TableCell>
                        <TableCell>{payment.method}</TableCell>
                        <TableCell>
                          <Chip
                            label={payment.status}
                            color={getStatusColor(payment.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{payment.reference}</TableCell>
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
            <Grid item xs={12} md={6}>
              <DashboardCard>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Commission Summary Report
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Detailed breakdown of commissions by period, manager, and account type.
                  </Typography>
                  <Button variant="outlined" sx={{ mt: 2 }} startIcon={<DownloadIcon />}>
                    Download Report
                  </Button>
                </CardContent>
              </DashboardCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <DashboardCard>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Payment Analysis
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Analysis of payment trends, methods, and processing times.
                  </Typography>
                  <Button variant="outlined" sx={{ mt: 2 }} startIcon={<DownloadIcon />}>
                    Download Report
                  </Button>
                </CardContent>
              </DashboardCard>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default CommissionDashboard; 