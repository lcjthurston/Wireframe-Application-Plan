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
  Select,
  Container
} from '@mui/material';
import {
  Add,
  Search,
  FilterList,
  MoreVert
} from '@mui/icons-material';
import NavBar from '../shared/NavBar';

const AccountsList = ({ onLogout, onNavigate }) => {
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [filterBy, setFilterBy] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [availableStatuses, setAvailableStatuses] = useState([]);

  // Load real account data from JSON file
  useEffect(() => {
    const loadAccountsData = async () => {
      try {
        // Import the JSON file directly
        const accountsData = await import('../../data/accounts.json');
        const accounts = accountsData.default || accountsData;
        console.log(`Loaded ${accounts.length} accounts from JSON file`);
        setAccounts(accounts);
        setFilteredAccounts(accounts);

        // Extract unique statuses for filter dropdown
        const statuses = [...new Set(accounts.map(account =>
          account.status || account.procurementStatus
        ).filter(Boolean))].sort();
        setAvailableStatuses(statuses);
      } catch (error) {
        console.warn('Could not load accounts.json, using fallback data:', error);
        // Fallback to mock data if JSON file is not available
        const mockAccounts = [
          {
            id: 1,
            name: 'ABC Corporation',
            accountName: 'ABC Corporation',
            managerName: 'Sarah Johnson',
            managementCompany: 'Property Management Inc.',
            status: 'Needs Pricing',
            address: '123 Business Ave, Suite 100, Houston, TX 77001',
            telephone: '(713) 555-0123',
            email: 'contact@abc-corp.com',
            esiidCount: 5,
            usage: '125,000 kWh/month'
          },
          {
            id: 2,
            name: 'XYZ Industries',
            accountName: 'XYZ Industries',
            managerName: null,
            managementCompany: 'Commercial Properties LLC',
            status: 'Good',
            address: '456 Industrial Blvd, Houston, TX 77002',
            telephone: '(713) 555-0456',
            email: 'info@xyzind.com',
            esiidCount: 3,
            usage: '89,000 kWh/month'
          }
        ];
        setAccounts(mockAccounts);
        setFilteredAccounts(mockAccounts);
        setAvailableStatuses(['Needs Pricing', 'Good']);
      }
    };

    loadAccountsData();
  }, []);

  // Enhanced filtering logic
  useEffect(() => {
    let filtered = accounts;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(account => {
        const accountName = account.accountName || account.name || '';
        const managerName = account.managerName || '';
        const managementCompany = account.managementCompany || '';

        return accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               managerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               managementCompany.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    // Filter by manager assignment
    if (filterBy === 'no-manager') {
      filtered = filtered.filter(account => !account.managerName);
    } else if (filterBy === 'has-manager') {
      filtered = filtered.filter(account => account.managerName);
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(account => {
        const status = account.status || account.procurementStatus || '';
        return status.toLowerCase().replace(/\s+/g, '-') === statusFilter;
      });
    }

    setFilteredAccounts(filtered);
  }, [searchTerm, accounts, filterBy, statusFilter]);

  const getStatusColor = (status) => {
    if (!status) return 'default';

    const statusLower = status.toLowerCase();

    // Map common status values to colors
    if (statusLower.includes('good') || statusLower.includes('active') || statusLower.includes('under kilo contract')) {
      return 'success';
    } else if (statusLower.includes('need') || statusLower.includes('pricing') || statusLower.includes('bill copies')) {
      return 'warning';
    } else if (statusLower.includes('contract') || statusLower.includes('sent') || statusLower.includes('error')) {
      return 'error';
    } else if (statusLower.includes('provider') || statusLower.includes('select') || statusLower.includes('usage')) {
      return 'info';
    } else {
      return 'default';
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
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <NavBar 
        onNavigate={onNavigate}
        onProfileMenuOpen={onLogout}
        userProfile={{ name: 'Profile' }}
        currentPage="accounts"
        searchQuery=""
        setSearchQuery={() => {}}
      />

      <Container maxWidth="xl" sx={{ py: 4 }}>
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
                    {availableStatuses.map((status) => (
                      <MenuItem
                        key={status}
                        value={status.toLowerCase().replace(/\s+/g, '-')}
                      >
                        {status}
                      </MenuItem>
                    ))}
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
                            {account.accountName || account.name}
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
                          {account.managementCompany || 'No Company'}
                        </TableCell>
                        <TableCell onClick={() => handleAccountClick(account)}>
                          <Chip
                            label={account.status || account.procurementStatus || 'Unknown'}
                            color={getStatusColor(account.status || account.procurementStatus)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell onClick={() => handleAccountClick(account)}>
                          {account.esiidCount || 0}
                        </TableCell>
                        <TableCell onClick={() => handleAccountClick(account)}>
                          {account.usage || 'No usage data'}
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
      </Container>
    </Box>
  );
};

export default AccountsList;















