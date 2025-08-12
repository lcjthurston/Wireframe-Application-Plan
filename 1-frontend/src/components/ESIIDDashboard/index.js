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
  Bolt as BoltIcon,
  Business as BusinessIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as AttachMoneyIcon
} from '@mui/icons-material';
import NavBar from '../shared/NavBar';

const ESIIDDashboard = ({ onLogout, onNavigate }) => {
  const [esiids, setEsiids] = useState([]);
  const [filteredEsiids, setFilteredEsiids] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({});

  // Load real ESIID data
  useEffect(() => {
    const loadESIIDData = async () => {
      try {
        // Import the real ESIID data
        const esiidsData = await import('../../data/esiids.json');
        const realEsiids = esiidsData.default || esiidsData;
        
        console.log(`📊 Loaded ${realEsiids.length} real ESIIDs from database`);
        setEsiids(realEsiids);
        setFilteredEsiids(realEsiids);

        // Load statistics
        const statsData = await import('../../data/esiid-stats.json');
        const realStats = statsData.default || statsData;
        setStats(realStats);
      } catch (error) {
        console.error('❌ Error loading ESIID data:', error);
        
        // Fallback to sample data if import fails
        const fallbackEsiids = [
          {
            id: 1,
            esiId: 'Sample ESIID',
            accountName: 'Sample Account',
            serviceAddress: 'Sample Address',
            rep: 'Sample REP',
            kwhMo: 1000,
            kwhYr: 12000,
            totalBill: 150,
            loadProfile: 'Sample Profile',
            zone: 'Sample Zone'
          }
        ];
        setEsiids(fallbackEsiids);
        setFilteredEsiids(fallbackEsiids);
      }
    };
    
    loadESIIDData();
  }, []);

  // Filter ESIIDs based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredEsiids(esiids);
    } else {
      const filtered = esiids.filter(esiid =>
        esiid.esiId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        esiid.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        esiid.rep.toLowerCase().includes(searchQuery.toLowerCase()) ||
        esiid.serviceAddress.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEsiids(filtered);
    }
  }, [searchQuery, esiids]);

  const getStatusColor = (status) => {
    if (status === 0) return 'success';
    if (status === 1) return 'warning';
    return 'default';
  };

  const getStatusLabel = (status) => {
    if (status === 0) return 'Active';
    if (status === 1) return 'Pending';
    return 'Unknown';
  };

  // Calculate statistics from loaded data
  const totalEsiids = esiids.length;
  const totalKwhMo = esiids.reduce((sum, e) => sum + (e.kwhMo || 0), 0);
  const totalBilling = esiids.reduce((sum, e) => sum + (e.totalBill || 0), 0);
  const avgKwhMo = totalEsiids > 0 ? totalKwhMo / totalEsiids : 0;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <NavBar 
        onNavigate={onNavigate}
        onProfileMenuOpen={onLogout}
        userProfile={{ name: 'Profile' }}
        currentPage="esiids"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            ESIID Dashboard
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => onNavigate('addESIID')}
            size="large"
            sx={{ 
              background: 'linear-gradient(135deg, #C82828 0%, #B71C1C 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #B71C1C 0%, #A01818 100%)'
              }
            }}
          >
            Add ESIID
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <BusinessIcon sx={{ fontSize: 40, color: '#C82828', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {totalEsiids.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total ESIIDs
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <BoltIcon sx={{ fontSize: 40, color: '#FF9800', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {(totalKwhMo / 1000000).toFixed(1)}M
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total kWh/Month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <AttachMoneyIcon sx={{ fontSize: 40, color: '#4CAF50', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  ${(totalBilling / 1000).toFixed(0)}K
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Billing
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <TrendingUpIcon sx={{ fontSize: 40, color: '#2196F3', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {avgKwhMo.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg kWh/Month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search ESIIDs by ID, account name, REP, or address..."
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

        {/* ESIIDs Table */}
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
                    <TableCell sx={{ fontWeight: 600, color: '#333' }}>ESIID</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333' }}>Account</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333' }}>REP</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333' }}>kWh/Month</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333' }}>Bill Amount</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333' }}>Load Profile</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEsiids.map((esiid) => (
                    <TableRow 
                      key={esiid.id}
                      hover
                      sx={{ 
                        '&:hover': {
                          backgroundColor: '#f8f9fa'
                        }
                      }}
                    >
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight="medium">
                          {esiid.esiId}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {esiid.serviceAddress}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {esiid.accountName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={esiid.rep} 
                          color="primary"
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {esiid.kwhMo?.toLocaleString() || 0}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          ${esiid.totalBill?.toLocaleString() || 0}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {esiid.loadProfile || 'Unknown'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={getStatusLabel(esiid.status)} 
                          color={getStatusColor(esiid.status)}
                          size="small"
                        />
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

export default ESIIDDashboard;
