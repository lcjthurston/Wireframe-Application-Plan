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
  FormControl,
  InputLabel,
  Select,
  Tabs,
  Tab,
  LinearProgress
} from '@mui/material';
import { 
  Edit, 
  Delete, 
  Add,
  Visibility,
  Person,
  TrendingUp,
  Assignment,
  AttachMoney,
  Phone,
  Email,
  Business
} from '@mui/icons-material';

const ManagerDashboard = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  // Mock manager data
  const mockManagers = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@kilowatt.com',
      phone: '(555) 123-4567',
      department: 'Sales',
      accountsCount: 45,
      totalCommissions: 12500,
      performanceScore: 92,
      status: 'Active',
      joinDate: '2023-01-15',
      performanceMetrics: {
        monthlyTarget: 50,
        achieved: 45,
        conversionRate: 78,
        avgDealSize: 2500
      }
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@kilowatt.com',
      phone: '(555) 987-6543',
      department: 'Operations',
      accountsCount: 67,
      totalCommissions: 18750,
      performanceScore: 88,
      status: 'Active',
      joinDate: '2022-08-20',
      performanceMetrics: {
        monthlyTarget: 60,
        achieved: 67,
        conversionRate: 85,
        avgDealSize: 2800
      }
    },
    {
      id: 3,
      name: 'Mike Wilson',
      email: 'mike.wilson@kilowatt.com',
      phone: '(555) 456-7890',
      department: 'Customer Success',
      accountsCount: 32,
      totalCommissions: 8900,
      performanceScore: 76,
      status: 'Training',
      joinDate: '2023-11-10',
      performanceMetrics: {
        monthlyTarget: 40,
        achieved: 32,
        conversionRate: 65,
        avgDealSize: 2200
      }
    }
  ];

  React.useEffect(() => {
    setManagers(mockManagers);
  }, []);

  const getStatusChip = (status) => {
    const statusConfig = {
      'Active': { color: 'success', label: 'Active' },
      'Training': { color: 'warning', label: 'Training' },
      'Inactive': { color: 'error', label: 'Inactive' },
      'On Leave': { color: 'default', label: 'On Leave' }
    };

    const config = statusConfig[status] || statusConfig['Active'];
    
    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        sx={{ fontWeight: 500 }}
      />
    );
  };

  const getDepartmentChip = (department) => {
    const deptConfig = {
      'Sales': { color: 'primary', label: 'Sales' },
      'Operations': { color: 'secondary', label: 'Operations' },
      'Customer Success': { color: 'info', label: 'Customer Success' },
      'Marketing': { color: 'warning', label: 'Marketing' }
    };

    const config = deptConfig[department] || deptConfig['Sales'];
    
    return (
      <Chip
        label={config.label}
        color={config.color}
        variant="outlined"
        size="small"
      />
    );
  };

  const handleViewManager = (manager) => {
    setSelectedManager(manager);
    setDialogOpen(true);
  };

  const filteredManagers = managers.filter(manager => {
    if (filter === 'all') return true;
    return manager.status.toLowerCase() === filter.toLowerCase();
  });

  const managerStats = {
    total: managers.length,
    active: managers.filter(m => m.status === 'Active').length,
    totalAccounts: managers.reduce((sum, m) => sum + m.accountsCount, 0),
    totalCommissions: managers.reduce((sum, m) => sum + m.totalCommissions, 0),
    avgPerformance: managers.reduce((sum, m) => sum + m.performanceScore, 0) / managers.length || 0
  };

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Manager Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {/* handle add manager */}}
        >
          Add Manager
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <Person sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {managerStats.total}
              </Typography>
              <Typography color="textSecondary">Total Managers</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <TrendingUp sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'success.main' }}>
                {managerStats.active}
              </Typography>
              <Typography color="textSecondary">Active Managers</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <Assignment sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {managerStats.totalAccounts}
              </Typography>
              <Typography color="textSecondary">Total Accounts</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <AttachMoney sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                ${(managerStats.totalCommissions / 1000).toFixed(0)}K
              </Typography>
              <Typography color="textSecondary">Total Commissions</Typography>
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
            <MenuItem value="all">All Managers</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="training">Training</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>
        </Box>
      </Paper>

      {/* Managers Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Manager</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Accounts</TableCell>
                <TableCell>Performance</TableCell>
                <TableCell>Commissions</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredManagers.map((manager) => (
                <TableRow key={manager.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {manager.name.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {manager.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {manager.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {getDepartmentChip(manager.department)}
                  </TableCell>
                  <TableCell>
                    {getStatusChip(manager.status)}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {manager.accountsCount}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={manager.performanceScore}
                        sx={{ width: 60, height: 6, borderRadius: 3 }}
                        color={manager.performanceScore >= 80 ? 'success' : 'warning'}
                      />
                      <Typography variant="body2">{manager.performanceScore}%</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      ${manager.totalCommissions.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton size="small" onClick={() => handleViewManager(manager)}>
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

      {/* Manager Details Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Manager Details: {selectedManager?.name}
        </DialogTitle>
        <DialogContent>
          {selectedManager && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Contact Information</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Phone fontSize="small" />
                      <Typography>{selectedManager.phone}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Email fontSize="small" />
                      <Typography>{selectedManager.email}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Business fontSize="small" />
                      <Typography>{selectedManager.department}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Performance Metrics</Typography>
                    <Typography>Monthly Target: {selectedManager.performanceMetrics.monthlyTarget}</Typography>
                    <Typography>Achieved: {selectedManager.performanceMetrics.achieved}</Typography>
                    <Typography>Conversion Rate: {selectedManager.performanceMetrics.conversionRate}%</Typography>
                    <Typography>Avg Deal Size: ${selectedManager.performanceMetrics.avgDealSize}</Typography>
                    <Typography>Performance Score: {selectedManager.performanceScore}%</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
          <Button variant="contained">Edit Manager</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManagerDashboard; 
