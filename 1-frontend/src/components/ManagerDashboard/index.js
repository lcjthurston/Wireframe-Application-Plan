import React, { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
  Container,
  Avatar
} from '@mui/material';
import {
  Search,
  Add,
  Person,
  Business,
  Email,
  Phone,
  LocationOn,
  ArrowBack
} from '@mui/icons-material';
import kilowattImage from '../../assets/image.png';
import NavBar from '../shared/NavBar';

const ManagerDashboard = ({ onLogout, onNavigate }) => {
  const [managers, setManagers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredManagers, setFilteredManagers] = useState([]);

  // Load real manager data
  useEffect(() => {
    const loadManagerData = async () => {
      try {
        // Import the real manager data
        const managersData = await import('../../data/managers.json');
        const realManagers = managersData.default || managersData;

        console.log(`📊 Loaded ${realManagers.length} real managers from database`);
        setManagers(realManagers);
        setFilteredManagers(realManagers);
      } catch (error) {
        console.error('❌ Error loading manager data:', error);

        // Fallback to a few sample managers if import fails
        const fallbackManagers = [
          {
            id: 1,
            name: 'Sample Manager',
            managementCompany: 'Sample Company',
            email: 'sample@example.com',
            phone: '(555) 123-4567',
            officeAddress: 'Sample Address',
            accountCount: 0,
            totalCommission: 0,
            pendingContracts: 0
          }
        ];
        setManagers(fallbackManagers);
        setFilteredManagers(fallbackManagers);
      }
    };

    loadManagerData();
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
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <NavBar 
        onNavigate={onNavigate}
        onProfileMenuOpen={onLogout}
        userProfile={{ name: 'Profile' }}
        currentPage="manager"
        searchQuery=""
        setSearchQuery={() => {}}
      />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
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

        <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3
                  }
                }}
              />
            </Box>

            <TableContainer 
              component={Paper} 
              variant="outlined"
              sx={{ 
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}
            >
              <Table>
                <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: '#333', borderBottom: '2px solid #e0e0e0' }}>
                      Manager Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333', borderBottom: '2px solid #e0e0e0' }}>
                      Management Company Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333', borderBottom: '2px solid #e0e0e0' }}>
                      Manager Email
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333', borderBottom: '2px solid #e0e0e0' }}>
                      Manager Phone
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333', borderBottom: '2px solid #e0e0e0' }}>
                      Office Address
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredManagers.map((manager) => (
                    <TableRow 
                      key={manager.id}
                      hover
                      sx={{ 
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease',
                        '&:hover': {
                          backgroundColor: '#f8f9fa'
                        }
                      }}
                      onClick={() => handleManagerClick(manager.id)}
                    >
                      <TableCell sx={{ borderBottom: '1px solid #f0f0f0', padding: 2 }}>
                        <Typography variant="subtitle2" fontWeight="medium">
                          {manager.name}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #f0f0f0', padding: 2 }}>
                        {manager.managementCompany}
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #f0f0f0', padding: 2 }}>
                        {manager.email}
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #f0f0f0', padding: 2 }}>
                        {manager.phone}
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #f0f0f0', padding: 2 }}>
                        {manager.officeAddress}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ManagerDashboard;
