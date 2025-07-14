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
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <AppBar 
        position="static" 
        sx={{ 
          background: 'linear-gradient(135deg, #C82828 0%, #B71C1C 100%)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        <Toolbar sx={{ minHeight: 72 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => onNavigate('home')}
            sx={{ color: 'white', mr: 2 }}
          >
            Back
          </Button>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <img 
              src={kilowattImage} 
              alt="Kilowatt Logo" 
              style={{ width: 44, height: 44, marginRight: 14, borderRadius: 9 }}
            />
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
              Kilowatt
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Button
            onClick={onLogout}
            sx={{ color: 'white', textTransform: 'none', fontWeight: 600 }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

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
