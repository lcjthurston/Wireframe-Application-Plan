import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import TaskQueue from './components/TaskQueue';
import AccountDashboard from './components/AccountDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import EmailDraftDashboard from './components/EmailDraftDashboard';
import CommissionDashboard from './components/CommissionDashboard';
import ProviderDashboard from './components/ProviderDashboard';
import DataEntryModal from './components/DataEntryModal';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [isDataEntryModalOpen, setIsDataEntryModalOpen] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('home');
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
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
        return <AccountDashboard onLogout={handleLogout} onNavigate={handleNavigation} />;
      case 'managers':
        return <ManagerDashboard onLogout={handleLogout} onNavigate={handleNavigation} />;
      case 'email-drafts':
        return <EmailDraftDashboard onLogout={handleLogout} onNavigate={handleNavigation} />;
      case 'commissions':
        return <CommissionDashboard onLogout={handleLogout} onNavigate={handleNavigation} />;
      case 'providers':
        return <ProviderDashboard onLogout={handleLogout} onNavigate={handleNavigation} />;
      default:
        return <HomePage onLogout={handleLogout} onNavigate={handleNavigation} />;
    }
  };

  return (
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
  );
}

export default App; 