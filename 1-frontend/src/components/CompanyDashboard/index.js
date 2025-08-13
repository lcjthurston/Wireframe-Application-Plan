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
  Avatar,
  Chip
} from '@mui/material';
import {
  Search,
  Add,
  Business,
  Email,
  Phone,
  LocationOn,
  People,
  ArrowBack
} from '@mui/icons-material';
import kilowattImage from '../../assets/image.png';
import NavBar from '../shared/NavBar';
import { dataServices } from '../../services/dataService';
import { DATA_CONFIG, DEV_CONFIG } from '../../config/app';

const CompanyDashboard = ({ onLogout, onNavigate }) => {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState('Unknown');

  // Load company data using data service (with backend API or JSON fallback)
  useEffect(() => {
    const loadCompanyData = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log(`🔄 Loading company data (Backend API: ${DATA_CONFIG.useBackendAPI ? 'Enabled' : 'Disabled'})`);

        const companies = await dataServices.companies.getAll();
        console.log(`✅ Loaded ${companies.length} companies`);

        setCompanies(companies);
        setFilteredCompanies(companies);

        // Set data source for debugging
        setDataSource(DATA_CONFIG.useBackendAPI ? 'Backend API' : 'Static JSON');

      } catch (error) {
        console.error('Failed to load company data:', error);
        setError(`Failed to load companies: ${error.message}`);
        
        // Fallback to a few sample companies if import fails
        const fallbackCompanies = [
          {
            id: 1,
            companyName: 'Sample Company',
            companyCode: 'SAMPLE',
            status: '7 ACTIVE',
            officeLocation: 'Sample Address',
            phone: '(555) 123-4567',
            email: 'sample@example.com',
            managerCount: 0,
            accountCount: 0,
            isActive: true
          }
        ];
        setCompanies(fallbackCompanies);
        setFilteredCompanies(fallbackCompanies);
      }
    };
    
    loadCompanyData();
  }, []);

  // Filter companies based on search term
  useEffect(() => {
    const filtered = companies.filter(company =>
      company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.companyCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (company.email && company.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredCompanies(filtered);
  }, [searchTerm, companies]);

  const handleCompanyClick = (companyId) => {
    onNavigate('companyDetail', { companyId });
  };

  const getStatusColor = (status) => {
    if (status && status.includes('ACTIVE')) return 'success';
    if (status && status.includes('POTENTIAL')) return 'warning';
    if (status && status.includes('NOT INTERESTED')) return 'error';
    return 'default';
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <NavBar
        onNavigate={onNavigate}
        onProfileMenuOpen={onLogout}
        userProfile={{ name: 'Profile' }}
        currentPage="companies"
        searchQuery={searchTerm}
        setSearchQuery={setSearchTerm}
      />
      
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Business sx={{ fontSize: 32, color: '#d32f2f', mr: 2 }} />
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: '#333' }}>
              Management Companies
            </Typography>
          </Box>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Manage and view all management companies in the system
          </Typography>

          {/* Search and Actions */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                minWidth: 300,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  borderRadius: 2
                }
              }}
            />
            
            <Button
              variant="contained"
              startIcon={<Add />}
              sx={{
                backgroundColor: '#d32f2f',
                '&:hover': { backgroundColor: '#b71c1c' },
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600
              }}
              onClick={() => onNavigate('addCompany')}
            >
              Add Company
            </Button>
          </Box>
        </Box>

        {/* Summary Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3, mb: 4 }}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Total Companies
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600, color: '#d32f2f' }}>
                    {companies.length}
                  </Typography>
                </Box>
                <Business sx={{ fontSize: 40, color: '#d32f2f', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Active Companies
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                    {companies.filter(c => c.isActive).length}
                  </Typography>
                </Box>
                <Business sx={{ fontSize: 40, color: '#2e7d32', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Total Managers
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600, color: '#1976d2' }}>
                    {companies.reduce((sum, c) => sum + c.managerCount, 0)}
                  </Typography>
                </Box>
                <People sx={{ fontSize: 40, color: '#1976d2', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Companies Table */}
        <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 0 }}>
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
                      Company Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333', borderBottom: '2px solid #e0e0e0' }}>
                      Code
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333', borderBottom: '2px solid #e0e0e0' }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333', borderBottom: '2px solid #e0e0e0' }}>
                      Location
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333', borderBottom: '2px solid #e0e0e0' }}>
                      Managers
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333', borderBottom: '2px solid #e0e0e0' }}>
                      Contact
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCompanies.map((company) => (
                    <TableRow 
                      key={company.id}
                      hover
                      sx={{ 
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease',
                        '&:hover': {
                          backgroundColor: '#f8f9fa'
                        }
                      }}
                      onClick={() => handleCompanyClick(company.id)}
                    >
                      <TableCell sx={{ borderBottom: '1px solid #f0f0f0', padding: 2 }}>
                        <Typography variant="subtitle2" fontWeight="medium">
                          {company.companyName}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #f0f0f0', padding: 2 }}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                          {company.companyCode}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #f0f0f0', padding: 2 }}>
                        <Chip 
                          label={company.status} 
                          size="small" 
                          color={getStatusColor(company.status)}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #f0f0f0', padding: 2 }}>
                        <Typography variant="body2">
                          {company.officeLocation}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #f0f0f0', padding: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <People sx={{ fontSize: 16, color: '#666', mr: 1 }} />
                          <Typography variant="body2" fontWeight="medium">
                            {company.managerCount}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #f0f0f0', padding: 2 }}>
                        <Box>
                          {company.phone && (
                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <Phone sx={{ fontSize: 14, mr: 1 }} />
                              {company.phone}
                            </Typography>
                          )}
                          {company.email && company.email !== 'No Email' && (
                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                              <Email sx={{ fontSize: 14, mr: 1 }} />
                              {company.email}
                            </Typography>
                          )}
                        </Box>
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

export default CompanyDashboard;
