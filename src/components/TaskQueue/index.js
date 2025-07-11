import React, { useState, useRef, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Badge,
  Box,
  Grid,
  Card,
  CardContent,
  InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon,
  AccountCircle,
  Assignment,
  Flag,
  CheckCircle,
  Warning,
  Error,
  MoreVert,
  Sort,
  FilterList,
  Download,
  Person,
  Business
} from '@mui/icons-material';
import kilowattImage from '../../assets/image.png';
import './TaskQueue.scss';

const TaskQueue = ({ onLogout, onNavigate }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [sortField, setSortField] = useState('dateCreated');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);

  // Mock data for tasks
  const allTasks = [
    {
      id: 1,
      accountName: 'ABC Corporation',
      taskType: 'Super Flag',
      dateCreated: '2024-01-15',
      assignedTo: 'John Doe',
      priority: 'high',
      description: 'Contract requires immediate attention due to pricing discrepancies'
    },
    {
      id: 2,
      accountName: 'XYZ Industries',
      taskType: 'Provider Selection',
      dateCreated: '2024-01-14',
      assignedTo: 'Unassigned',
      priority: 'medium',
      description: 'Need to select new provider for upcoming contract renewal'
    },
    {
      id: 3,
      accountName: 'Main Street Plaza',
      taskType: 'New Account Verification',
      dateCreated: '2024-01-13',
      assignedTo: 'Sarah Johnson',
      priority: 'low',
      description: 'New account created from email, requires verification'
    },
    {
      id: 4,
      accountName: 'Downtown Center',
      taskType: 'Super Flag',
      dateCreated: '2024-01-12',
      assignedTo: 'Mike Chen',
      priority: 'high',
      description: 'Contract terms need review and approval'
    },
    {
      id: 5,
      accountName: 'Tech Park LLC',
      taskType: 'Provider Selection',
      dateCreated: '2024-01-11',
      assignedTo: 'Unassigned',
      priority: 'medium',
      description: 'Provider selection needed for new service agreement'
    },
    {
      id: 6,
      accountName: 'Industrial Complex',
      taskType: 'New Account Verification',
      dateCreated: '2024-01-10',
      assignedTo: 'Unassigned',
      priority: 'low',
      description: 'Account verification pending documentation review'
    }
  ];

  const tabs = [
    { id: 'all', label: 'All Tasks', count: allTasks.length, icon: <Assignment /> },
    { id: 'super-flagged', label: 'Super Flagged', count: allTasks.filter(t => t.taskType === 'Super Flag').length, icon: <Flag /> },
    { id: 'provider-selection', label: 'Provider Selection', count: allTasks.filter(t => t.taskType === 'Provider Selection').length, icon: <Business /> },
    { id: 'verification', label: 'Verification', count: allTasks.filter(t => t.taskType === 'New Account Verification').length, icon: <CheckCircle /> }
  ];

  const getFilteredTasks = () => {
    let filtered = allTasks;

    // Filter by active tab
    if (activeTab !== 0) {
      const taskTypeMap = {
        1: 'Super Flag',
        2: 'Provider Selection',
        3: 'New Account Verification'
      };
      filtered = filtered.filter(task => task.taskType === taskTypeMap[activeTab]);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.taskType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort tasks
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'dateCreated') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleAssignToMe = (taskId) => {
    console.log('Assigning task', taskId, 'to current user');
    // TODO: Implement assignment logic
  };

  const handleGoToAccount = (accountName) => {
    console.log('Navigating to account:', accountName);
    // TODO: Implement navigation to account dashboard
  };

  const handleNavigation = (page) => {
    console.log('Navigating to:', page);
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const handleProfileAction = (action) => {
    console.log('Profile action:', action);
    if (action === 'logout') {
      onLogout();
    }
    setProfileAnchorEl(null);
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <Error color="error" />;
      case 'medium': return <Warning color="warning" />;
      case 'low': return <CheckCircle color="success" />;
      default: return <CheckCircle />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="task-queue-dashboard">
      <AppBar position="static" className="task-queue-app-bar">
        <Toolbar className="task-queue-toolbar">
          <Box display="flex" alignItems="center" flexGrow={1}>
            <Box
              sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => handleNavigation('home')}
            >
              <img src={kilowattImage} alt="Kilowatt" className="task-queue-logo" />
              <Typography variant="h5" className="task-queue-brand">
                Kilowatt
              </Typography>
            </Box>
          </Box>

          <Box className="task-queue-search-container">
            <TextField
              placeholder="Search tasks, accounts, etc..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="task-queue-search-field"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Box>

          <Button
            color="inherit"
            className="task-queue-profile-button"
            onClick={(e) => setProfileAnchorEl(e.currentTarget)}
            startIcon={<AccountCircle />}
          >
            John Doe
          </Button>
        </Toolbar>
      </AppBar>

      <Box className="task-queue-content">
        <Box className="task-queue-header">
          <Typography variant="h4" className="task-queue-title">
            Master Task & Action Queue
          </Typography>
          <Typography variant="body1" className="task-queue-subtitle">
            Central hub for all tasks requiring manual intervention
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} className="task-queue-stats">
          <Grid item xs={12} sm={6} md={3}>
            <Card className="task-queue-stat-card">
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
                  <Assignment className="task-queue-stat-icon" color="primary" />
                  <Typography variant="h4" className="task-queue-stat-value">
                    {allTasks.length}
                  </Typography>
                  <Typography variant="body2" className="task-queue-stat-label">
                    Total Tasks
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="task-queue-stat-card">
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
                  <Flag className="task-queue-stat-icon" color="error" />
                  <Typography variant="h4" className="task-queue-stat-value">
                    {allTasks.filter(t => t.taskType === 'Super Flag').length}
                  </Typography>
                  <Typography variant="body2" className="task-queue-stat-label">
                    Super Flagged
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="task-queue-stat-card">
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
                  <Business className="task-queue-stat-icon" color="warning" />
                  <Typography variant="h4" className="task-queue-stat-value">
                    {allTasks.filter(t => t.taskType === 'Provider Selection').length}
                  </Typography>
                  <Typography variant="body2" className="task-queue-stat-label">
                    Provider Selection
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="task-queue-stat-card">
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
                  <CheckCircle className="task-queue-stat-icon" color="success" />
                  <Typography variant="h4" className="task-queue-stat-value">
                    {allTasks.filter(t => t.taskType === 'New Account Verification').length}
                  </Typography>
                  <Typography variant="body2" className="task-queue-stat-label">
                    Verifications
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          className="task-queue-tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabs.map((tab, index) => (
            <Tab
              key={tab.id}
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  {tab.icon}
                  {tab.label}
                  <Chip
                    label={tab.count}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>
              }
            />
          ))}
        </Tabs>

        {/* Task Table */}
        <TableContainer component={Paper} className="task-queue-table-container">
          <Table className="task-queue-table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Button
                    onClick={() => handleSort('accountName')}
                    className="task-queue-sort-button"
                    startIcon={<Sort />}
                  >
                    Account Name
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleSort('taskType')}
                    className="task-queue-sort-button"
                    startIcon={<Sort />}
                  >
                    Task Type
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleSort('dateCreated')}
                    className="task-queue-sort-button"
                    startIcon={<Sort />}
                  >
                    Date Created
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleSort('assignedTo')}
                    className="task-queue-sort-button"
                    startIcon={<Sort />}
                  >
                    Assigned To
                  </Button>
                </TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTasks.map(task => (
                <TableRow key={task.id}>
                  <TableCell>
                    <Button
                      onClick={() => handleGoToAccount(task.accountName)}
                      className="task-queue-account-link"
                    >
                      {task.accountName}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={task.taskType}
                      color={getPriorityColor(task.priority)}
                      className="task-queue-priority-chip"
                      icon={getPriorityIcon(task.priority)}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(task.dateCreated).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {task.assignedTo === 'Unassigned' ? (
                      <Chip
                        label="Unassigned"
                        variant="outlined"
                        color="default"
                        className="task-queue-unassigned"
                      />
                    ) : (
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar className="task-queue-avatar">
                          <Person />
                        </Avatar>
                        {task.assignedTo}
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      {task.assignedTo === 'Unassigned' && (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleAssignToMe(task.id)}
                          className="task-queue-assign-button"
                        >
                          Assign to Me
                        </Button>
                      )}
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleGoToAccount(task.accountName)}
                        className="task-queue-action-button"
                      >
                        Go to Account
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredTasks.length === 0 && (
          <Box className="task-queue-empty-state">
            <Assignment className="task-queue-empty-icon" />
            <Typography variant="h6" className="task-queue-empty-text">
              No tasks found
            </Typography>
            <Typography variant="body2" className="task-queue-empty-subtext">
              {searchQuery ? 'Try adjusting your search criteria.' : 'All caught up! No tasks require attention.'}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={profileAnchorEl}
        open={Boolean(profileAnchorEl)}
        onClose={() => setProfileAnchorEl(null)}
      >
        <MenuItem onClick={() => handleProfileAction('settings')} className="task-queue-menu-item">
          Settings
        </MenuItem>
        <MenuItem onClick={() => handleProfileAction('logout')} className="task-queue-menu-item">
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
};

export default TaskQueue; 