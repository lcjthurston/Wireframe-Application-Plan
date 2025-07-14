import React, { useState, useEffect } from 'react';
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
  Tabs,
  Tab,
  Avatar,
  LinearProgress,
  Tooltip
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Stop,
  Edit,
  Delete,
  Add,
  FilterList,
  Sort,
  Assignment,
  Schedule,
  CheckCircle,
  Error,
  Warning
} from '@mui/icons-material';

const TaskQueue = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('priority');

  // Mock task data
  const mockTasks = [
    {
      id: 1,
      title: 'Process Account Data',
      description: 'Import and validate customer account information',
      status: 'running',
      priority: 'high',
      assignee: 'John Smith',
      progress: 65,
      estimatedTime: '15 min',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      title: 'Generate Commission Report',
      description: 'Monthly commission calculations for all managers',
      status: 'pending',
      priority: 'medium',
      assignee: 'Sarah Johnson',
      progress: 0,
      estimatedTime: '30 min',
      createdAt: '2024-01-15T09:15:00Z'
    },
    {
      id: 3,
      title: 'Email Campaign Delivery',
      description: 'Send promotional emails to active customers',
      status: 'completed',
      priority: 'low',
      assignee: 'Mike Wilson',
      progress: 100,
      estimatedTime: '45 min',
      createdAt: '2024-01-15T08:00:00Z'
    }
  ];

  useEffect(() => {
    setTasks(mockTasks);
  }, []);

  const getStatusChip = (status) => {
    const statusConfig = {
      running: { color: 'primary', icon: <PlayArrow fontSize="small" />, label: 'Running' },
      pending: { color: 'warning', icon: <Schedule fontSize="small" />, label: 'Pending' },
      completed: { color: 'success', icon: <CheckCircle fontSize="small" />, label: 'Completed' },
      failed: { color: 'error', icon: <Error fontSize="small" />, label: 'Failed' },
      paused: { color: 'default', icon: <Pause fontSize="small" />, label: 'Paused' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <Chip
        icon={config.icon}
        label={config.label}
        color={config.color}
        size="small"
        sx={{ fontWeight: 500 }}
      />
    );
  };

  const getPriorityChip = (priority) => {
    const priorityConfig = {
      high: { color: 'error', label: 'High' },
      medium: { color: 'warning', label: 'Medium' },
      low: { color: 'success', label: 'Low' }
    };

    const config = priorityConfig[priority] || priorityConfig.medium;
    
    return (
      <Chip
        label={config.label}
        color={config.color}
        variant="outlined"
        size="small"
      />
    );
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const taskStats = {
    total: tasks.length,
    running: tasks.filter(t => t.status === 'running').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    failed: tasks.filter(t => t.status === 'failed').length
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
          startIcon={<Add />}
          onClick={() => {/* handle add task */}}
        >
          Add Task
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
              <PlayArrow sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
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
                {taskStats.pending}
              </Typography>
              <Typography color="textSecondary">Pending</Typography>
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
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            select
            label="Filter by Status"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="all">All Tasks</MenuItem>
            <MenuItem value="running">Running</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="failed">Failed</MenuItem>
          </TextField>
          
          <TextField
            select
            label="Sort by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="priority">Priority</MenuItem>
            <MenuItem value="status">Status</MenuItem>
            <MenuItem value="createdAt">Created Date</MenuItem>
            <MenuItem value="assignee">Assignee</MenuItem>
          </TextField>
        </Box>
      </Paper>

      {/* Tasks Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Task</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Assignee</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell>Est. Time</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task.id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {task.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {task.description}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {getStatusChip(task.status)}
                  </TableCell>
                  <TableCell>
                    {getPriorityChip(task.priority)}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {task.assignee.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      <Typography variant="body2">{task.assignee}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={task.progress}
                        sx={{ width: 80, height: 6, borderRadius: 3 }}
                      />
                      <Typography variant="body2">{task.progress}%</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{task.estimatedTime}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {task.status === 'running' ? (
                        <Tooltip title="Pause Task">
                          <IconButton size="small">
                            <Pause fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      ) : task.status === 'pending' ? (
                        <Tooltip title="Start Task">
                          <IconButton size="small">
                            <PlayArrow fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      ) : null}
                      
                      <Tooltip title="Edit Task">
                        <IconButton size="small">
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Delete Task">
                        <IconButton size="small">
                          <Delete fontSize="small" />
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
