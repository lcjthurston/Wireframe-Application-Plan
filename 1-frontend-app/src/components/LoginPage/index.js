import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  Tab,
  Tabs,
  InputAdornment,
  IconButton,
  Link,
  Alert,
  Fade
} from '@mui/material';
import {
  Person,
  Email,
  Visibility,
  VisibilityOff,
  Login,
  PersonAdd
} from '@mui/icons-material';
import kilowattImage from '../../assets/image.png';

const LoginPage = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: 'admin',
    password: 'password',
    email: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError('');
  };

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (activeTab === 0) {
        // Sign In
        if (formData.username === 'admin' && formData.password === 'password') {
          setTimeout(() => {
            onLogin();
            setLoading(false);
          }, 1000);
        } else {
          setError('Invalid username or password');
          setLoading(false);
        }
      } else {
        // Sign Up
        if (!formData.email || !formData.password || !formData.confirmPassword) {
          setError('Please fill in all fields');
          setLoading(false);
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        // Mock successful signup
        setTimeout(() => {
          setActiveTab(0);
          setError('');
          setLoading(false);
          setFormData({ ...formData, username: formData.email, password: '', confirmPassword: '' });
        }, 1000);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #C82828 0%, #B71C1C 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            flexDirection: { xs: 'column', md: 'row' }
          }}
        >
          {/* Welcome Section */}
          <Box
            sx={{
              color: 'white',
              textAlign: { xs: 'center', md: 'left' },
              mb: { xs: 4, md: 0 }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <img 
                src={kilowattImage} 
                alt="Kilowatt Logo" 
                style={{ width: 60, height: 60, marginRight: 16, borderRadius: 12 }}
              />
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                kiloWatt
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
              Welcome to Your
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 400 }}>
              Business Intelligence Platform
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.8, mt: 2, maxWidth: 400 }}>
              Streamline energy business operations with our comprehensive management platform.
            </Typography>
          </Box>

          {/* Login Card */}
          <Card
            sx={{
              maxWidth: 450,
              width: '100%',
              borderRadius: 4,
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#C82828', mb: 1 }}>
                  Kilowatt
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Business Intelligence Platform
                </Typography>
              </Box>

              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{
                  mb: 3,
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1rem'
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#C82828',
                    height: 3,
                    borderRadius: 2
                  }
                }}
              >
                <Tab
                  icon={<Person />}
                  label="Sign In"
                  iconPosition="start"
                  sx={{ color: activeTab === 0 ? '#C82828' : 'text.secondary' }}
                />
                <Tab
                  icon={<Email />}
                  label="Sign Up"
                  iconPosition="start"
                  sx={{ color: activeTab === 1 ? '#C82828' : 'text.secondary' }}
                />
              </Tabs>

              {error && (
                <Fade in={!!error}>
                  <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    {error}
                  </Alert>
                </Fade>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                {activeTab === 0 ? (
                  // Sign In Form
                  <>
                    <TextField
                      fullWidth
                      label="Username"
                      value={formData.username}
                      onChange={handleInputChange('username')}
                      margin="normal"
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3
                        }
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange('password')}
                      margin="normal"
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3
                        }
                      }}
                    />
                  </>
                ) : (
                  // Sign Up Form
                  <>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange('email')}
                      margin="normal"
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3
                        }
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange('password')}
                      margin="normal"
                      required
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3
                        }
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Confirm Password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleInputChange('confirmPassword')}
                      margin="normal"
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3
                        }
                      }}
                    />
                  </>
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  startIcon={activeTab === 0 ? <Login /> : <PersonAdd />}
                  sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.5,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #C82828 0%, #B71C1C 100%)',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #B71C1C 0%, #A01818 100%)',
                    },
                    '&:disabled': {
                      background: '#ccc'
                    }
                  }}
                >
                  {loading ? 'Please wait...' : (activeTab === 0 ? 'Sign In' : 'Sign Up')}
                </Button>

                {activeTab === 0 && (
                  <Box sx={{ textAlign: 'center' }}>
                    <Link
                      href="#"
                      color="primary"
                      sx={{
                        textDecoration: 'none',
                        fontWeight: 500,
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      Forgot Password?
                    </Link>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage; 
