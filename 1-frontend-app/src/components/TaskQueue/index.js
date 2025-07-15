import React, { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  Grid,
  Chip,
  Avatar,
  IconButton,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress
} from '@mui/material';
import {
  Refresh,
  ArrowBack,
  Assignment,
  PlayArrow,
  Schedule,
  CheckCircle,
  Error,
  Search,
  Pause,
  Stop,
  Delete
} from '@mui/icons-material';
import kilowattImage from '../../assets/image.png';
import NavBar from '../shared/NavBar';

const TaskQueue = ({ onLogout, onNavigate }) => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Tasks');
  const [filteredTasks, setFilteredTasks] = useState([]);

  useEffect(() => {
    const mockTasks = [
      {
        id: 1,
        name: 'Process Energy Bills',
        description: 'Processing monthly energy bills for commercial accounts',
        type: 'Billing',
        status: 'Running',
        priority: 'High',
        progress: 75,
        assignedTo: 'System',
        startTime: '1/15/2024, 9:00:00 AM'
      },
      {
        id: 2,
        name: 'Generate Commission Reports',
        description: 'Generate commission reports for sales team',
        type: 'Reporting',
        status: 'Queued',
        priority: 'Medium',
        progress: 0,
        assignedTo: 'Sarah Johnson',
        startTime: 'Not started'
      },
      {
        id: 3,
        name: 'Update Customer Database',
        description: 'Update customer information and contact details',
        type: 'Data Management',
        status: 'Completed',
        priority: 'Low',
        progress: 100,
        assignedTo: 'Mike Wilson',
        startTime: '1/15/2024, 8:00:00 AM'
      },
      {
        id: 4,
        name: 'Send Monthly Invoices',
        description: 'Send monthly invoices to all active customers',
        type: 'Billing',
        status: 'Failed',
        priority: 'High',
        progress: 25,
        assignedTo: 'System',
        startTime: '1/15/2024, 7:30:00 AM'
      }
    ];
    setTasks(mockTasks);
    setFilteredTasks(mockTasks);
  }, []);

  // Filter tasks
  useEffect(() => {
    let filtered = tasks;
    
    if (statusFilter !== 'All Tasks') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredTasks(filtered);
  }, [tasks, statusFilter, searchTerm]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Running': return 'warning';
      case 'Queued': return 'info';
      case 'Completed': return 'success';
      case 'Failed': return 'error';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Running': return <PlayArrow />;
      case 'Queued': return <Schedule />;
      case 'Completed': return <CheckCircle />;
      case 'Failed': return <Error />;
      default: return <Assignment />;
    }
  };

  const totalTasks = tasks.length;
  const runningTasks = tasks.filter(t => t.status === 'Running').length;
  const queuedTasks = tasks.filter(t => t.status === 'Queued').length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const failedTasks = tasks.filter(t => t.status === 'Failed').length;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <NavBar 
        onNavigate={onNavigate}
        onProfileMenuOpen={onLogout}
        userProfile={{ name: 'Profile' }}
        currentPage="task-queue"
        searchQuery=""
        setSearchQuery={() => {}}
      />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Task Queue Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={() => window.location.reload()}
            size="large"
            sx={{ 
              background: 'linear-gradient(135deg, #C82828 0%, #B71C1C 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #B71C1C 0%, #A01818 100%)'
              }
            }}
          >
            Refresh Queue
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Assignment sx={{ fontSize: 40, color: '#C82828', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {totalTasks}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Tasks
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <PlayArrow sx={{ fontSize: 40, color: '#FF9800', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {runningTasks}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Running
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Schedule sx={{ fontSize: 40, color: '#2196F3', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {queuedTasks}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Queued
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <CheckCircle sx={{ fontSize: 40, color: '#4CAF50', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {completedTasks}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Error sx={{ fontSize: 40, color: '#f44336', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {failedTasks}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Failed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', mb: 3 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Filter by Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Filter by Status"
                    onChange={(e) => setStatusFilter(e.target.value)}
                    sx={{ borderRadius: 3 }}
                  >
                    <MenuItem value="All Tasks">All Tasks</MenuItem>
                    <MenuItem value="Running">Running</MenuItem>
                    <MenuItem value="Queued">Queued</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="Failed">Failed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Tasks Table */}
        <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <CardContent>
            <TableContainer 
              component={Paper} 
              variant="outlined"
              sx={{ 
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}
            >
              <Table>
                <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: '#333' }}>Task</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333' }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333' }}>Priority</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333' }}>Progress</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333' }}>Assigned To</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333' }}>Start Time</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTasks.map((task) => (
                    <TableRow 
                      key={task.id}
                      hover
                      sx={{ 
                        '&:hover': {
                          backgroundColor: '#f8f9fa'
                        }
                      }}
                    >
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="medium">
                            {task.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {task.description}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{task.type}</TableCell>
                      <TableCell>
                        <Chip 
                          icon={getStatusIcon(task.status)}
                          label={task.status} 
                          color={getStatusColor(task.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={task.priority} 
                          color={getPriorityColor(task.priority)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 120 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={task.progress} 
                            sx={{ 
                              flexGrow: 1, 
                              mr: 1,
                              height: 8,
                              borderRadius: 4
                            }} 
                          />
                          <Typography variant="body2" sx={{ minWidth: 35 }}>
                            {task.progress}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              mr: 1, 
                              bgcolor: '#C82828',
                              width: 32,
                              height: 32,
                              fontSize: '0.875rem'
                            }}
                          >
                            {task.assignedTo.charAt(0)}
                          </Avatar>
                          <Typography variant="body2">
                            {task.assignedTo}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {task.startTime}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton size="small" color="primary">
                            <Pause />
                          </IconButton>
                          <IconButton size="small" color="warning">
                            <Stop />
                          </IconButton>
                          <IconButton size="small" color="error">
                            <Delete />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default TaskQueue; 
