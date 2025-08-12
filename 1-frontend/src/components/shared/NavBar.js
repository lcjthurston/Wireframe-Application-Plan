import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  TextField,
  Typography
} from '@mui/material';
import {
  Search as SearchIcon,
  AccountCircle as AccountIcon,
  Dashboard as DashboardIcon,
  Email as EmailIcon,
  AttachMoney as MoneyIcon,
  Business as BusinessIcon,
  HealthAndSafety as HealthIcon,
  Assignment as TaskIcon
} from '@mui/icons-material';
import kilowattImage from '../../assets/image.png';

const NavBar = ({ 
  onNavigate, 
  onProfileMenuOpen, 
  userProfile, 
  searchQuery, 
  setSearchQuery, 
  currentPage,
  className = "app-bar" 
}) => {
  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const getButtonVariant = (page) => {
    return currentPage === page ? 'contained' : 'inherit';
  };

  const getButtonSx = (page) => {
    return currentPage === page 
      ? { bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }
      : {};
  };

  return (
    <AppBar position="static" className={className}>
      <Toolbar sx={{ 
        minHeight: 72, 
        padding: '0 24px',
        '@media (max-width: 1200px)': {
          flexWrap: 'wrap',
          minHeight: 80
        }
      }}>
        {/* Logo Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Box 
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => onNavigate('home')}
          >
            <img 
              src={kilowattImage} 
              alt="Kilowatt" 
              style={{
                width: '44px',
                height: '44px',
                marginRight: '14px',
                borderRadius: '9px'
              }}
            />
            <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
              Kilowatt
            </Typography>
          </Box>
        </Box>

        {/* Navigation Buttons */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1, 
          mr: 2,
          '@media (max-width: 900px)': {
            '& .MuiButton-root': {
              fontSize: '0.75rem',
              padding: '4px 8px',
              '& .MuiButton-startIcon': {
                marginRight: '4px'
              }
            }
          },
          '@media (max-width: 768px)': {
            '& .MuiButton-root': {
              '& .MuiButton-startIcon': {
                marginRight: 0
              },
              '& span:not(.MuiButton-startIcon)': {
                display: 'none'
              }
            }
          }
        }}>
          <Button
            color="inherit"
            variant={getButtonVariant('manager')}
            startIcon={<DashboardIcon />}
            onClick={() => onNavigate('manager')}
            size="small"
            sx={getButtonSx('manager')}
          >
            Manager
          </Button>
          <Button
            color="inherit"
            variant={getButtonVariant('companies')}
            startIcon={<BusinessIcon />}
            onClick={() => onNavigate('companies')}
            size="small"
            sx={getButtonSx('companies')}
          >
            Companies
          </Button>
          <Button
            color="inherit"
            variant={getButtonVariant('email-draft')}
            startIcon={<EmailIcon />}
            onClick={() => onNavigate('email-draft')}
            size="small"
            sx={getButtonSx('email-draft')}
          >
            Email Drafts
          </Button>
          <Button
            color="inherit"
            variant={getButtonVariant('commission')}
            startIcon={<MoneyIcon />}
            onClick={() => onNavigate('commission')}
            size="small"
            sx={getButtonSx('commission')}
          >
            Commission
          </Button>
          <Button
            color="inherit"
            variant={getButtonVariant('provider')}
            startIcon={<BusinessIcon />}
            onClick={() => onNavigate('provider')}
            size="small"
            sx={getButtonSx('provider')}
          >
            Providers
          </Button>
          <Button
            color="inherit"
            variant={getButtonVariant('system-health')}
            startIcon={<HealthIcon />}
            onClick={() => onNavigate('system-health')}
            size="small"
            sx={getButtonSx('system-health')}
          >
            System Health
          </Button>
          <Button
            color="inherit"
            variant={getButtonVariant('task-queue')}
            startIcon={<TaskIcon />}
            onClick={() => onNavigate('task-queue')}
            size="small"
            sx={getButtonSx('task-queue')}
          >
            Task Queue
          </Button>
          <Button
            color="inherit"
            variant={getButtonVariant('accounts')}
            startIcon={<BusinessIcon />}
            onClick={() => onNavigate('accounts')}
            size="small"
            sx={getButtonSx('accounts')}
          >
            Accounts
          </Button>
        </Box>

        {/* Search Bar */}
        <Box sx={{ mr: 2 }}>
          <TextField
            placeholder="Search..."
            value={searchQuery || ''}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255,255,255,0.1)',
                '& fieldset': {
                  borderColor: 'rgba(255,255,255,0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255,255,255,0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'rgba(255,255,255,0.7)',
                },
                '& input': {
                  color: 'white',
                  '&::placeholder': {
                    color: 'rgba(255,255,255,0.7)',
                    opacity: 1,
                  },
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ color: 'rgba(255,255,255,0.7)', mr: 1 }} />
              ),
            }}
          />
        </Box>

        {/* Profile Button */}
        <Button
          color="inherit"
          onClick={onProfileMenuOpen}
          startIcon={<AccountIcon />}
        >
          {userProfile?.name || 'Profile'}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
