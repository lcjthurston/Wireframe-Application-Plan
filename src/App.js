import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import TaskQueue from './components/TaskQueue';
import AccountDashboard from './components/AccountDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import EmailDraftDashboard from './components/EmailDraftDashboard';
import CommissionDashboard from './components/CommissionDashboard';
import ProviderDashboard from './components/ProviderDashboard';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

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

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onLogout={handleLogout} onNavigate={handleNavigation} />;
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
        renderPage()
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App; 