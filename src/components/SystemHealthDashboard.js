import React, { useState } from 'react';
import styled from 'styled-components';
import kilowattImage from '../assets/image.png';

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
`;

const BackgroundGradient = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: -3;
  pointer-events: none;
`;

const BackgroundPattern = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%);
  z-index: -2;
`;

const FloatingShapes = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  
  &::before {
    content: '';
    position: absolute;
    top: 20%;
    left: 10%;
    width: 100px;
    height: 100px;
    background: rgba(255, 255, 255, 0.1);
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
    background: rgba(255, 255, 255, 0.05);
    border-radius: 50%;
    animation: float 8s ease-in-out infinite reverse;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
`;

const NavigationBar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const NavLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LogoImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
`;

const LogoText = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const NavLink = styled.button`
  background: none;
  border: none;
  color: ${props => props.active ? '#ffffff' : 'rgba(255, 255, 255, 0.7)'};
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: ${props => props.active ? '600' : '400'};
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
`;

const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SearchForm = styled.form`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SearchInput = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  color: white;
  width: 300px;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const SearchButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  padding: 0.5rem;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const MainContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: white;
  margin-bottom: 0.5rem;
  font-weight: 700;
`;

const PageSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  }
`;

const StatIcon = styled.div`
  font-size: 2rem;
`;

const StatContent = styled.div``;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  padding: 0.5rem;
`;

const TabButton = styled.button`
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  border: none;
  color: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.7)'};
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: ${props => props.active ? '600' : '400'};
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
`;

const TabContent = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  padding: 2rem;
  min-height: 500px;
`;

const SectionTitle = styled.h2`
  color: white;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
`;

const OverviewTab = styled.div``;

const AutomationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const AutomationCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  }
`;

const AutomationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const AutomationName = styled.h3`
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
`;

const AutomationStatus = styled.span`
  background: ${props => props.color};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 600;
`;

const AutomationDesc = styled.p`
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const AutomationStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
`;

const AutomationStat = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
`;

const AutomationsTab = styled.div``;

const AutomationTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  th {
    color: white;
    font-weight: 600;
    background: rgba(255, 255, 255, 0.05);
  }
  
  td {
    color: rgba(255, 255, 255, 0.8);
  }
  
  tr:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const LogsTab = styled.div``;

const LogsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  th {
    color: white;
    font-weight: 600;
    background: rgba(255, 255, 255, 0.05);
  }
  
  td {
    color: rgba(255, 255, 255, 0.8);
  }
  
  tr:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const LogLevel = styled.span`
  background: ${props => {
    switch (props.level) {
      case 'ERROR': return '#ef4444';
      case 'WARNING': return '#f59e0b';
      case 'INFO': return '#10b981';
      default: return '#6b7280';
    }
  }};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.8rem;
  font-weight: 600;
`;

const MetricsTab = styled.div``;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const MetricCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  }
`;

const MetricName = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const MetricValue = styled.div`
  color: white;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const MetricChange = styled.div`
  color: ${props => props.trend === 'up' ? '#10b981' : '#ef4444'};
  font-size: 0.9rem;
  font-weight: 600;
`;

