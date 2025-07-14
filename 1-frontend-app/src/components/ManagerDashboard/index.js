import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  Button,
  Chip
} from '@mui/material';
import {
  Search,
  Add,
  Person,
  Business,
  Email,
  Phone,
  LocationOn
} from '@mui/icons-material';

const ManagerDashboard = ({ onLogout, onNavigate }) => {
  const [managers, setManagers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredManagers, setFilteredManagers] = useState([]);

  // Mock data
  useEffect(() => {
    const mockManagers = [
      {
        id: 1,
        name: 'Sarah Johnson',
        managementCompany: 'Property Management Inc.',
        email: 'sarah.johnson@propmanage.com',
        phone: '(713) 555-0123',
        officeAddress: '123 Business Rd, Suite 500, Houston, TX 77001',
        accountCount: 24,
        totalCommission: 125000,
        pendingContracts: 3
      },
      // Add more mock managers
    ];
    setManagers(mockManagers);
    setFilteredManagers(mockManagers);
  }, []);

  // Filter managers based on search term
  useEffect(() => {
    const filtered = managers.filter(manager =>
      manager.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manager.managementCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manager.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredManagers(filtered);
  }, [searchTerm, managers]);

  const handleManagerClick = (managerId) => {
    onNavigate('managerDetail', { managerId });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Managers
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => onNavigate('addManager')}
          size="large"
        >
          Add Manager
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search managers..."
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
                  <TableCell>Manager Name</TableCell>
                  <TableCell>Management Company Name</TableCell>
                  <TableCell>Manager Email</TableCell>
                  <TableCell>Manager Phone</TableCell>
                  <TableCell>Office Address</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredManagers.map((manager) => (
                  <TableRow 
                    key={manager.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleManagerClick(manager.id)}
                  >
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="medium">
                        {manager.name}
                      </Typography>
                    </TableCell>
                    <TableCell>{manager.managementCompany}</TableCell>
                    <TableCell>{manager.email}</TableCell>
                    <TableCell>{manager.phone}</TableCell>
                    <TableCell>{manager.officeAddress}</TableCell>
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

export default ManagerDashboard;
