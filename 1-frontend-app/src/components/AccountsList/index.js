import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Checkbox,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import {
  Add,
  Search,
  FilterList,
  MoreVert
} from '@mui/icons-material';

const AccountsList = ({ onLogout, onNavigate }) => {
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [filterBy, setFilterBy] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Enhanced mock data
  useEffect(() => {
    const mockAccounts = [
      {
        id: 1,
        name: 'ABC Corporation',
        managerName: 'Sarah Johnson',
        managementCompany: 'Property Management Inc.',
        status: 'Needs Pricing',
        address: '123 Business Ave, Suite 100, Houston, TX 77001',
        phone: '(713) 555-0123',
        email: 'contact@abc-corp.com',
        esiidCount: 5,
        usage: '125,000 kWh/month'
      },
      {
        id: 2,
        name: 'XYZ Industries',
        managerName: null,
        managementCompany: 'Commercial Properties LLC',
        status: 'Good',
        address: '456 Industrial Blvd, Houston, TX 77002',
        phone: '(713) 555-0456',
        email: 'info@xyzind.com',
        esiidCount: 3,
        usage: '89,000 kWh/month'
      },
      {
        id: 3,
        name: 'Main Street Plaza',
        managerName: 'Mike Chen',
        managementCompany: 'Plaza Management Co.',
        status: 'Needs Contract Sent',
        address: '789 Main Street, Houston, TX 77003',
        phone: '(713) 555-0789',
        email: 'manager@mainstreetplaza.com',
        esiidCount: 8,
        usage: '200,000 kWh/month'
      },
      {
        id: 4,
        name: 'Downtown Center',
        managerName: null,
        managementCompany: 'Metro Properties',
        status: 'Needs Providers Selected',
        address: '321 Downtown Ave, Houston, TX 77004',
        phone: '(713) 555-0321',
        email: 'contact@downtowncenter.com',
        esiidCount: 12,
        usage: '350,000 kWh/month'
      }
    ];
    setAccounts(mockAccounts);
    setFilteredAccounts(mockAccounts);
  }, []);

  // Enhanced filtering logic
  useEffect(() => {
    let filtered = accounts;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(account =>
        account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (account.managerName && account.managerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        account.managementCompany.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by manager assignment
    if (filterBy === 'no-manager') {
      filtered = filtered.filter(account => !account.managerName);
    } else if (filterBy === 'has-manager') {
      filtered = filtered.filter(account => account.managerName);
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(account => 
        account.status.toLowerCase().replace(/\s+/g, '-') === statusFilter
      );
    }

    setFilteredAccounts(filtered);
  }, [searchTerm, accounts, filterBy, statusFilter]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'good': return 'success';
      case 'needs pricing': return 'warning';
      case 'needs contract sent': return 'error';
      case 'needs providers selected': return 'info';
      default: return 'default';
    }
  };

  const handleAddAccount = () => {
    // Navigate to add account functionality
    onNavigate('dataEntry');
  };

  const handleAccountClick = (account) => {
    onNavigate('account-detail', { accountId: account.id });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Accounts
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddAccount}
          size="large"
        >
          Add Account
        </Button>
      </Box>

      <Card>
        <CardContent>
          {/* Enhanced Filter Section */}
          <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              placeholder="Search accounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ minWidth: 300 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Filter by Manager</InputLabel>
              <Select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                label="Filter by Manager"
              >
                <MenuItem value="all">All Accounts</MenuItem>
                <MenuItem value="no-manager">No Manager Assigned</MenuItem>
                <MenuItem value="has-manager">Has Manager</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Filter by Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Filter by Status"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="good">Good</MenuItem>
                <MenuItem value="needs-pricing">Needs Pricing</MenuItem>
                <MenuItem value="needs-contract-sent">Needs Contract Sent</MenuItem>
                <MenuItem value="needs-providers-selected">Needs Providers Selected</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox />
                  </TableCell>
                  <TableCell>Account Name</TableCell>
                  <TableCell>Manager Name</TableCell>
                  <TableCell>Management Company</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>ESIIDs</TableCell>
                  <TableCell>Usage</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAccounts.map((account) => (
                  <TableRow 
                    key={account.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox />
                    </TableCell>
                    <TableCell onClick={() => handleAccountClick(account)}>
                      <Typography variant="subtitle2" fontWeight="medium">
                        {account.name}
                      </Typography>
                    </TableCell>
                    <TableCell onClick={() => handleAccountClick(account)}>
                      {account.managerName || (
                        <Chip 
                          label="No Manager" 
                          color="warning" 
                          size="small" 
                          variant="outlined"
                        />
                      )}
                    </TableCell>
                    <TableCell onClick={() => handleAccountClick(account)}>
                      {account.managementCompany}
                    </TableCell>
                    <TableCell onClick={() => handleAccountClick(account)}>
                      <Chip
                        label={account.status}
                        color={getStatusColor(account.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell onClick={() => handleAccountClick(account)}>
                      {account.esiidCount}
                    </TableCell>
                    <TableCell onClick={() => handleAccountClick(account)}>
                      {account.usage}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small">
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Action Buttons */}
          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-start' }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddAccount}
            >
              Add New Account
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => console.log('Remove selected accounts')}
            >
              Remove Account
            </Button>
            <Button
              variant="outlined"
              onClick={() => console.log('Change management company')}
            >
              Change Management Company
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AccountsList;













