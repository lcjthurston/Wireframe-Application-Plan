import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Grid,
  Button,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  TrendingDown as TrendingDownIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as AttachMoneyIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import NavBar from '../shared/NavBar';

const PricingDashboard = ({ onLogout, onNavigate }) => {
  const [pricingRecords, setPricingRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({});

  // Load real pricing data
  useEffect(() => {
    const loadPricingData = async () => {
      try {
        // Import the real pricing data
        const pricingData = await import('../../data/pricing.json');
        const realPricing = pricingData.default || pricingData;
        
        console.log(`📊 Loaded ${realPricing.length} real pricing records from database`);
        setPricingRecords(realPricing);
        setFilteredRecords(realPricing);

        // Load statistics
        const statsData = await import('../../data/pricing-stats.json');
        const realStats = statsData.default || statsData;
        setStats(realStats);
      } catch (error) {
        console.error('❌ Error loading pricing data:', error);
        
        // Fallback to sample data if import fails
        const fallbackPricing = [
          {
            id: 1,
            zone: 'Sample Zone',
            rep: 'Sample REP',
            dailyRate: 65.00,
            termMonths: 12,
            loadProfile: 'LOW'
          }
        ];
        setPricingRecords(fallbackPricing);
        setFilteredRecords(fallbackPricing);
      }
    };
    
    loadPricingData();
  }, []);

  // Filter pricing records based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredRecords(pricingRecords);
    } else {
      const filtered = pricingRecords.filter(record =>
        record.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.rep.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.loadProfile.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRecords(filtered);
    }
  }, [searchQuery, pricingRecords]);

  const getZoneColor = (zone) => {
    const zoneColors = {
      'COAST': 'primary',
      'NORTH': 'secondary',
      'SOUTH': 'success',
      'WEST': 'warning',
      'TNMP': 'info'
    };
    return zoneColors[zone?.toUpperCase()] || 'default';
  };

  const getLoadProfileColor = (profile) => {
    const profileColors = {
      'LOW': 'success',
      'HIGH': 'error',
      'MEDIUM': 'warning'
    };
    return profileColors[profile?.toUpperCase()] || 'default';
  };

  // Calculate statistics from loaded data
  const totalRecords = pricingRecords.length;
  const avgRate = stats.avgRate || 0;
  const minRate = stats.minRate || 0;
  const maxRate = stats.maxRate || 0;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <NavBar 
        onNavigate={onNavigate}
        onProfileMenuOpen={onLogout}
        userProfile={{ name: 'Profile' }}
        currentPage="pricing"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Pricing Dashboard
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => onNavigate('addPricing')}
            size="large"
            sx={{ 
              background: 'linear-gradient(135deg, #C82828 0%, #B71C1C 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #B71C1C 0%, #A01818 100%)'
              }
            }}
          >
            Add Pricing
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <BusinessIcon sx={{ fontSize: 40, color: '#C82828', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {totalRecords.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pricing Records
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <AttachMoneyIcon sx={{ fontSize: 40, color: '#4CAF50', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  ${avgRate.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Average Rate
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <TrendingDownIcon sx={{ fontSize: 40, color: '#2196F3', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  ${minRate.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lowest Rate
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <TrendingUpIcon sx={{ fontSize: 40, color: '#FF9800', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  ${maxRate.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Highest Rate
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search pricing by zone, REP, or load profile..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 600 }}
          />
        </Box>

        {/* Pricing Table */}
        <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 0 }}>
            <TableContainer 
              component={Paper} 
              sx={{ 
                borderRadius: 2,
                maxHeight: 600,
                '& .MuiTableCell-root': {
                  borderBottom: '1px solid #f0f0f0'
                }
              }}
            >
              <Table stickyHeader>
                <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: '#333' }}>Zone</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333' }}>REP</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333' }}>Load Profile</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333' }}>Daily Rate</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333' }}>Term (Months)</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333' }}>Min MWh</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333' }}>Max MWh</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow 
                      key={record.id}
                      hover
                      sx={{ 
                        '&:hover': {
                          backgroundColor: '#f8f9fa'
                        }
                      }}
                    >
                      <TableCell>
                        <Chip 
                          label={record.zone} 
                          color={getZoneColor(record.zone)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {record.rep}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={record.loadProfile} 
                          color={getLoadProfileColor(record.loadProfile)}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium" color="primary">
                          ${record.dailyRate?.toFixed(2) || '0.00'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {record.termMonths || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {record.minMwh?.toFixed(1) || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {record.maxMwh?.toFixed(1) || 'N/A'}
                        </Typography>
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

export default PricingDashboard;
