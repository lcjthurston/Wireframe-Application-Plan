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
  LinearProgress,
  Tabs,
  Tab,
  Avatar,
  Tooltip
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Stop,
  Refresh,
  CheckCircle,
  Error,
  Schedule,
  Assignment,
  TrendingUp,
  Warning,
  FilterList,
  Search
} from '@mui/icons-material';

const TaskQueue = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock task data
  const mockTasks = [
    {
      id: 1,
      name: 'Process Energy Bills',
      type: 'Billing',
      status: 'Running',
      progress: 75,
      priority: 'High',
      assignedTo: 'System',
      startTime: '2024-01-15 09:00:00',
      estimatedCompletion: '2024-01-15 10:30:00',
      description: 'Processing monthly energy bills for commercial accounts'
    },
    {
      id: 2,
      name: 'Generate Commission Reports',
      type: 'Reporting',
      status: 'Queued',
      progress: 0,
      priority: 'Medium',
      assignedTo: 'Sarah Johnson',
      startTime: null,
      estimatedCompletion: '2024-01-15 11:00:00',
      description: 'Generate commission reports for sales team'
    },
    {
      id: 3,
      name: 'Update Customer Database',
      type: 'Data Management',
      status: 'Completed',
      progress: 100,
      priority: 'Low',
      assignedTo: 'Mike Wilson',
      startTime: '2024-01-15 08:00:00',
      estimatedCompletion: '2024-01-15 08:45:00',
      description: 'Update customer information and contact details'
    },
    {
      id: 4,
      name: 'Email Campaign Deployment',
      type: 'Marketing',
      status: 'Failed',
      progress: 25,
      priority: 'High',
      assignedTo: 'John Smith',
      startTime: '2024-01-15 07:30:00',
      estimatedCompletion: null,
      description: 'Deploy monthly newsletter to customer base'
    }
  ];

  React.useEffect(() => {
    setTasks(mockTasks);
  }, []);

  const getStatusChip = (status) => {
    const statusConfig = {
      'Running': { color: 'info', label: 'Running', icon: <PlayArrow fontSize="small" /> },
      'Queued': { color: 'warning', label: 'Queued', icon: <Schedule fontSize="small" /> },
      'Completed': { color: 'success', label: 'Completed', icon: <CheckCircle fontSize="small" /> },
      'Failed': { color: 'error', label: 'Failed', icon: <Error fontSize="small" /> },
      'Paused': { color: 'default', label: 'Paused', icon: <Pause fontSize="small" /> }
    };

    const config = statusConfig[status] || statusConfig['Queued'];
    
    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        icon={config.icon}
        sx={{ fontWeight: 500 }}
      />
    );
  };

  const getPriorityChip = (priority) => {
    const priorityConfig = {
      'High': { color: 'error', label: 'High' },
      'Medium': { color: 'warning', label: 'Medium' },
      'Low': { color: 'success', label: 'Low' }
    };

    const config = priorityConfig[priority] || priorityConfig['Medium'];
    
    return (
      <Chip
        label={config.label}
        color={config.color}
        variant="outlined"
        size="small"
      />
    );
  };

  const handleTaskAction = (taskId, action) => {
    // Handle task actions (start, pause, stop, retry)
    console.log(`${action} task ${taskId}`);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || task.status.toLowerCase() === filter.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  const taskStats = {
    total: tasks.length,
    running: tasks.filter(t => t.status === 'Running').length,
    queued: tasks.filter(t => t.status === 'Queued').length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    failed: tasks.filter(t => t.status === 'Failed').length
  };

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Task Queue Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={() => {/* handle refresh */}}
        >
          Refresh Queue
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={2.4}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <Assignment sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {taskStats.total}
              </Typography>
              <Typography color="textSecondary">Total Tasks</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2.4}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <PlayArrow sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'info.main' }}>
                {taskStats.running}
              </Typography>
              <Typography color="textSecondary">Running</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2.4}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <Schedule sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'warning.main' }}>
                {taskStats.queued}
              </Typography>
              <Typography color="textSecondary">Queued</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2.4}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <CheckCircle sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'success.main' }}>
                {taskStats.completed}
              </Typography>
              <Typography color="textSecondary">Completed</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2.4}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <Error sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'error.main' }}>
                {taskStats.failed}
              </Typography>
              <Typography color="textSecondary">Failed</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              label="Filter by Status"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <MenuItem value="all">All Tasks</MenuItem>
              <MenuItem value="running">Running</MenuItem>
              <MenuItem value="queued">Queued</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Tasks Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Task</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task.id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {task.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {task.description}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{task.type}</Typography>
                  </TableCell>
                  <TableCell>
                    {getStatusChip(task.status)}
                  </TableCell>
                  <TableCell>
                    {getPriorityChip(task.priority)}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={task.progress}
                        sx={{ width: 80, height: 6, borderRadius: 3 }}
                        color={task.status === 'Failed' ? 'error' : 'primary'}
                      />
                      <Typography variant="body2">{task.progress}%</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                        {task.assignedTo.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      <Typography variant="body2">{task.assignedTo}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {task.startTime ? new Date(task.startTime).toLocaleString() : 'Not started'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {task.status === 'Running' && (
                        <Tooltip title="Pause Task">
                          <IconButton size="small" onClick={() => handleTaskAction(task.id, 'pause')}>
                            <Pause fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {(task.status === 'Queued' || task.status === 'Paused') && (
                        <Tooltip title="Start Task">
                          <IconButton size="small" onClick={() => handleTaskAction(task.id, 'start')}>
                            <PlayArrow fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {task.status === 'Failed' && (
                        <Tooltip title="Retry Task">
                          <IconButton size="small" onClick={() => handleTaskAction(task.id, 'retry')}>
                            <Refresh fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Stop Task">
                        <IconButton size="small" onClick={() => handleTaskAction(task.id, 'stop')}>
                          <Stop fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default TaskQueue; 
