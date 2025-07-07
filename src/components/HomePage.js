import React, { useState } from 'react';
import styled from 'styled-components';
import kilowattImage from '../assets/image.png';

const HomePage = ({ onLogout, onNavigate }) => {
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
      <NavigationBar>
        <NavLeft>
          <LogoSection>
            <LogoImage src={kilowattImage} alt="Kilowatt" />
            <LogoText>Kilowatt</LogoText>
          </LogoSection>
          
          <NavLinks>
            <NavLink active onClick={() => handleNavigation('home')}>
              Home
            </NavLink>
            <NavLink onClick={() => handleNavigation('task-queue')}>
              Task Queue
            </NavLink>
            <NavLink onClick={() => handleNavigation('accounts')}>
              Accounts
            </NavLink>
            <NavLink onClick={() => handleNavigation('managers')}>
              Managers
            </NavLink>
            <NavLink onClick={() => handleNavigation('email-drafts')}>
              Email Drafts
            </NavLink>
            <NavLink onClick={() => handleNavigation('commissions')}>
              Commissions
            </NavLink>
            <NavLink onClick={() => handleNavigation('providers')}>
              Providers
            </NavLink>
            <NavLink onClick={() => handleNavigation('system-health')}>
              System Health
            </NavLink>
          </NavLinks>
        </NavLeft>

        <NavRight>
          <SearchForm onSubmit={handleSearch}>
            <SearchInput
              type="text"
              placeholder="Search accounts, managers, etc..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchButton type="submit">
              🔍
            </SearchButton>
          </SearchForm>

          <UserProfile>
            <ProfileDropdown>
              <ProfileButton>
                <ProfileAvatar>
                  {userProfile.avatar ? (
                    <img src={userProfile.avatar} alt={userProfile.name} />
                  ) : (
                    userProfile.name.charAt(0)
                  )}
                </ProfileAvatar>
                <ProfileName>{userProfile.name}</ProfileName>
                <DropdownArrow>▼</DropdownArrow>
              </ProfileButton>
              <DropdownMenu>
                <DropdownItem onClick={() => handleProfileAction('settings')}>
                  ⚙️ Settings
                </DropdownItem>
                <DropdownItem onClick={() => handleProfileAction('logout')}>
                  🚪 Logout
                </DropdownItem>
              </DropdownMenu>
            </ProfileDropdown>
          </UserProfile>
        </NavRight>
      </NavigationBar>

      {/* Main Dashboard Content */}
      <DashboardContainer>
        <DashboardHeader>
          <WelcomeMessage>
            Welcome back, {userProfile.name}! 👋
          </WelcomeMessage>
          <DashboardSubtitle>
            Here's what's happening with your business today
          </DashboardSubtitle>
        </DashboardHeader>

        <WidgetGrid>
          {/* My Tasks Widget */}
          <Widget>
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

          {/* Team Tasks Widget */}
          <Widget>
            <WidgetHeader>
              <WidgetTitle>Team Tasks</WidgetTitle>
              <WidgetAction onClick={() => handleNavigation('task-queue')}>
                View All →
              </WidgetAction>
            </WidgetHeader>
            <TaskList>
              <TaskItem onClick={() => handleNavigation('task-queue')}>
                <TaskIcon>🏢</TaskIcon>
                <TaskInfo>
                  <TaskName>Accounts Needing Provider Selection</TaskName>
                  <TaskCount>{teamTasks.providerSelection} tasks</TaskCount>
                </TaskInfo>
              </TaskItem>
              <TaskItem onClick={() => handleNavigation('task-queue')}>
                <TaskIcon>🚨</TaskIcon>
                <TaskInfo>
                  <TaskName>Super Flagged Contracts</TaskName>
                  <TaskCount>{teamTasks.superFlagged} tasks</TaskCount>
                </TaskInfo>
              </TaskItem>
              <TaskItem onClick={() => handleNavigation('email-drafts')}>
                <TaskIcon>📧</TaskIcon>
                <TaskInfo>
                  <TaskName>Drafted Emails to Review</TaskName>
                  <TaskCount>{teamTasks.draftedEmails} emails</TaskCount>
                </TaskInfo>
              </TaskItem>
              <TaskItem onClick={() => handleNavigation('task-queue')}>
                <TaskIcon>✅</TaskIcon>
                <TaskInfo>
                  <TaskName>New Accounts for Verification</TaskName>
                  <TaskCount>{teamTasks.newAccounts} accounts</TaskCount>
                </TaskInfo>
              </TaskItem>
            </TaskList>
          </Widget>

          {/* System Health Widget */}
          <Widget>
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
        </WidgetGrid>
      </DashboardContainer>
    </PageContainer>
  );
};

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  position: relative;
  overflow: hidden;
