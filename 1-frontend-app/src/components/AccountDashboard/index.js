import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  IconButton,
  Grid,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  LinearProgress
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
  Visibility,
  AccountCircle,
  TrendingUp,
  AttachMoney,
  Business,
  Phone,
  Email,
  LocationOn,
  ElectricBolt
} from '@mui/icons-material';

const AccountDashboard = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  // Mock account data
  const mockAccounts = [
    {
      id: 1,
      accountName: 'Tech Solutions Inc',
      customerName: 'John Smith',
      email: 'john@techsolutions.com',
      phone: '(555) 123-4567',
      address: '123 Business Ave, Austin, TX',
      accountType: 'Commercial',
      status: 'Active',
      monthlyUsage: 15000,
      currentRate: 0.12,
      monthlyBill: 1800,
      contractStart: '2023-01-15',
      contractEnd: '2024-01-15',
      manager: 'Sarah Johnson',
      provider: 'Green Energy Solutions'
    },
    {
      id: 2,
      accountName: 'Downtown Restaurant',
      customerName: 'Maria Garcia',
      email: 'maria@downtown-restaurant.com',
      phone: '(555) 987-6543',
      address: '456 Main St, Dallas, TX',
      accountType: 'Commercial',
      status: 'Active',
      monthlyUsage: 8500,
      currentRate: 0.10,
      monthlyBill: 850,
      contractStart: '2023-06-01',
      contractEnd: '2024-06-01',
      manager: 'Mike Wilson',
      provider: 'PowerCorp Utilities'
    },
    {
      id: 3,
      accountName: 'Smith Residence',
      customerName: 'Robert Smith',
      email: 'robert.smith@email.com',
      phone: '(555) 456-7890',
      address: '789 Oak Lane, Houston, TX',
      accountType: 'Residential',
      status: 'Pending',
      monthlyUsage: 1200,
      currentRate: 0.08,
      monthlyBill: 96,
      contractStart: '2024-01-01',
      contractEnd: '2025-01-01',
      manager: 'John Smith',
      provider: 'Solar Dynamics'
    }
  ];

  React.useEffect(() => {
    setAccounts(mockAccounts);
  }, []);

  const getStatusChip = (status) => {
    const statusConfig = {
      'Active': { color: 'success', label: 'Active' },
      'Pending': { color: 'warning', label: 'Pending' },
      'Inactive': { color: 'error', label: 'Inactive' },
      'Suspended': { color: 'default', label: 'Suspended' }
    };

    const config = statusConfig[status] || statusConfig['Pending'];
    
    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        sx={{ fontWeight: 500 }}
      />
    );
  };

  const getAccountTypeChip = (type) => {
    const typeConfig = {
      'Residential': { color: 'primary', label: 'Residential' },
      'Commercial': { color: 'secondary', label: 'Commercial' },
      'Industrial': { color: 'info', label: 'Industrial' }
    };

    const config = typeConfig[type] || typeConfig['Residential'];
    
    return (
      <Chip
        label={config.label}
        color={config.color}
        variant="outlined"
        size="small"
      />
    );
  };

  const handleViewAccount = (account) => {
    setSelectedAccount(account);
    setDialogOpen(true);
  };

  const filteredAccounts = accounts.filter(account => {
    if (filter === 'all') return true;
    return account.status.toLowerCase() === filter.toLowerCase();
  });

  const accountStats = {
    total: accounts.length,
    active: accounts.filter(a => a.status === 'Active').length,
    totalUsage: accounts.reduce((sum, a) => sum + a.monthlyUsage, 0),
    totalRevenue: accounts.reduce((sum, a) => sum + a.monthlyBill, 0),
    avgRate: accounts.reduce((sum, a) => sum + a.currentRate, 0) / accounts.length || 0
  };

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Account Management Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {/* handle add account */}}
        >
          Add Account
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <AccountCircle sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {accountStats.total}
              </Typography>
              <Typography color="textSecondary">Total Accounts</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <TrendingUp sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'success.main' }}>
                {accountStats.active}
              </Typography>
              <Typography color="textSecondary">Active Accounts</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <ElectricBolt sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {(accountStats.totalUsage / 1000).toFixed(0)}K
              </Typography>
              <Typography color="textSecondary">Total kWh</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <AttachMoney sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                ${(accountStats.totalRevenue / 1000).toFixed(0)}K
              </Typography>
              <Typography color="textSecondary">Monthly Revenue</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            select
            label="Filter by Status"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="all">All Accounts</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>
        </Box>
      </Paper>

      {/* Accounts Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Account</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Usage (kWh)</TableCell>
                <TableCell>Rate</TableCell>
                <TableCell>Monthly Bill</TableCell>
                <TableCell>Manager</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAccounts.map((account) => (
                <TableRow key={account.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {account.accountName.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {account.accountName}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {account.customerName}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {getAccountTypeChip(account.accountType)}
                  </TableCell>
                  <TableCell>
                    {getStatusChip(account.status)}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {account.monthlyUsage.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      ${account.currentRate.toFixed(3)}/kWh
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      ${account.monthlyBill.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{account.manager}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton size="small" onClick={() => handleViewAccount(account)}>
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton size="small">
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small">
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Account Details Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Account Details: {selectedAccount?.accountName}
        </DialogTitle>
        <DialogContent>
          {selectedAccount && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Contact Information</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Phone fontSize="small" />
                      <Typography>{selectedAccount.phone}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Email fontSize="small" />
                      <Typography>{selectedAccount.email}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationOn fontSize="small" />
                      <Typography>{selectedAccount.address}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Account Details</Typography>
                    <Typography>Type: {selectedAccount.accountType}</Typography>
                    <Typography>Monthly Usage: {selectedAccount.monthlyUsage.toLocaleString()} kWh</Typography>
                    <Typography>Current Rate: ${selectedAccount.currentRate.toFixed(3)}/kWh</Typography>
                    <Typography>Monthly Bill: ${selectedAccount.monthlyBill.toLocaleString()}</Typography>
                    <Typography>Provider: {selectedAccount.provider}</Typography>
                    <Typography>Manager: {selectedAccount.manager}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
          <Button variant="contained">Edit Account</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccountDashboard; 
