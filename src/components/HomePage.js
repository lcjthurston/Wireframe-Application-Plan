import React, { useState } from 'react';
import styled from 'styled-components';
import Header from './Header';
import colors from '../assets/colors';

const HomePage = ({ onLogout, onNavigate, onOpenDataEntry }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@kilowatt.com',
    avatar: null
  });

  // Mock data for widgets
  const myTasks = {
    providerSelection: 12,
    superFlagged: 3,
    draftedEmails: 8,
    newAccounts: 5
  };

  const teamTasks = {
    providerSelection: 25,
    superFlagged: 7,
    draftedEmails: 15,
    newAccounts: 12
  };

  const systemHealth = [
    {
      name: 'Email Monitoring',
      status: 'OK',
      lastRun: '2 minutes ago',
      icon: '📧'
    },
    {
      name: 'Centerpoint Usage Retrieval',
      status: 'OK',
      lastRun: '5 minutes ago',
      icon: '⚡'
    },
    {
      name: 'Daily Pricing Imports',
      status: 'ERROR',
      lastRun: '1 hour ago',
      icon: '💰'
    },
    {
      name: 'Contract Follow-up Bot',
      status: 'OK',
      lastRun: '15 minutes ago',
      icon: '📋'
    }
  ];

  const recentActivity = [
    {
      type: 'bot',
      action: 'Contract sent to ABC Corp.',
      timestamp: '2 minutes ago',
      icon: '🤖'
    },
    {
      type: 'user',
      user: 'Sarah Johnson',
      action: 'Updated manager for XYZ Inc.',
      timestamp: '5 minutes ago',
      icon: '👤'
    },
    {
      type: 'bot',
      action: 'New account "Main Street Plaza" created from email',
      timestamp: '8 minutes ago',
      icon: '🤖'
    },
    {
      type: 'user',
      user: 'Mike Chen',
      action: 'Generated pricing sheet for Downtown Center',
      timestamp: '12 minutes ago',
      icon: '👤'
    },
    {
      type: 'bot',
      action: 'Usage data updated for 15 accounts',
      timestamp: '15 minutes ago',
      icon: '🤖'
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // TODO: Implement search functionality
  };

  const handleNavigation = (page) => {
    console.log('Navigating to:', page);
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const handleProfileAction = (action) => {
    console.log('Profile action:', action);
    if (action === 'logout') {
      onLogout();
    }
    // TODO: Implement other profile actions
  };

  return (
    <PageContainer>
      {/* Dynamic Background Layers */}
      <BackgroundGradient />
      <BackgroundPattern />
      <FloatingShapes />
      
      {/* Top Navigation Bar */}
      <Header
        activePage="home"
        onNavigate={handleNavigation}
        onLogout={onLogout}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
      />

      {/* Main Dashboard Content */}
      <DashboardContainer>
        <DashboardHeader>
          <HeaderContent>
            <HeaderLeft>
              <WelcomeMessage>
                Welcome back, {userProfile.name}! 👋
              </WelcomeMessage>
              <DashboardSubtitle>
                Here's what's happening with your business today
              </DashboardSubtitle>
            </HeaderLeft>
            <HeaderRight>
              <NewAccountButton onClick={onOpenDataEntry}>
                ➕ New Account
              </NewAccountButton>
            </HeaderRight>
          </HeaderContent>
        </DashboardHeader>

        {/* My Tasks Widget */}
        <Widget fullWidth>
          <WidgetHeader>
            <WidgetTitle>My Tasks</WidgetTitle>
            <WidgetAction onClick={() => handleNavigation('task-queue')}>
              View All →
            </WidgetAction>
          </WidgetHeader>
          <TaskList>
            <TaskItem onClick={() => handleNavigation('task-queue')}>
              <TaskIcon>🏢</TaskIcon>
              <TaskInfo>
                <TaskName>Accounts Needing Provider Selection</TaskName>
                <TaskCount>{myTasks.providerSelection} tasks</TaskCount>
              </TaskInfo>
            </TaskItem>
            <TaskItem onClick={() => handleNavigation('task-queue')}>
              <TaskIcon>🚨</TaskIcon>
              <TaskInfo>
                <TaskName>Super Flagged Contracts</TaskName>
                <TaskCount>{myTasks.superFlagged} tasks</TaskCount>
              </TaskInfo>
            </TaskItem>
            <TaskItem onClick={() => handleNavigation('email-drafts')}>
              <TaskIcon>📧</TaskIcon>
              <TaskInfo>
                <TaskName>Drafted Emails to Review</TaskName>
                <TaskCount>{myTasks.draftedEmails} emails</TaskCount>
              </TaskInfo>
            </TaskItem>
            <TaskItem onClick={() => handleNavigation('task-queue')}>
              <TaskIcon>✅</TaskIcon>
              <TaskInfo>
                <TaskName>New Accounts for Verification</TaskName>
                <TaskCount>{myTasks.newAccounts} accounts</TaskCount>
              </TaskInfo>
            </TaskItem>
          </TaskList>
        </Widget>

        {/* System Health Widget */}
        <Widget fullWidth>
          <WidgetHeader>
            <WidgetTitle>System Automation Health</WidgetTitle>
            <WidgetAction onClick={() => handleNavigation('system-health')}>
              View Details →
            </WidgetAction>
          </WidgetHeader>
          <SystemHealthList>
            {systemHealth.map((process, index) => (
              <SystemHealthItem key={index}>
                <ProcessIcon>{process.icon}</ProcessIcon>
                <ProcessInfo>
                  <ProcessName>{process.name}</ProcessName>
                  <ProcessStatus status={process.status}>
                    {process.status}
                  </ProcessStatus>
                </ProcessInfo>
                <ProcessTime>{process.lastRun}</ProcessTime>
              </SystemHealthItem>
            ))}
          </SystemHealthList>
        </Widget>

        {/* Recent Activity Widget */}
        <Widget fullWidth>
          <WidgetHeader>
            <WidgetTitle>Recent Activity</WidgetTitle>
            <WidgetAction onClick={() => handleNavigation('activity')}>
              View All →
            </WidgetAction>
          </WidgetHeader>
          <ActivityList>
            {recentActivity.map((activity, index) => (
              <ActivityItem key={index}>
                <ActivityIcon>{activity.icon}</ActivityIcon>
                <ActivityInfo>
                  <ActivityText>
                    {activity.type === 'bot' ? (
                      activity.action
                    ) : (
                      <>
                        <ActivityUser>{activity.user}</ActivityUser>
                        {activity.action}
                      </>
                    )}
                  </ActivityText>
                  <ActivityTime>{activity.timestamp}</ActivityTime>
                </ActivityInfo>
              </ActivityItem>
            ))}
          </ActivityList>
        </Widget>
      </DashboardContainer>
    </PageContainer>
  );
};

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: ${colors.background};
`;

const BackgroundGradient = styled.div`
  display: none;
`;

const BackgroundPattern = styled.div`
  display: none;
`;

const FloatingShapes = styled.div`
  display: none;
`;



const DashboardContainer = styled.div`
  padding: 32px;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 3;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const DashboardHeader = styled.div`
  margin-bottom: 32px;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
`;

const HeaderLeft = styled.div`
  text-align: left;
`;

const HeaderRight = styled.div`
  display: flex;
  gap: 12px;
`;

const NewAccountButton = styled.button`
  background: ${colors.primary};
  border: 2px solid ${colors.primary};
  color: ${colors.background};
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background: ${colors.accent2};
    transform: translateY(-2px);
  }
`;

const WelcomeMessage = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${colors.text};
  margin-bottom: 8px;
`;

const DashboardSubtitle = styled.p`
  font-size: 1.25rem;
  color: ${colors.textLight};
  margin: 0;
`;

const WidgetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const Widget = styled.div`
  background: ${colors.surface};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px ${colors.shadow};
  border: 2px solid ${colors.border};
  grid-column: ${props => props.fullWidth ? '1 / -1' : 'auto'};
  transition: all 0.3s ease;
  color: ${colors.text};
  margin-bottom: 32px;
  &:last-child {
    margin-bottom: 0;
  }
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px ${colors.shadow};
    border-color: ${colors.accent3};
  }
  @media (max-width: 768px) {
    padding: 20px;
    margin-bottom: 20px;
  }
