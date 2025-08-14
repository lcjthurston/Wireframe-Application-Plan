import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

class LottieErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Lottie Error Boundary caught an error:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  render() {
    if (this.state.hasError) {
      const {
        fallback,
        showRetry = true,
        showDetails = process.env.NODE_ENV === 'development',
        width = '100%',
        height = '100%',
        className,
        style
      } = this.props;

      if (fallback) {
        return typeof fallback === 'function' 
          ? fallback(this.state.error, this.handleRetry)
          : fallback;
      }

      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 2.5,
            backgroundColor: 'rgba(255, 0, 0, 0.05)',
            border: '1px solid rgba(255, 0, 0, 0.2)',
            borderRadius: 1,
            textAlign: 'center',
            gap: 1.5,
            width,
            height,
            ...style
          }}
          className={className}
        >
          <Typography variant="h4">⚠</Typography>
          <Typography variant="h6" color="error">
            Animation Error
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Failed to load or render the animation
          </Typography>
          
          {showDetails && this.state.error && (
            <Typography variant="caption" color="error" sx={{ mt: 1 }}>
              <strong>Error:</strong> {this.state.error.message}
            </Typography>
          )}
          
          {showRetry && (
            <Button 
              variant="outlined" 
              size="small" 
              onClick={this.handleRetry}
              sx={{ mt: 1 }}
            >
              Try Again
            </Button>
          )}
        </Box>
      );
    }

    return this.props.children;
  }
}

export default LottieErrorBoundary;
