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
  MenuItem
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

  // Mock data - replace with real API call
  useEffect(() => {
    const mockAccounts = [
      {
        id: 1,
        name: 'ABC Corporation',
        managerName: 'Sarah Johnson',
        managementCompany: 'Property Management Inc.',
        status: 'Good'
      },
      // Add more mock accounts as needed
    ];
    setAccounts(mockAccounts);
    setFilteredAccounts(mockAccounts);
  }, []);

  // Filter accounts based on search term
  useEffect(() => {
    const filtered = accounts.filter(account =>
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.managerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.managementCompany.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAccounts(filtered);
  }, [searchTerm, accounts]);

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

  const handleAccountClick = (accountId) => {
    onNavigate('account', { accountId });
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
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search accounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Account Name</TableCell>
                  <TableCell>Manager Name</TableCell>
                  <TableCell>Management Company</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAccounts.map((account) => (
                  <TableRow 
                    key={account.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleAccountClick(account.id)}
                  >
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="medium">
                        {account.name}
                      </Typography>
                    </TableCell>
                    <TableCell>{account.managerName}</TableCell>
                    <TableCell>{account.managementCompany}</TableCell>
                    <TableCell>
                      <Chip
                        label={account.status}
                        color={getStatusColor(account.status)}
                        size="small"
                      />
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
        </CardContent>
      </Card>
    </Box>
  );
};

export default AccountsList;


