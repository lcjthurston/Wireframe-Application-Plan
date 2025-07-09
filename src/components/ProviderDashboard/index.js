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
  CardHeader,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon,
  AccountCircle,
  Business,
  Phone,
  Email,
  LocationOn,
  Person,
  AttachMoney,
  Description,
  History,
  Refresh,
  GetApp,
  Edit,
  MoreVert,
  CheckCircle,
  Warning,
  Error,
  Info,
  Add,
  Remove,
  Sort
} from '@mui/icons-material';
import kilowattImage from '../../assets/image.png';
import './ProviderDashboard.scss';

const ProviderDashboard = ({ onLogout, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('providerName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);

  // Mock provider data
  const providers = [
    {
      id: 1,
      providerName: 'Reliant Energy',
      status: 'Active',
      contractType: 'Standard',
      commissionRate: 0.085,
      contractEndDate: '2024-12-31',
      totalAccounts: 12,
      totalEsiids: 24,
      monthlyRevenue: 45000,
      contactPerson: 'John Smith',
      contactEmail: 'john.smith@reliant.com',
      contactPhone: '(713) 555-0101'
    },
    {
      id: 2,
      providerName: 'TXU Energy',
      status: 'Active',
      contractType: 'Premium',
      commissionRate: 0.092,
      contractEndDate: '2024-06-30',
      totalAccounts: 8,
      totalEsiids: 16,
      monthlyRevenue: 32000,
      contactPerson: 'Sarah Johnson',
      contactEmail: 'sarah.johnson@txu.com',
      contactPhone: '(713) 555-0102'
    },
    {
      id: 3,
      providerName: 'Direct Energy',
      status: 'Pending',
      contractType: 'Standard',
      commissionRate: 0.078,
      contractEndDate: '2024-09-15',
      totalAccounts: 4,
      totalEsiids: 8,
      monthlyRevenue: 18000,
      contactPerson: 'Mike Chen',
      contactEmail: 'mike.chen@directenergy.com',
      contactPhone: '(713) 555-0103'
    },
    {
      id: 4,
      providerName: 'Green Mountain Energy',
      status: 'Active',
      contractType: 'Premium',
      commissionRate: 0.095,
      contractEndDate: '2024-11-30',
      totalAccounts: 6,
      totalEsiids: 12,
      monthlyRevenue: 28000,
      contactPerson: 'Lisa Wang',
      contactEmail: 'lisa.wang@greenmountain.com',
      contactPhone: '(713) 555-0104'
    },
    {
      id: 5,
      providerName: 'Constellation Energy',
      status: 'Inactive',
      contractType: 'Standard',
      commissionRate: 0.082,
      contractEndDate: '2024-03-15',
      totalAccounts: 0,
      totalEsiids: 0,
      monthlyRevenue: 0,
      contactPerson: 'David Brown',
      contactEmail: 'david.brown@constellation.com',
      contactPhone: '(713) 555-0105'
    }
  ];

  const getFilteredProviders = () => {
    let filtered = providers;
    if (searchQuery) {
      filtered = filtered.filter(provider =>
        provider.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.status.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      if (sortField === 'commissionRate' || sortField === 'monthlyRevenue') {
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
      case 'Active': return 'success';
      case 'Pending': return 'warning';
      case 'Inactive': return 'error';
      default: return 'default';
    }
  };

  const filteredProviders = getFilteredProviders();

  return (
    <div className="provider-dashboard-container">
      <AppBar position="static" className="provider-dashboard-app-bar">
        <Toolbar className="provider-dashboard-toolbar">
          <Box display="flex" alignItems="center" flexGrow={1}>
            <img src={kilowattImage} alt="Kilowatt" className="provider-dashboard-logo" />
            <Typography variant="h5" className="provider-dashboard-brand">
              Kilowatt
            </Typography>
          </Box>
          <Box className="provider-dashboard-search-container">
            <TextField
              placeholder="Search providers, status, etc..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="provider-dashboard-search-field"
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
            className="provider-dashboard-profile-button"
            onClick={(e) => setProfileAnchorEl(e.currentTarget)}
            startIcon={<AccountCircle />}
          >
            Provider Admin
          </Button>
        </Toolbar>
      </AppBar>
      <Box className="provider-dashboard-content">
        <Box className="provider-dashboard-header">
          <Typography variant="h4" className="provider-dashboard-title">
            Provider Dashboard
          </Typography>
          <Typography variant="body1" className="provider-dashboard-subtitle">
            Manage providers, contracts, and pricing
          </Typography>
        </Box>
        <TableContainer component={Paper} className="provider-dashboard-table-container">
          <Table className="provider-dashboard-table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Button
                    onClick={() => setSortField('providerName')}
                    className="provider-dashboard-sort-button"
                    startIcon={<Sort />}
                  >
                    Provider Name
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => setSortField('status')}
                    className="provider-dashboard-sort-button"
                    startIcon={<Sort />}
                  >
                    Status
                  </Button>
                </TableCell>
                <TableCell>Contract Type</TableCell>
                <TableCell>
                  <Button
                    onClick={() => setSortField('commissionRate')}
                    className="provider-dashboard-sort-button"
                    startIcon={<Sort />}
                  >
                    Commission Rate
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => setSortField('contractEndDate')}
                    className="provider-dashboard-sort-button"
                    startIcon={<Sort />}
                  >
                    Contract End Date
                  </Button>
                </TableCell>
                <TableCell>Total Accounts</TableCell>
                <TableCell>Total ESIIDs</TableCell>
                <TableCell>
                  <Button
                    onClick={() => setSortField('monthlyRevenue')}
                    className="provider-dashboard-sort-button"
                    startIcon={<Sort />}
                  >
                    Monthly Revenue
                  </Button>
                </TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProviders.map(provider => (
                <TableRow key={provider.id}>
                  <TableCell>
                    <Button className="provider-dashboard-provider-link">
                      {provider.providerName}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={provider.status}
                      color={getStatusColor(provider.status)}
                      className={`provider-dashboard-status-chip provider-dashboard-status-${provider.status.toLowerCase()}`}
                    />
                  </TableCell>
                  <TableCell>{provider.contractType}</TableCell>
                  <TableCell>
                    <Typography className="provider-dashboard-provider-value">
                      {provider.commissionRate}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography className="provider-dashboard-contract-date">
                      {new Date(provider.contractEndDate).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>{provider.totalAccounts}</TableCell>
                  <TableCell>{provider.totalEsiids}</TableCell>
                  <TableCell>
                    <Typography className="provider-dashboard-provider-value">
                      ${provider.monthlyRevenue.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {provider.contactPerson}<br />
                      <a href={`mailto:${provider.contactEmail}`}>{provider.contactEmail}</a><br />
                      {provider.contactPhone}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Button
                        variant="outlined"
                        size="small"
                        className="provider-dashboard-action-button"
                      >
                        View
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        className="provider-dashboard-action-button"
                      >
                        Edit
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {filteredProviders.length === 0 && (
          <Box className="provider-dashboard-empty-state">
            <Business className="provider-dashboard-empty-icon" />
            <Typography variant="h6" className="provider-dashboard-empty-text">
              No providers found
            </Typography>
            <Typography variant="body2" className="provider-dashboard-empty-subtext">
              {searchQuery ? 'Try adjusting your search criteria.' : 'No providers are currently available.'}
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
        <MenuItem onClick={() => setProfileAnchorEl(null)} className="provider-dashboard-menu-item">
          Settings
        </MenuItem>
        <MenuItem onClick={onLogout} className="provider-dashboard-menu-item">
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
};

export default ProviderDashboard; 