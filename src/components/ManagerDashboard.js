import React, { useState } from 'react';
import styled from 'styled-components';
import kilowattImage from '../assets/image.png';
import colors from '../assets/colors';

const ManagerDashboard = ({ onLogout, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('accounts');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('accountName');
  const [sortDirection, setSortDirection] = useState('asc');

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
        </NavLeft>

        <NavCenter>
          <NavLinks>
            <NavLink onClick={() => handleNavigation('home')}>
              Home
            </NavLink>
            <NavLink onClick={() => handleNavigation('task-queue')}>
              Task Queue
            </NavLink>
            <NavLink onClick={() => handleNavigation('accounts')}>
              Accounts
            </NavLink>
            <NavLink active onClick={() => handleNavigation('managers')}>
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
        </NavCenter>

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
                <ProfileAvatar>J</ProfileAvatar>
                <ProfileName>John Doe</ProfileName>
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

      {/* Main Content */}
      <MainContainer>
        {/* Header Section */}
        <ManagerHeader>
          <ManagerInfo>
            <ManagerName>{managerData.name}</ManagerName>
            <ManagerType>{managerData.type === 'manager' ? 'Manager' : 'Management Company'}</ManagerType>
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
          </ManagerInfo>
        </ManagerHeader>

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
  background: ${colors.primary};
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

const NavigationBar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 32px;
  height: 72px;
  background: ${colors.primary};
  border-bottom: 1px solid ${colors.border};
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 100vw;
  max-width: 100vw;
  overflow-x: auto;
  @media (max-width: 768px) {
    padding: 0 8px;
    height: 64px;
  }
`;

const NavLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const NavCenter = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  min-width: 0;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 32px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  width: auto;
  max-width: 100vw;
  overflow-x: auto;
`;

const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  flex-shrink: 0;
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

const ManagerHeader = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const ManagerInfo = styled.div`
  text-align: center;
`;

const ManagerName = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const ManagerType = styled.div`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
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
  color: white;
  font-weight: 500;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
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
  color: white;
  margin-bottom: 4px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  padding: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const TabButton = styled.button`
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  border: none;
  color: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.8)'};
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }

  ${props => props.active && `
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  `}
`;

const TabContent = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
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
  color: white;
  margin: 0 0 20px 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const AccountsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: rgba(255, 255, 255, 0.1);
`;

const TableRow = styled.tr`
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: background-color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TableHeaderCell = styled.th`
  padding: 16px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const SortIcon = styled.span`
  font-size: 12px;
  opacity: 0.7;
`;

const TableBody = styled.tbody``;

const TableCell = styled.td`
  padding: 16px;
  font-size: 14px;
  color: white;
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
  color: white;
  margin-bottom: 4px;
  line-height: 1.4;
`;

const ActivityTime = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
`;

// Tab content components
const AccountsTab = styled.div``;
const ActivityTab = styled.div``;

export default ManagerDashboard; 