`;

const WidgetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const WidgetTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: ${colors.primary};
  margin: 0;
`;

const WidgetAction = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  font-weight: 500;
  color: ${colors.primary};
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    color: ${colors.accent2};
    transform: translateX(2px);
  }
`;

const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TaskItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${colors.accent5};
  border: 1px solid ${colors.accent6};

  &:hover {
    background: ${colors.surfaceHover};
    transform: translateX(4px);
    border-color: ${colors.primary};
  }
`;

const TaskIcon = styled.span`
  font-size: 20px;
`;

const TaskInfo = styled.div`
  flex: 1;
`;

const TaskName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${colors.text};
  margin-bottom: 2px;
`;

const TaskCount = styled.div`
  font-size: 12px;
  color: ${colors.textLight};
`;

const SystemHealthList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SystemHealthItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background: ${colors.accent5};
  border: 1px solid ${colors.accent6};
`;

const ProcessIcon = styled.span`
  font-size: 20px;
`;

const ProcessInfo = styled.div`
  flex: 1;
`;

const ProcessName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${colors.text};
  margin-bottom: 2px;
`;

const ProcessStatus = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.status === 'OK' ? '#10b981' : '#ef4444'};
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const ProcessTime = styled.div`
  font-size: 12px;
  color: ${colors.textLight};
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: ${colors.accent5};
  border: 1px solid ${colors.accent6};

  &:hover {
    background: ${colors.surfaceHover};
    transform: translateX(4px);
    border-color: ${colors.primary};
  }
`;

const ActivityIcon = styled.span`
  font-size: 16px;
  margin-top: 2px;
`;

const ActivityInfo = styled.div`
  flex: 1;
`;

const ActivityText = styled.div`
  font-size: 14px;
  color: ${colors.text};
  margin-bottom: 4px;
  line-height: 1.4;
`;

const ActivityUser = styled.span`
  font-weight: 600;
  color: ${colors.primary};
`;

const ActivityTime = styled.div`
  font-size: 12px;
  color: ${colors.textLight};
`;

export default HomePage; 