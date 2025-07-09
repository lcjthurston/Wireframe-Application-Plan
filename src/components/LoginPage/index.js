import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container,
  Paper,
  Link,
  Tabs,
  Tab,
  Divider,
  IconButton,
  InputAdornment,
  Fade,
  Slide
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import kilowattImage from '../assets/image.png';
import './LoginPage.scss';

const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [mode, setMode] = useState('signin'); // 'signin' or 'signup'
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (mode === 'signin') {
      if (!formData.username) {
        newErrors.username = 'Username or email is required';
      }
      if (!formData.password) {
        newErrors.password = 'Password is required';
      }
    } else {
      if (!formData.username) {
        newErrors.username = 'Username is required';
      }
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`${mode === 'signin' ? 'Sign in' : 'Sign up'} attempt:`, formData);
      onLogin();
    } catch (error) {
      console.error(`${mode === 'signin' ? 'Sign in' : 'Sign up'} error:`, error);
      setErrors({ general: `${mode === 'signin' ? 'Sign in' : 'Sign up'} failed. Please try again.` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
  };

  const handleModeChange = (event, newMode) => {
    setMode(newMode);
    setErrors({});
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <Box className="login-page">
      <Container maxWidth="lg">
        <Box className="login-container">
          <Card className="login-card">
            <CardContent className="login-card-content">
              <Box className="login-header">
                <img src={kilowattImage} alt="Kilowatt Logo" className="login-logo" />
                <Typography 
                  variant="h2" 
                  component="h1" 
                  className="login-title"
                >
                  Kilowatt
                </Typography>
                <Typography 
                  variant="h6" 
                  color="text.secondary"
                  className="login-subtitle"
                >
                  Business Intelligence Platform
                </Typography>
              </Box>

              <Tabs
                value={mode}
                onChange={handleModeChange}
                centered
                sx={{ mb: 4 }}
              >
                <Tab 
                  label="Sign In" 
                  value="signin"
                  icon={<Person sx={{ mb: 0.5 }} />}
                  iconPosition="top"
                />
                <Tab 
                  label="Sign Up" 
                  value="signup"
                  icon={<Email sx={{ mb: 0.5 }} />}
                  iconPosition="top"
                />
              </Tabs>
              
              {errors.general && (
                <Alert severity="error" className="login-alert">
                  {errors.general}
                </Alert>
              )}

              <Fade in={true} timeout={500}>
                <Box component="form" onSubmit={handleSubmit} className="login-form">
                  <TextField
                    fullWidth
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    error={!!errors.username}
                    helperText={errors.username}
                    margin="normal"
                    autoComplete="username"
                    className="login-text-field"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  {mode === 'signup' && (
                    <Slide direction="up" in={mode === 'signup'} timeout={300}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        margin="normal"
                        autoComplete="email"
                        className="login-text-field"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Slide>
                  )}

                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    margin="normal"
                    autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                    sx={{ mb: mode === 'signup' ? 3 : 4 }}
                    className="login-text-field"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="action" />
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
                  />

                  {mode === 'signup' && (
                    <Slide direction="up" in={mode === 'signup'} timeout={400}>
                      <TextField
                        fullWidth
                        label="Confirm Password"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                        margin="normal"
                        autoComplete="new-password"
                        sx={{ mb: 4 }}
                        className="login-text-field"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock color="action" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                edge="end"
                              >
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Slide>
                  )}

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isLoading}
                    className="login-button"
                  >
                    {isLoading ? (
                      <>
                        <CircularProgress size={24} sx={{ mr: 2, color: 'white' }} />
                        {mode === 'signin' ? 'Signing In...' : 'Creating Account...'}
                      </>
                    ) : (
                      mode === 'signin' ? 'Sign In' : 'Create Account'
                    )}
                  </Button>

                  {mode === 'signin' && (
                    <Box sx={{ textAlign: 'center' }}>
                      <Link
                        component="button"
                        variant="body1"
                        onClick={handleForgotPassword}
                        className="login-forgot-password"
                      >
                        Forgot Password?
                      </Link>
                    </Box>
                  )}
                </Box>
              </Fade>
            </CardContent>
          </Card>
          
          <Box className="login-animation-container">
            <div className="login-animation">
              <div
                style={{ 
                  width: '100%', 
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Typography variant="h4" color="white" sx={{ textAlign: 'center' }}>
                  Welcome to<br />
                  <strong>Kilowatt</strong><br />
                  Business Intelligence Platform
                </Typography>
              </div>
            </div>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage; 