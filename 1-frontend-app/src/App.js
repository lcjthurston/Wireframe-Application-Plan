import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import TaskQueue from './components/TaskQueue';
import AccountDashboard from './components/AccountDashboard';
import AccountsList from './components/AccountsList';
import ManagerDashboard from './components/ManagerDashboard';
import EmailDraftDashboard from './components/EmailDraftDashboard';
import CommissionDashboard from './components/CommissionDashboard';
import ProviderDashboard from './components/ProviderDashboard';
import SystemHealthDashboard from './components/SystemHealthDashboard';
import DataEntryModal from './components/DataEntryModal';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [isDataEntryModalOpen, setIsDataEntryModalOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(null);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('home');
  };

  const handleNavigation = (page, params = {}) => {
    setCurrentPage(page);
    if (params.accountId) {
      setSelectedAccountId(params.accountId);
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

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onLogout={handleLogout} onNavigate={handleNavigation} onOpenDataEntry={handleOpenDataEntry} />;
      case 'task-queue':
        return <TaskQueue onLogout={handleLogout} onNavigate={handleNavigation} />;
      case 'accounts':
        return <AccountsList onLogout={handleLogout} onNavigate={handleNavigation} />;
      case 'account-detail':
        return <AccountDashboard onLogout={handleLogout} onNavigate={handleNavigation} accountId={selectedAccountId} />;
      case 'manager':
        return <ManagerDashboard onLogout={handleLogout} onNavigate={handleNavigation} />;
      case 'email-draft':
        return <EmailDraftDashboard onLogout={handleLogout} onNavigate={handleNavigation} />;
      case 'commission':
        return <CommissionDashboard onLogout={handleLogout} onNavigate={handleNavigation} />;
      case 'provider':
        return <ProviderDashboard onLogout={handleLogout} onNavigate={handleNavigation} />;
      case 'system-health':
        return <SystemHealthDashboard onLogout={handleLogout} onNavigate={handleNavigation} />;
      default:
        return <HomePage onLogout={handleLogout} onNavigate={handleNavigation} onOpenDataEntry={handleOpenDataEntry} />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        {isLoggedIn ? (
          <>
            {renderPage()}
            <DataEntryModal
              isOpen={isDataEntryModalOpen}
              onClose={handleCloseDataEntry}
              onSave={handleSaveDataEntry}
              onNavigate={handleNavigation}
            />
          </>
        ) : (
          <LoginPage onLogin={handleLogin} />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App; 