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
  Link
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import kilowattImage from '../assets/image.png';

const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [animationLoaded, setAnimationLoaded] = useState(false);
  const [Player, setPlayer] = useState(null);
  const [serverAnimation, setServerAnimation] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const loadAnimation = async () => {
      try {
        // Dynamically import lottie-react
        const lottieModule = await import('lottie-react');
        setPlayer(() => lottieModule.Player);
        
        // Dynamically import the animation JSON
        const animationData = await import('../assets/serverAnimation.json');
        setServerAnimation(animationData.default);
        setAnimationLoaded(true);
      } catch (error) {
        console.warn('Animation failed to load:', error);
        setAnimationLoaded(true); // Still set to true so the page renders
      }
    };

    loadAnimation();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const newErrors = {};
    if (!formData.username) {
      newErrors.username = 'Username or email is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Login attempt:', formData);
      onLogin();
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
  };

  const StyledCard = styled(Card)(({ theme }) => ({
    width: '100%',
    maxWidth: 450,
    borderRadius: 20,
    boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
    padding: theme.spacing(7),
    position: 'relative',
    zIndex: 3,
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(5),
      maxWidth: '90%',
      margin: theme.spacing(2.5),
    },
  }));

  const LogoImage = styled('img')({
    width: 90,
    height: 90,
    marginBottom: 20,
    borderRadius: 14,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  });

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
          }}
        >
          <StyledCard>
            <CardContent sx={{ textAlign: 'center', p: 0 }}>
              <Box sx={{ mb: 5 }}>
                <LogoImage src={kilowattImage} alt="Kilowatt Logo" />
                <Typography variant="h3" component="h1" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                  Kilowatt
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Business Intelligence Platform
                </Typography>
              </Box>
              
              {errors.general && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {errors.general}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} sx={{ textAlign: 'left' }}>
                <TextField
                  fullWidth
                  label="Username or Email"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  error={!!errors.username}
                  helperText={errors.username}
                  margin="normal"
                  autoComplete="username"
                  sx={{ mb: 2 }}
                  InputProps={{
                    style: { fontSize: '1.125rem', padding: '14px 12px' }
                  }}
                  InputLabelProps={{
                    style: { fontSize: '1.125rem' }
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  margin="normal"
                  autoComplete="current-password"
                  sx={{ mb: 3 }}
                  InputProps={{
                    style: { fontSize: '1.125rem', padding: '14px 12px' }
                  }}
                  InputLabelProps={{
                    style: { fontSize: '1.125rem' }
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  sx={{ 
                    mb: 2, 
                    py: 1.5, 
                    fontSize: '1.125rem',
                    fontWeight: 600
                  }}
                >
                  {isLoading ? (
                    <>
                      <CircularProgress size={22} sx={{ mr: 1.5 }} />
                      Logging in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                  <Link
                    component="button"
                    variant="h6"
                    onClick={handleForgotPassword}
                    sx={{ 
                      cursor: 'pointer',
                      fontSize: '1.125rem',
                      fontWeight: 500
                    }}
                  >
                    Forgot Password?
                  </Link>
                </Box>
              </Box>
            </CardContent>
          </StyledCard>
          
          <Box
            sx={{
              width: isMobile ? '100%' : 400,
              maxWidth: 450,
              minWidth: 300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mt: isMobile ? 4 : 0,
              height: 400,
              overflow: 'visible',
            }}
          >
            <div
              style={{ 
                width: '100%', 
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              dangerouslySetInnerHTML={{
                __html: `<lottie-player
                  src="/assets/serverAnimation.json"
                  background="transparent"
                  speed="1"
                  style="width: 100%; height: 100%;"
                  loop
                  autoplay
                  mode="normal"
                  rendererSettings='{"preserveAspectRatio": "xMidYMid slice"}'
                ></lottie-player>`
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage; 