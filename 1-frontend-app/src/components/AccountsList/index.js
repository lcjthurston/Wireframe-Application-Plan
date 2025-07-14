import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  Divider,
  Button,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Search,
  MoreVert,
  AccountCircle,
  Business,
  Home,
  Edit,
  Delete,
  Visibility,
  FilterList
} from '@mui/icons-material';

const AccountsList = ({ onNavigate, onSelectAccount }) => {
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAccountId, setSelectedAccountId] = useState(null);

  // Mock accounts data
  const mockAccounts = [
    {
      id: 1,
      accountName: 'Tech Solutions Inc',
      customerName: 'John Smith',
      accountType: 'Commercial',
      status: 'Active',
      monthlyUsage: 15000,
      monthlyBill: 1800,
      lastActivity: '2024-01-15'
    },
    {
      id: 2,
      accountName: 'Downtown Restaurant',
      customerName: 'Maria Garcia',
      accountType: 'Commercial',
      status: 'Active',
      monthlyUsage: 8500,
      monthlyBill: 850,
      lastActivity: '2024-01-14'
    },
    {
      id: 3,
      accountName: 'Smith Residence',
      customerName: 'Robert Smith',
      accountType: 'Residential',
      status: 'Pending',
      monthlyUsage: 1200,
      monthlyBill: 96,
      lastActivity: '2024-01-13'
    },
    {
      id: 4,
      accountName: 'Manufacturing Corp',
      customerName: 'David Wilson',
      accountType: 'Industrial',
      status: 'Active',
      monthlyUsage: 45000,
      monthlyBill: 4500,
      lastActivity: '2024-01-12'
    },
    {
      id: 5,
      accountName: 'Green Energy Co',
      customerName: 'Lisa Rodriguez',
      accountType: 'Commercial',
      status: 'Active',
      monthlyUsage: 25000,
      monthlyBill: 2750,
      lastActivity: '2024-01-11'
    },
    {
      id: 6,
      accountName: 'Manufacturing Plus',
      customerName: 'David Kim',
      accountType: 'Industrial',
      status: 'Pending',
      monthlyUsage: 30000,
      monthlyBill: 3300,
      lastActivity: '2024-01-10'
    }
  ];

  // Filter accounts based on search and filter type
  const filteredAccounts = mockAccounts.filter(account => {
    const matchesSearch = account.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || account.status === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleNavigation = (page) => {
    console.log('Navigating to:', page);
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const handleProfileAction = (action) => {
    console.log('Profile action:', action);
    if (action === 'logout') {
      onLogout();
    }
  };

  const handleNewAccount = () => {
    setShowDataEntryModal(true);
  };

  const handleCloseDataEntryModal = () => {
    setShowDataEntryModal(false);
  };

  const handleSaveNewAccount = (data) => {
    console.log('New Account Data:', data);
    setShowDataEntryModal(false);
  };

  const handleAccountClick = (accountId) => {
    // Navigate to account detail view
    onNavigate('account-detail', { accountId });
  };

  const getStatusChipColor = (statusColor) => {
    switch (statusColor) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'error';
      case 'info': return 'info';
      default: return 'default';
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <PageContainer>
      {/* Dynamic Background Layers */}
      <BackgroundGradient />
      <BackgroundPattern />
      <FloatingShapes />

      {/* Top AppBar */}
      <AppBar position="static" className="accounts-list-app-bar">
        <Toolbar className="accounts-list-toolbar">
          <Box display="flex" alignItems="center" flexGrow={1}>
            <Box
              sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => handleNavigation('home')}
            >
              <img src={kilowattImage} alt="Kilowatt" className="accounts-list-logo" />
              <Typography variant="h5" className="accounts-list-brand">
                Kilowatt
              </Typography>
            </Box>
            {/* Navigation Links */}
            <Box ml={4} display="flex" alignItems="center" gap={2}>
              <Button color="inherit" onClick={() => handleNavigation('home')}>Home</Button>
              <Button color="inherit" onClick={() => handleNavigation('task-queue')}>Task Queue</Button>
              <Button color="inherit" onClick={() => handleNavigation('accounts')} variant="outlined">Accounts</Button>
              <Button
                color="primary"
                variant="contained"
                onClick={handleNewAccount}
                startIcon={<AddIcon />}
                sx={{ ml: 2 }}
              >
                Add Account
              </Button>
              <Button
                color="inherit"
                onClick={() => setDropdownOpen(v => !v)}
                ref={dropdownRef}
                endIcon={<MoreVert />}
              >
                More
              </Button>
              {dropdownOpen && (
                <Menu
                  anchorEl={dropdownRef.current}
                  open={dropdownOpen}
                  onClose={() => setDropdownOpen(false)}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                >
                  <MenuItem onClick={() => { setDropdownOpen(false); handleNavigation('manager'); }}>Managers</MenuItem>
                  <MenuItem onClick={() => { setDropdownOpen(false); handleNavigation('email-draft'); }}>Email Drafts</MenuItem>
                  <MenuItem onClick={() => { setDropdownOpen(false); handleNavigation('commission'); }}>Commissions</MenuItem>
                  <MenuItem onClick={() => { setDropdownOpen(false); handleNavigation('provider'); }}>Providers</MenuItem>
                  <MenuItem onClick={() => { setDropdownOpen(false); handleNavigation('system-health'); }}>System Health</MenuItem>
                </Menu>
              )}
            </Box>
          </Box>

          {/* Search */}
          <Box className="accounts-list-search-container">
            <TextField
              placeholder="Search accounts, managers, etc..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="accounts-list-search-field"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Profile */}
          <Button
            color="inherit"
            className="accounts-list-profile-button"
            onClick={() => handleProfileAction('profile')}
            startIcon={<AccountCircle />}
          >
            John Doe
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <MainContainer>
        {/* Header Section */}
        <HeaderSection>
          <Typography variant="h4" className="page-title">
            Accounts
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage all customer accounts and their details
          </Typography>
        </HeaderSection>

        {/* Filters Section */}
        <FiltersSection>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Status Filter</InputLabel>
                <Select
                  multiple
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  input={<OutlinedInput label="Status Filter" />}
                  renderValue={(selected) => selected.join(', ')}
                >
                  {uniqueStatuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      <Checkbox checked={statusFilter.indexOf(status) > -1} />
                      <ListItemText primary={status} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Manager Filter</InputLabel>
                <Select
                  multiple
                  value={managerFilter}
                  onChange={(e) => setManagerFilter(e.target.value)}
                  input={<OutlinedInput label="Manager Filter" />}
                  renderValue={(selected) => selected.join(', ')}
                >
                  <MenuItem value="Unassigned">
                    <Checkbox checked={managerFilter.indexOf('Unassigned') > -1} />
                    <ListItemText primary="Unassigned" />
                  </MenuItem>
                  {uniqueManagers.map((manager) => (
                    <MenuItem key={manager} value={manager}>
                      <Checkbox checked={managerFilter.indexOf(manager) > -1} />
                      <ListItemText primary={manager} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Company Filter</InputLabel>
                <Select
                  multiple
                  value={companyFilter}
                  onChange={(e) => setCompanyFilter(e.target.value)}
                  input={<OutlinedInput label="Company Filter" />}
                  renderValue={(selected) => selected.join(', ')}
                >
                  {uniqueCompanies.map((company) => (
                    <MenuItem key={company} value={company}>
                      <Checkbox checked={companyFilter.indexOf(company) > -1} />
                      <ListItemText primary={company} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => {
                  setStatusFilter([]);
                  setManagerFilter([]);
                  setCompanyFilter([]);
                  setSearchTerm('');
                }}
                fullWidth
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </FiltersSection>

        {/* Accounts Table */}
        <TableContainer component={Paper} className="accounts-table-container">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Account Name</TableCell>
                <TableCell>Manager</TableCell>
                <TableCell>Management Company</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAccounts.map((account) => (
                <TableRow 
                  key={account.id} 
                  hover 
                  className="account-row"
                  onClick={() => handleAccountClick(account.id)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Business sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body1" fontWeight="medium">
                        {account.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {account.manager ? (
                      <Box display="flex" alignItems="center">
                        <Person sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {account.manager}
                        </Typography>
                      </Box>
                    ) : (
                      <Chip label="Unassigned" size="small" color="error" variant="outlined" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {account.managementCompany}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={account.status} 
                      color={getStatusChipColor(account.statusColor)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAccountClick(account.id);
                      }}
                    >
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Results Summary */}
        <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="text.secondary">
            Showing {filteredAccounts.length} of {accounts.length} accounts
          </Typography>
        </Box>
      </MainContainer>

      {/* Data Entry Modal */}
      <DataEntryModal
        isOpen={showDataEntryModal}
        onClose={handleCloseDataEntryModal}
        onSave={handleSaveNewAccount}
        onNavigate={handleNavigation}
      />
    </PageContainer>
  );
};

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${colors.primary.light} 0%, ${colors.primary.main} 100%);
  position: relative;
  overflow-x: hidden;
`;

const BackgroundGradient = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    ${colors.primary.light}15 0%,
    ${colors.primary.main}25 25%,
    ${colors.secondary.light}15 50%,
    ${colors.primary.dark}20 75%,
    ${colors.primary.main}30 100%
  );
  z-index: 1;
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(circle at 25% 25%, ${colors.primary.light}20 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, ${colors.secondary.light}15 0%, transparent 50%);
  z-index: 2;
`;

const FloatingShapes = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3;

  &::before {
    content: '';
    position: absolute;
    top: 10%;
    right: 10%;
    width: 200px;
    height: 200px;
    background: ${colors.primary.light}10;
    border-radius: 50%;
    animation: float 6s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 20%;
    left: 15%;
    width: 150px;
    height: 150px;
    background: ${colors.secondary.light}08;
    border-radius: 50%;
    animation: float 8s ease-in-out infinite reverse;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }
`;

const MainContainer = styled.div`
  position: relative;
  z-index: 10;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const HeaderSection = styled.div`
  margin-bottom: 2rem;
  text-align: center;

  .page-title {
    color: white;
    font-weight: 700;
    margin-bottom: 0.5rem;
    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  }
`;

const FiltersSection = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

export default AccountsList;

