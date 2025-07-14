import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar
} from '@mui/material';
import {
  Person,
  Business,
  Email,
  Phone,
  LocationOn,
  Add,
  History
} from '@mui/icons-material';

const ManagerDetail = ({ managerId, onNavigate }) => {
  const [manager, setManager] = useState(null);
  const [associatedAccounts, setAssociatedAccounts] = useState([]);

  useEffect(() => {
    // Mock manager data
    const mockManager = {
      id: managerId,
      name: 'Sarah Johnson',
      title: 'Manager',
      email: 'sarah.johnson@propmanage.com',
      phone: '(713) 555-0123',
      managementCompany: 'Property Management Inc.',
      accountCount: 24,
      totalCommission: 125000,
      pendingContracts: 3,
      activeAccounts: 48
    };

    const mockAccounts = [
      {
        id: 1,
        name: 'ABC Corporation',
        status: 'Active',
        contractEndDate: '12/31/2024',
        rate: '$0.085',
        monthlyCommission: '$1,500'
      },
      // Add more accounts
    ];

    setManager(mockManager);
    setAssociatedAccounts(mockAccounts);
  }, [managerId]);

  if (!manager) return null;

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ width: 64, height: 64, mr: 2, bgcolor: 'primary.main' }}>
              <Person sx={{ fontSize: 32 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" component="h1">
                {manager.name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {manager.title}
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Email sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography>{manager.email}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography>{manager.phone}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Business sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography>{manager.managementCompany}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="primary">
                        {manager.accountCount}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Active Accounts
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="success.main">
                        {manager.activeAccounts}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Billing
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="warning.main">
                        ${manager.totalCommission.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        YTD Commission
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="info.main">
                        {manager.pendingContracts}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pending Contracts
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button variant="outlined" startIcon={<Add />}>
              Account List
            </Button>
            <Button variant="outlined" startIcon={<History />}>
              Activity History
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
            Associated Accounts
          </Typography>
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Account Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Contract End Date</TableCell>
                  <TableCell>Rate</TableCell>
                  <TableCell>Monthly Commission</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {associatedAccounts.map((account) => (
                  <TableRow key={account.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="medium">
                        {account.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={account.status} 
                        color="success" 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>{account.contractEndDate}</TableCell>
                    <TableCell>{account.rate}</TableCell>
                    <TableCell>{account.monthlyCommission}</TableCell>
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

export default ManagerDetail;