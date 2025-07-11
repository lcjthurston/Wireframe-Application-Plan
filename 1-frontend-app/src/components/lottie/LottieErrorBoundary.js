import React from 'react';
import styled from 'styled-components';

class LottieErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Lottie Error Boundary caught an error:', error, errorInfo);
    }

    // Call onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });

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

      // Custom fallback component
      if (fallback) {
        return typeof fallback === 'function' 
          ? fallback(this.state.error, this.handleRetry)
          : fallback;
      }

      // Default error UI
      return (
        <ErrorContainer 
          style={{ width, height, ...style }} 
          className={className}
        >
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorTitle>Animation Error</ErrorTitle>
          <ErrorMessage>
            Failed to load or render the animation
          </ErrorMessage>
          
          {showDetails && this.state.error && (
            <ErrorDetails>
              <strong>Error:</strong> {this.state.error.message}
            </ErrorDetails>
          )}
          
          {showRetry && (
            <RetryButton onClick={this.handleRetry}>
              Try Again
            </RetryButton>
          )}
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

// Styled Components
const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(255, 0, 0, 0.05);
  border: 1px solid rgba(255, 0, 0, 0.2);
  border-radius: 8px;
  text-align: center;
  gap: 12px;
`;

const ErrorIcon = styled.div`
  font-size: 24px;
`;

const ErrorTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #d32f2f;
`;

const ErrorMessage = styled.p`
  margin: 0;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
`;

const ErrorDetails = styled.div`
  font-size: 12px;
  color: #999;
  background: rgba(0, 0, 0, 0.05);
  padding: 8px 12px;
  border-radius: 4px;
  max-width: 100%;
  word-break: break-word;
`;

const RetryButton = styled.button`
  background: #d32f2f;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #b71c1c;
  }

  &:active {
    transform: translateY(1px);
  }
`;

export default LottieErrorBoundary;
