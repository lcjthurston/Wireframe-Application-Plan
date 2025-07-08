import React, { useState } from 'react';
import styled from 'styled-components';
import kilowattImage from '../assets/image.png';
import colors from '../assets/colors';

const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
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
    
    // Basic validation
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

    // Simulate API call
    try {
      // TODO: Replace with actual login API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Login attempt:', formData);
      // Handle successful login here
      onLogin(); // Call the onLogin prop to switch to HomePage
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // TODO: Implement forgot password functionality
    console.log('Forgot password clicked');
  };

  return (
    <LoginContainer>
      <BackgroundGradient />
      <BackgroundPattern />
      
      <LoginCard as="form" onSubmit={handleSubmit}>
        <LogoSection>
          <LogoImage src={kilowattImage} alt="Kilowatt Logo" />
          <LogoText>Kilowatt</LogoText>
          <Tagline>Business Intelligence Platform</Tagline>
        </LogoSection>
        
        {errors.general && (
          <ErrorMessage>{errors.general}</ErrorMessage>
        )}

        <FormSection>
          <FormGroup>
            <Label htmlFor="username">Username or Email</Label>
            <Input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter your username or email"
              hasError={!!errors.username}
              autoComplete="username"
            />
            {errors.username && (
              <FieldError>{errors.username}</FieldError>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              hasError={!!errors.password}
              autoComplete="current-password"
            />
            {errors.password && (
              <FieldError>{errors.password}</FieldError>
            )}
          </FormGroup>

          <LoginButton 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner />
                Logging in...
              </>
            ) : (
              'Sign In'
            )}
          </LoginButton>

          <ForgotPasswordLink onClick={handleForgotPassword}>
            Forgot Password?
          </ForgotPasswordLink>
        </FormSection>
      </LoginCard>
    </LoginContainer>
  );
};

// Styled Components
const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: ${colors.primary};
`;

const BackgroundGradient = styled.div`
  display: none;
`;

const BackgroundPattern = styled.div`
  display: none;
`;

const LoginCard = styled.div`
  width: 100%;
  max-width: 420px;
  background: ${colors.background};
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.10);
  padding: 48px;
  position: relative;
  z-index: 3;
  color: ${colors.text};
  @media (max-width: 768px) {
    padding: 32px;
    max-width: 90%;
    margin: 20px;
  }
`;

const LogoSection = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const LogoImage = styled.img`
  width: 80px;
  height: 80px;
  margin-bottom: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const LogoText = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${colors.primary};
  margin-bottom: 8px;
  background: none;
  -webkit-background-clip: unset;
  -webkit-text-fill-color: unset;
  background-clip: unset;
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Tagline = styled.p`
  font-size: 1.25rem;
  color: ${colors.accent5};
  font-weight: 500;
  margin: 0;
`;

const FormSection = styled.div`
  margin-top: 32px;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${colors.primary};
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  height: 56px;
  padding: 18px 22px;
  border: 2px solid ${props => props.hasError ? '#ef4444' : colors.border};
  border-radius: 12px;
  font-size: 1.25rem;
  font-family: inherit;
  color: ${colors.text};
  background: #fff8f7;
  transition: all 0.3s ease;
  &::placeholder {
    color: #bdbdbd;
    font-size: 1.25rem;
  }
  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 4px rgba(200,40,40,0.08);
    background: #fff;
  }
  &:disabled {
    background-color: #f9fafb;
    cursor: not-allowed;
  }
  @media (max-width: 768px) {
    height: 48px;
    padding: 14px 16px;
    font-size: 1.1rem;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  height: 56px;
  background: ${colors.accent1};
  color: ${colors.textLight};
  border: none;
  border-radius: 12px;
  font-size: 1.5rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  &:hover:not(:disabled) {
    background: ${colors.accent2};
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(200,40,40,0.10);
  }
  &:active:not(:disabled) {
    background: ${colors.accent3};
    transform: translateY(0);
    box-shadow: 0 4px 15px rgba(200,40,40,0.10);
  }
  &:disabled {
    background: ${colors.border};
    color: #bdbdbd;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  @media (max-width: 768px) {
    height: 48px;
    font-size: 1.1rem;
  }
`;

const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ForgotPasswordLink = styled.button`
  background: none;
  border: none;
  color: ${colors.accent1};
  font-size: 1.25rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s ease;
  padding: 8px 0;
  &:hover {
    color: ${colors.accent2};
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #dc2626;
  padding: 16px 20px;
  border-radius: 12px;
  font-size: 1.1rem;
  margin-bottom: 24px;
`;

const FieldError = styled.div`
  color: #dc2626;
  font-size: 1.1rem;
  margin-top: 6px;
  font-weight: 500;
`;

export default LoginPage; 