import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import kilowattImage from '../assets/image.png';
import colors from '../assets/colors';
import DashboardCard from './DashboardCard';
import Header from './Header';

const ManagerDashboard = ({ onLogout, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('accounts');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('accountName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  // Mock data for manager/company
  const managerData = {
    name: 'Sarah Johnson',
    type: 'manager', // or 'company'
    email: 'sarah.johnson@company.com',
    phone: '(713) 555-0123',
    company: 'Property Management Inc.'
  };

  const summaryStats = {
    totalActiveAccounts: 24,
    totalEsiids: 48,
    totalYtdCommissions: 125000,
    totalPendingContracts: 3
  };

  const accounts = [
    {
      id: 1,
      accountName: 'ABC Corporation',
      status: 'Active',
      contractEndDate: '2024-12-31',
      manager: 'Sarah Johnson',
      esiids: 2,
      monthlyCommission: 5200
    },
    {
      id: 2,
      accountName: 'XYZ Industries',
      status: 'Needs Pricing',
      contractEndDate: '2024-06-30',
      manager: 'Sarah Johnson',
      esiids: 1,
      monthlyCommission: 3800
    },
    {
      id: 3,
      accountName: 'Main Street Plaza',
      status: 'Pending Contract',
      contractEndDate: '2024-09-15',
      manager: 'Sarah Johnson',
      esiids: 3,
      monthlyCommission: 7200
    },
    {
      id: 4,
      accountName: 'Downtown Center',
      status: 'Active',
      contractEndDate: '2024-11-30',
      manager: 'Sarah Johnson',
      esiids: 2,
      monthlyCommission: 4500
    },
    {
      id: 5,
      accountName: 'Tech Park LLC',
      status: 'Super Flagged',
      contractEndDate: '2024-08-15',
      manager: 'Sarah Johnson',
      esiids: 1,
      monthlyCommission: 3100
    }
  ];

  const activityHistory = [
    {
      timestamp: '2024-01-15 15:30',
      action: 'Account "ABC Corporation" added',
      type: 'account_added'
    },
    {
      timestamp: '2024-01-15 14:00',
      action: 'Manager updated for "XYZ Industries"',
      type: 'manager_updated'
    },
    {
      timestamp: '2024-01-15 10:15',
      action: 'Contract renewed for "Main Street Plaza"',
      type: 'contract_renewed'
    },
    {
      timestamp: '2024-01-14 16:45',
      action: 'Account "Downtown Center" status changed to Active',
      type: 'status_changed'
    },
    {
      timestamp: '2024-01-14 12:30',
      action: 'Commission data updated for "Tech Park LLC"',
      type: 'commission_updated'
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
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleGoToAccount = (accountName) => {
    console.log('Navigating to account:', accountName);
    // TODO: Navigate to account dashboard
  };

  const getFilteredAccounts = () => {
    let filtered = accounts;

    if (searchQuery) {
      filtered = filtered.filter(account =>
        account.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        account.status.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'contractEndDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  const filteredAccounts = getFilteredAccounts();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <PageContainer>
      {/* Dynamic Background Layers */}
      <BackgroundGradient />
      <BackgroundPattern />
      <FloatingShapes />
      
      {/* Top Navigation Bar */}
      <Header
        activePage="managers"
        onNavigate={handleNavigation}
        onLogout={onLogout}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
      />

      {/* Main Content */}
      <MainContainer>
        {/* Header Section */}
        <DashboardCard>
          <ManagerName>{managerData.name}</ManagerName>
          <ManagerType>{managerData.type}</ManagerType>
          <ManagerContact>
            <ContactItem>
              <ContactIcon>📧</ContactIcon>
              <ContactValue>{managerData.email}</ContactValue>
            </ContactItem>
            <ContactItem>
              <ContactIcon>📞</ContactIcon>
              <ContactValue>{managerData.phone}</ContactValue>
            </ContactItem>
            {managerData.company && (
              <ContactItem>
                <ContactIcon>🏢</ContactIcon>
                <ContactValue>{managerData.company}</ContactValue>
              </ContactItem>
            )}
          </ManagerContact>
        </DashboardCard>

        {/* Summary Statistics */}
        <StatsGrid>
          <StatCard>
            <StatIcon>🏢</StatIcon>
            <StatContent>
              <StatValue>{summaryStats.totalActiveAccounts}</StatValue>
              <StatLabel>Active Accounts</StatLabel>
            </StatContent>
          </StatCard>
          <StatCard>
            <StatIcon>⚡</StatIcon>
            <StatContent>
              <StatValue>{summaryStats.totalEsiids}</StatValue>
              <StatLabel>Total ESIIDs</StatLabel>
            </StatContent>
          </StatCard>
          <StatCard>
            <StatIcon>💰</StatIcon>
            <StatContent>
              <StatValue>${summaryStats.totalYtdCommissions.toLocaleString()}</StatValue>
              <StatLabel>YTD Commissions</StatLabel>
            </StatContent>
          </StatCard>
          <StatCard>
            <StatIcon>📋</StatIcon>
            <StatContent>
              <StatValue>{summaryStats.totalPendingContracts}</StatValue>
              <StatLabel>Pending Contracts</StatLabel>
            </StatContent>
          </StatCard>
        </StatsGrid>

        {/* Tabbed Interface */}
        <TabContainer>
          <TabButton
            active={activeTab === 'accounts'}
            onClick={() => setActiveTab('accounts')}
          >
            Account List
          </TabButton>
          <TabButton
            active={activeTab === 'activity'}
            onClick={() => setActiveTab('activity')}
          >
            Activity History
          </TabButton>
        </TabContainer>

        {/* Tab Content */}
        <TabContent>
          {activeTab === 'accounts' && (
            <AccountsTab>
              <Section>
                <SectionTitle>Associated Accounts</SectionTitle>
                <AccountsTable>
                  <TableHeader>
                    <TableRow>
                      <TableHeaderCell onClick={() => handleSort('accountName')}>
                        Account Name
                        <SortIcon>{sortField === 'accountName' ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}</SortIcon>
                      </TableHeaderCell>
                      <TableHeaderCell onClick={() => handleSort('status')}>
                        Status
                        <SortIcon>{sortField === 'status' ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}</SortIcon>
                      </TableHeaderCell>
                      <TableHeaderCell onClick={() => handleSort('contractEndDate')}>
                        Contract End Date
                        <SortIcon>{sortField === 'contractEndDate' ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}</SortIcon>
                      </TableHeaderCell>
                      <TableHeaderCell>ESIIDs</TableHeaderCell>
                      <TableHeaderCell>Monthly Commission</TableHeaderCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAccounts.map(account => (
                      <TableRow key={account.id}>
                        <TableCell>
                          <AccountLink onClick={() => handleGoToAccount(account.accountName)}>
                            {account.accountName}
                          </AccountLink>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={account.status}>
                            {account.status}
                          </StatusBadge>
                        </TableCell>
                        <TableCell>
                          {new Date(account.contractEndDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {account.esiids}
                        </TableCell>
                        <TableCell>
                          ${account.monthlyCommission.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </AccountsTable>
              </Section>
            </AccountsTab>
          )}

          {activeTab === 'activity' && (
            <ActivityTab>
              <Section>
                <SectionTitle>Activity History</SectionTitle>
                <ActivityList>
                  {activityHistory.map((activity, index) => (
                    <ActivityItem key={index}>
                      <ActivityIcon>
                        {activity.type === 'account_added' && '➕'}
                        {activity.type === 'manager_updated' && '👤'}
                        {activity.type === 'contract_renewed' && '📋'}
                        {activity.type === 'status_changed' && '🔄'}
                        {activity.type === 'commission_updated' && '💰'}
                      </ActivityIcon>
                      <ActivityContent>
                        <ActivityText>{activity.action}</ActivityText>
                        <ActivityTime>{activity.timestamp}</ActivityTime>
                      </ActivityContent>
                    </ActivityItem>
                  ))}
                </ActivityList>
              </Section>
            </ActivityTab>
          )}
        </TabContent>
      </MainContainer>
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

const MainContainer = styled.div`
  padding: 32px;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 3;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const ManagerInfo = styled.div`
  text-align: left;
`;

const ManagerName = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${colors.text};
  margin: 0 0 8px 0;
`;

const ManagerType = styled.div`
  font-size: 1.25rem;
  color: ${colors.textLight};
  margin-bottom: 16px;
  font-weight: 500;
`;

const ManagerContact = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ContactIcon = styled.span`
  font-size: 16px;
`;

const ContactValue = styled.span`
  font-size: 14px;
  color: ${colors.text};
  font-weight: 500;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: ${colors.surface};
  border-radius: 16px;
  padding: 24px;
  border: 2px solid ${colors.border};
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px ${colors.shadow};
    border-color: ${colors.accent3};
  }
`;

const StatIcon = styled.div`
  font-size: 32px;
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${colors.text};
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: ${colors.textLight};
  font-weight: 500;
`;

const ActionButton = styled.button`
  background: ${colors.surface};
  border: 2px solid ${colors.border};
  color: ${colors.text};
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${colors.accent5};
    color: ${colors.primary};
  }
`;

const PrimaryButton = styled.button`
  background: ${colors.primary};
  border: 2px solid ${colors.primary};
  color: ${colors.surface};
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${colors.accent2};
    color: ${colors.surface};
  }
`;

const SecondaryButton = styled.button`
  background: ${colors.surface};
  border: 2px solid ${colors.border};
  color: ${colors.text};
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${colors.accent5};
    color: ${colors.primary};
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  background: ${colors.surface};
  border-radius: 12px;
  padding: 8px;
  border: 2px solid ${colors.border};
`;

const TabButton = styled.button`
  background: ${props => props.active ? colors.accent5 : colors.surface};
  border: 2px solid ${colors.border};
  color: ${colors.text};
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: ${colors.accent5};
    color: ${colors.primary};
  }
`;

const TabContent = styled.div`
  background: ${colors.surface};
  border-radius: 16px;
  border: 2px solid ${colors.border};
  overflow: hidden;
  box-shadow: 0 8px 32px ${colors.shadow};
`;

const Section = styled.div`
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${colors.text};
  margin: 0 0 20px 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const AccountsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: ${colors.accent5};
`;

const TableRow = styled.tr`
  border-bottom: 2px solid ${colors.border};
  transition: background-color 0.2s ease;

  &:hover {
    background: ${colors.accent5};
  }
`;

const TableHeaderCell = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: ${colors.text};
  border-bottom: 2px solid ${colors.border};
`;

const SortIcon = styled.span`
  font-size: 12px;
  opacity: 0.7;
`;

const TableBody = styled.tbody``;

const TableCell = styled.td`
  padding: 12px 16px;
  font-size: 14px;
  color: ${colors.text};
  border-bottom: 1px solid ${colors.border};
  vertical-align: middle;
`;

const AccountLink = styled.button`
  background: none;
  border: none;
  color: #fbbf24;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: #f59e0b;
    text-decoration: underline;
  }
`;

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
    switch (props.status) {
      case 'Active': return 'rgba(34, 197, 94, 0.2)';
      case 'Needs Pricing': return 'rgba(245, 158, 11, 0.2)';
      case 'Pending Contract': return 'rgba(59, 130, 246, 0.2)';
      case 'Super Flagged': return 'rgba(239, 68, 68, 0.2)';
      default: return 'rgba(107, 114, 128, 0.2)';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'Active': return '#86efac';
      case 'Needs Pricing': return '#fcd34d';
      case 'Pending Contract': return '#93c5fd';
      case 'Super Flagged': return '#fca5a5';
      default: return '#d1d5db';
    }
  }};
  border: 1px solid ${props => {
    switch (props.status) {
      case 'Active': return 'rgba(34, 197, 94, 0.3)';
      case 'Needs Pricing': return 'rgba(245, 158, 11, 0.3)';
      case 'Pending Contract': return 'rgba(59, 130, 246, 0.3)';
      case 'Super Flagged': return 'rgba(239, 68, 68, 0.3)';
      default: return 'rgba(107, 114, 128, 0.3)';
    }
  }};
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
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

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityText = styled.div`
  font-size: 14px;
  color: ${colors.text};
  margin-bottom: 4px;
  line-height: 1.4;
`;

const ActivityTime = styled.div`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.7);
`;

// Tab content components
const AccountsTab = styled.div``;
const ActivityTab = styled.div``;

export default ManagerDashboard; 