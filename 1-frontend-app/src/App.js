import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, CircularProgress, Typography } from '@mui/material';
import theme from './theme';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import TaskQueue from './components/TaskQueue';
import AccountDashboard from './components/AccountDashboard';
import AccountsList from './components/AccountsList';
import ManagerDashboard from './components/ManagerDashboard';
import EmailDraftDashboard from './components/EmailDraftDashboard';
import CommissionDashboard from './components/CommissionDashboard';
import ProviderDashboard from './components/ProviderDashboard';
import DataEntryModal from './components/DataEntryModal';
import AccountDetail from './components/AccountDetail';

function App() {
  // App component logic remains the same
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

// Loading component
const LoadingScreen = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #c62828 0%, #8e0000 100%)',
      color: 'white',
    }}
  >
    <CircularProgress size={60} sx={{ color: 'white', mb: 2 }} />
    <Typography variant="h6">Loading Kilowatt...</Typography>
  </Box>
);

// Main app content component
const AppContent = () => {
  const { isAuthenticated, loading, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState(() => {
    // Restore current page from localStorage on app load
    return localStorage.getItem('currentPage') || 'home';
  });
  const [isDataEntryModalOpen, setIsDataEntryModalOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(() => {
    // Restore selected account ID from localStorage
    const stored = localStorage.getItem('selectedAccountId');
    return stored ? parseInt(stored) : null;
  });

  const handleNavigation = (page, params = {}) => {
    setCurrentPage(page);
    // Store current page in localStorage
    localStorage.setItem('currentPage', page);
    
    if (params.accountId) {
      setSelectedAccountId(params.accountId);
      localStorage.setItem('selectedAccountId', params.accountId.toString());
    }
  };

  const handleOpenDataEntry = () => {
    setIsDataEntryModalOpen(true);
  };

  const handleCloseDataEntry = () => {
    setIsDataEntryModalOpen(false);
  };

  const handleSaveDataEntry = (data) => {
    console.log('Saving data entry:', data);
    // TODO: Implement data saving logic
  };

  // Show loading screen while checking authentication
  if (loading) {
    return <LoadingScreen />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onLogout={logout} onNavigate={handleNavigation} onOpenDataEntry={handleOpenDataEntry} />;
      case 'task-queue':
        return <TaskQueue onLogout={logout} onNavigate={handleNavigation} />;
      case 'accounts':
        return <AccountsList onLogout={logout} onNavigate={handleNavigation} />;
      case 'account-detail':
        return <AccountDetail onLogout={logout} onNavigate={handleNavigation} accountId={selectedAccountId} />;
      case 'manager':
        return <ManagerDashboard onLogout={logout} onNavigate={handleNavigation} />;
      case 'email-draft':
        return <EmailDraftDashboard onLogout={logout} onNavigate={handleNavigation} />;
      case 'commission':
        return <CommissionDashboard onLogout={logout} onNavigate={handleNavigation} />;
      case 'provider':
        return <ProviderDashboard onLogout={logout} onNavigate={handleNavigation} />;
      default:
        return <HomePage onLogout={logout} onNavigate={handleNavigation} onOpenDataEntry={handleOpenDataEntry} />;
    }
  };

  return (
    <div className="App">
      {isAuthenticated ? (
        <>
          {renderPage()}
          <DataEntryModal
            open={isDataEntryModalOpen}
            onClose={handleCloseDataEntry}
            onSubmit={handleSaveDataEntry}
            onNavigate={handleNavigation}
          />
        </>
      ) : (
        <LoginPage />
      )}
    </div>
  );
};

export default App;