const SystemHealthDashboard = ({ onLogout, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock system health summary
  const systemHealth = {
    overallStatus: 'Healthy',
    uptime: 99.8,
    activeAutomations: 12,
    totalAutomations: 15,
    lastBackup: '2024-01-15 14:30',
    nextBackup: '2024-01-16 14:30',
    systemLoad: 45,
    memoryUsage: 68,
    diskUsage: 42
  };

  // Mock automation systems
  const automationSystems = [
    {
      id: 1,
      name: 'Email Automation',
      status: 'Healthy',
      lastRun: '2024-01-15 15:30',
      nextRun: '2024-01-15 16:00',
      successRate: 98.5,
      totalRuns: 1247,
      failedRuns: 18,
      description: 'Automated email drafting and sending system'
    },
    {
      id: 2,
      name: 'Commission Calculator',
      status: 'Healthy',
      lastRun: '2024-01-15 14:45',
      nextRun: '2024-01-15 15:45',
      successRate: 99.2,
      totalRuns: 892,
      failedRuns: 7,
      description: 'Automated commission calculation and processing'
    },
    {
      id: 3,
      name: 'Account Sync',
      status: 'Warning',
      lastRun: '2024-01-15 13:20',
      nextRun: '2024-01-15 14:20',
      successRate: 94.8,
      totalRuns: 567,
      failedRuns: 30,
      description: 'Account data synchronization with external systems'
    },
    {
      id: 4,
      name: 'Report Generator',
      status: 'Healthy',
      lastRun: '2024-01-15 12:00',
      nextRun: '2024-01-15 18:00',
      successRate: 97.3,
      totalRuns: 234,
      failedRuns: 6,
      description: 'Automated report generation and distribution'
    },
    {
      id: 5,
      name: 'Data Backup',
      status: 'Healthy',
      lastRun: '2024-01-15 14:30',
      nextRun: '2024-01-16 14:30',
      successRate: 100.0,
      totalRuns: 365,
      failedRuns: 0,
      description: 'Automated data backup and recovery system'
    }
  ];

  // Mock system logs
  const systemLogs = [
    {
      id: 1,
      timestamp: '2024-01-15 15:30:45',
      level: 'INFO',
      system: 'Email Automation',
      message: 'Successfully sent 5 emails to pending accounts',
      details: 'All emails were delivered successfully'
    },
    {
      id: 2,
      timestamp: '2024-01-15 15:25:12',
      level: 'WARNING',
      system: 'Account Sync',
      message: 'Connection timeout during account sync',
      details: 'Retrying connection in 5 minutes'
    },
    {
      id: 3,
      timestamp: '2024-01-15 15:20:33',
      level: 'INFO',
      system: 'Commission Calculator',
      message: 'Processed 12 commission calculations',
      details: 'All calculations completed successfully'
    },
    {
      id: 4,
      timestamp: '2024-01-15 15:15:08',
      level: 'ERROR',
      system: 'Report Generator',
      message: 'Failed to generate monthly report',
      details: 'Insufficient data for report generation'
    },
    {
      id: 5,
      timestamp: '2024-01-15 15:10:22',
      level: 'INFO',
      system: 'Data Backup',
      message: 'Backup completed successfully',
      details: '2.3GB of data backed up to secure location'
    }
  ];

  // Mock performance metrics
  const performanceMetrics = [
    {
      name: 'System Response Time',
      value: '245ms',
      trend: 'up',
      change: '+12ms',
      status: 'normal'
    },
    {
      name: 'Database Queries',
      value: '1,247',
      trend: 'up',
      change: '+89',
      status: 'normal'
    },
    {
      name: 'API Calls',
      value: '3,456',
      trend: 'down',
      change: '-123',
      status: 'good'
    },
    {
      name: 'Error Rate',
      value: '0.8%',
      trend: 'down',
      change: '-0.2%',
      status: 'good'
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: Implement search functionality
  };

  const handleNavigation = (page) => {
    if (onNavigate) onNavigate(page);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Healthy': return '#10b981';
      case 'Warning': return '#f59e0b';
      case 'Error': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <PageContainer>
      <BackgroundGradient />
      <BackgroundPattern />
      <FloatingShapes />
      <NavigationBar>
        <NavLeft>
          <LogoSection>
            <LogoImage src={kilowattImage} alt="Kilowatt" />
            <LogoText>Kilowatt</LogoText>
          </LogoSection>
          <NavLinks>
            <NavLink onClick={() => handleNavigation('home')}>Home</NavLink>
            <NavLink onClick={() => handleNavigation('task-queue')}>Task Queue</NavLink>
            <NavLink onClick={() => handleNavigation('accounts')}>Accounts</NavLink>
            <NavLink onClick={() => handleNavigation('managers')}>Managers</NavLink>
            <NavLink onClick={() => handleNavigation('email-drafts')}>Email Drafts</NavLink>
            <NavLink onClick={() => handleNavigation('commissions')}>Commissions</NavLink>
            <NavLink onClick={() => handleNavigation('providers')}>Providers</NavLink>
            <NavLink active onClick={() => handleNavigation('system-health')}>System Health</NavLink>
          </NavLinks>
        </NavLeft>
        <NavRight>
          <SearchForm onSubmit={handleSearch}>
            <SearchInput
              type="text"
              placeholder="Search logs, automations, etc..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchButton type="submit">🔍</SearchButton>
          </SearchForm>
        </NavRight>
      </NavigationBar>
      <MainContainer>
        <PageHeader>
          <PageTitle>System Automation Health Dashboard</PageTitle>
          <PageSubtitle>Monitor automation status, system health, and performance metrics</PageSubtitle>
        </PageHeader>
        <StatsGrid>
          <StatCard>
            <StatIcon>🟢</StatIcon>
            <StatContent>
              <StatValue>{systemHealth.overallStatus}</StatValue>
              <StatLabel>Overall Status</StatLabel>
            </StatContent>
          </StatCard>
          <StatCard>
            <StatIcon>⏱️</StatIcon>
            <StatContent>
              <StatValue>{systemHealth.uptime}%</StatValue>
              <StatLabel>System Uptime</StatLabel>
            </StatContent>
          </StatCard>
          <StatCard>
            <StatIcon>🤖</StatIcon>
            <StatContent>
              <StatValue>{systemHealth.activeAutomations}/{systemHealth.totalAutomations}</StatValue>
              <StatLabel>Active Automations</StatLabel>
            </StatContent>
          </StatCard>
          <StatCard>
            <StatIcon>💾</StatIcon>
            <StatContent>
              <StatValue>{systemHealth.lastBackup}</StatValue>
              <StatLabel>Last Backup</StatLabel>
            </StatContent>
          </StatCard>
          <StatCard>
            <StatIcon>📈</StatIcon>
            <StatContent>
              <StatValue>{systemHealth.systemLoad}%</StatValue>
              <StatLabel>System Load</StatLabel>
            </StatContent>
          </StatCard>
          <StatCard>
            <StatIcon>🧠</StatIcon>
            <StatContent>
              <StatValue>{systemHealth.memoryUsage}%</StatValue>
              <StatLabel>Memory Usage</StatLabel>
            </StatContent>
          </StatCard>
          <StatCard>
            <StatIcon>💽</StatIcon>
            <StatContent>
              <StatValue>{systemHealth.diskUsage}%</StatValue>
              <StatLabel>Disk Usage</StatLabel>
            </StatContent>
          </StatCard>
        </StatsGrid>
        <TabContainer>
          <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>Overview</TabButton>
          <TabButton active={activeTab === 'automations'} onClick={() => setActiveTab('automations')}>Automations</TabButton>
          <TabButton active={activeTab === 'logs'} onClick={() => setActiveTab('logs')}>System Logs</TabButton>
          <TabButton active={activeTab === 'metrics'} onClick={() => setActiveTab('metrics')}>Performance Metrics</TabButton>
        </TabContainer>
        <TabContent>
          {activeTab === 'overview' && (
            <OverviewTab>
              <SectionTitle>Automation System Summary</SectionTitle>
              <AutomationGrid>
                {automationSystems.map(system => (
                  <AutomationCard key={system.id}>
                    <AutomationHeader>
                      <AutomationName>{system.name}</AutomationName>
                      <AutomationStatus color={getStatusColor(system.status)}>{system.status}</AutomationStatus>
                    </AutomationHeader>
                    <AutomationDesc>{system.description}</AutomationDesc>
                    <AutomationStats>
                      <AutomationStat><b>Last Run:</b> {system.lastRun}</AutomationStat>
                      <AutomationStat><b>Next Run:</b> {system.nextRun}</AutomationStat>
                      <AutomationStat><b>Success Rate:</b> {system.successRate}%</AutomationStat>
                      <AutomationStat><b>Failed Runs:</b> {system.failedRuns}</AutomationStat>
                    </AutomationStats>
                  </AutomationCard>
                ))}
              </AutomationGrid>
            </OverviewTab>
          )}
          {activeTab === 'automations' && (
            <AutomationsTab>
              <SectionTitle>All Automation Systems</SectionTitle>
              <AutomationTable>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Last Run</th>
                    <th>Next Run</th>
                    <th>Success Rate</th>
                    <th>Failed Runs</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {automationSystems.map(system => (
                    <tr key={system.id}>
                      <td>{system.name}</td>
                      <td><AutomationStatus color={getStatusColor(system.status)}>{system.status}</AutomationStatus></td>
                      <td>{system.lastRun}</td>
                      <td>{system.nextRun}</td>
                      <td>{system.successRate}%</td>
                      <td>{system.failedRuns}</td>
                      <td>{system.description}</td>
                    </tr>
                  ))}
                </tbody>
              </AutomationTable>
            </AutomationsTab>
          )}
          {activeTab === 'logs' && (
            <LogsTab>
              <SectionTitle>Recent System Logs</SectionTitle>
              <LogsTable>
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Level</th>
                    <th>System</th>
                    <th>Message</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {systemLogs.map(log => (
                    <tr key={log.id}>
                      <td>{log.timestamp}</td>
                      <td><LogLevel level={log.level}>{log.level}</LogLevel></td>
                      <td>{log.system}</td>
                      <td>{log.message}</td>
                      <td>{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </LogsTable>
            </LogsTab>
          )}
          {activeTab === 'metrics' && (
            <MetricsTab>
              <SectionTitle>Performance Metrics</SectionTitle>
              <MetricsGrid>
                {performanceMetrics.map((metric, idx) => (
                  <MetricCard key={idx}>
                    <MetricName>{metric.name}</MetricName>
                    <MetricValue>{metric.value}</MetricValue>
                    <MetricChange trend={metric.trend}>{metric.change}</MetricChange>
                  </MetricCard>
                ))}
              </MetricsGrid>
            </MetricsTab>
          )}
        </TabContent>
      </MainContainer>
    </PageContainer>
  );
};

export default SystemHealthDashboard; 