`;

const BackgroundGradient = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%),
    linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%);
  z-index: 1;
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%),
    linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 70%);
  z-index: 2;
`;

const FloatingShapes = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  pointer-events: none;

  &::before {
    content: '';
    position: absolute;
    top: 10%;
    left: 10%;
    width: 100px;
    height: 100px;
    background: linear-gradient(45deg, rgba(255, 119, 198, 0.1), rgba(120, 119, 198, 0.1));
    border-radius: 50%;
    animation: float 6s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    top: 60%;
    right: 15%;
    width: 150px;
    height: 150px;
    background: linear-gradient(45deg, rgba(120, 219, 255, 0.1), rgba(255, 119, 198, 0.1));
    border-radius: 50%;
    animation: float 8s ease-in-out infinite reverse;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }
`;

const NavigationBar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 32px;
  height: 72px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 0 16px;
    height: 64px;
  }
`;

const NavLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 48px;

  @media (max-width: 768px) {
    gap: 24px;
  }
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LogoImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const LogoText = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const NavLinks = styled.div`
  display: flex;
  gap: 32px;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const NavLink = styled.button`
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.8)'};
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }

  ${props => props.active && `
    background: rgba(255, 255, 255, 0.2);
    color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  `}
`;

const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const SearchForm = styled.form`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 8px 16px;
  min-width: 300px;
  backdrop-filter: blur(10px);

  @media (max-width: 768px) {
    min-width: 200px;
  }
`;

const SearchInput = styled.input`
  border: none;
  background: none;
  font-size: 14px;
  color: white;
  flex: 1;
  outline: none;

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
`;

const SearchButton = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: background-color 0.2s ease;
  color: white;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const UserProfile = styled.div`
  position: relative;
`;

const ProfileDropdown = styled.div`
  position: relative;
`;

const ProfileButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }
`;

const ProfileAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const ProfileName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: white;

  @media (max-width: 768px) {
    display: none;
  }
`;

const DropdownArrow = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  min-width: 160px;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;

  ${ProfileDropdown}:hover & {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  text-align: left;
  font-size: 14px;
  color: #1e293b;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: rgba(102, 126, 234, 0.1);
  }

  &:first-child {
    border-radius: 12px 12px 0 0;
  }

  &:last-child {
    border-radius: 0 0 12px 12px;
  }
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
  text-align: center;
`;

const WelcomeMessage = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: white;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const DashboardSubtitle = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
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
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  grid-column: ${props => props.fullWidth ? '1 / -1' : 'auto'};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
  }

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const WidgetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const WidgetTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: white;
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const WidgetAction = styled.button`
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: white;
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
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(4px);
    border-color: rgba(255, 255, 255, 0.2);
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
  color: white;
  margin-bottom: 2px;
`;

const TaskCount = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
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
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
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
  color: white;
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
  color: rgba(255, 255, 255, 0.7);
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
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(4px);
    border-color: rgba(255, 255, 255, 0.2);
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
  color: white;
  margin-bottom: 4px;
  line-height: 1.4;
`;

const ActivityUser = styled.span`
  font-weight: 600;
  color: #fbbf24;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const ActivityTime = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
`;

export default HomePage; 