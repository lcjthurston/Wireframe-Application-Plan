import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Tabs, 
  Tab, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  ListItemSecondaryAction,
  Chip,
  IconButton,
  Divider,
  Button,
  Menu,
  MenuItem
} from '@mui/material';
import { 
  Assignment, 
  CheckCircle, 
  MoreVert, 
  FilterList,
  Sort
} from '@mui/icons-material';

const TaskQueue = ({ onNavigate }) => {
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  // Define priority chip styles
  const getPriorityChipProps = (priority) => {
    switch(priority) {
      case 'High':
        return { 
          color: 'error', 
          sx: { fontWeight: 500 } 
        };
      case 'Medium':
        return { 
          color: 'warning', 
          sx: { fontWeight: 500 } 
        };
      case 'Low':
        return { 
          color: 'success', 
          sx: { fontWeight: 500 } 
        };
      default:
        return { 
          color: 'default', 
          sx: { fontWeight: 500 } 
        };
    }
  };
  
  return (
    <Box sx={{ p: 3, maxWidth: '1200px', margin: '0 auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Task Queue
        </Typography>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<FilterList />}
            sx={{ mr: 2 }}
          >
            Filter
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<Sort />}
          >
            Sort
          </Button>
        </Box>
      </Box>
      
      <Paper sx={{ width: '100%' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="All Tasks (24)" />
          <Tab label="My Tasks (12)" />
          <Tab label="Completed (56)" />
        </Tabs>
        
        <List sx={{ p: 0 }}>
          {/* Sample task item */}
          <ListItem 
            button 
            sx={{ 
              py: 2,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            <ListItemIcon>
              <Assignment color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Review account application for ABC Corp"
              secondary={
                <Box sx={{ display: 'flex', mt: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                    Due: Today
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Assigned to: John Smith
                  </Typography>
                </Box>
              }
            />
            <ListItemSecondaryAction>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip 
                  label="High Priority" 
                  size="small"
                  {...getPriorityChipProps('High')}
                  sx={{ mr: 2 }}
                />
                <IconButton edge="end" onClick={handleMenuOpen}>
                  <MoreVert />
                </IconButton>
              </Box>
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
          {/* Additional task items... */}
        </List>
      </Paper>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Mark Complete</MenuItem>
        <MenuItem onClick={handleMenuClose}>Reassign</MenuItem>
        <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
        <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
      </Menu>
    </Box>
  );
};

export default TaskQueue; 
