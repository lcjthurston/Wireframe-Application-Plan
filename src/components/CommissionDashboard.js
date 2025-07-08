import React, { useState } from 'react';
import styled from 'styled-components';
import kilowattImage from '../assets/image.png';
import colors from '../assets/colors';

const CommissionDashboard = ({ onLogout, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('accountName');
  const [sortDirection, setSortDirection] = useState('asc');

  // Mock commission data
  const commissionStats = {
    totalCommissions: 125000,
    pendingCommissions: 25000,
    paidCommissions: 100000,
    averageCommission: 5200,
    totalAccounts: 24,
    activeAccounts: 20
  };

  const commissionHistory = [
    {
      id: 1,
      accountName: 'ABC Corporation',
      manager: 'Sarah Johnson',
      commissionAmount: 5200,
      paymentStatus: 'Paid',
      paymentDate: '2024-01-15',
      contractType: 'Standard',
      esiidCount: 2,
      usageKwh: 45000
    },
    {
      id: 2,
      accountName: 'XYZ Industries',
      manager: 'Sarah Johnson',
      commissionAmount: 3800,
      paymentStatus: 'Pending',
      paymentDate: null,
      contractType: 'Premium',
      esiidCount: 1,
      usageKwh: 32000
    },
    {
      id: 3,
      accountName: 'Main Street Plaza',
      manager: 'Sarah Johnson',
      commissionAmount: 7200,
      paymentStatus: 'Paid',
      paymentDate: '2024-01-10',
      contractType: 'Standard',
      esiidCount: 3,
      usageKwh: 68000
    },
    {
      id: 4,
      accountName: 'Downtown Center',
      manager: 'Sarah Johnson',
      commissionAmount: 4500,
      paymentStatus: 'Pending',
      paymentDate: null,
      contractType: 'Standard',
      esiidCount: 2,
      usageKwh: 38000
    },
    {
      id: 5,
      accountName: 'Tech Park LLC',
      manager: 'Sarah Johnson',
      commissionAmount: 3100,
      paymentStatus: 'Paid',
      paymentDate: '2024-01-05',
      contractType: 'Premium',
      esiidCount: 1,
      usageKwh: 28000
    }
  ];

  const paymentHistory = [
    {
      id: 1,
      paymentDate: '2024-01-15',
      amount: 5200,
      account: 'ABC Corporation',
      method: 'Direct Deposit',
      status: 'Completed',
      reference: 'PAY-2024-001'
    },
    {
      id: 2,
      paymentDate: '2024-01-10',
      amount: 7200,
      account: 'Main Street Plaza',
      method: 'Check',
      status: 'Completed',
      reference: 'PAY-2024-002'
    },
    {
      id: 3,
      paymentDate: '2024-01-05',
      amount: 3100,
      account: 'Tech Park LLC',
      method: 'Direct Deposit',
      status: 'Completed',
      reference: 'PAY-2024-003'
    },
    {
      id: 4,
      paymentDate: '2024-01-20',
      amount: 25000,
      account: 'Bulk Payment',
      method: 'Wire Transfer',
      status: 'Pending',
      reference: 'PAY-2024-004'
    }
  ];

  const periodOptions = [
    { value: 'current-month', label: 'Current Month' },
    { value: 'last-month', label: 'Last Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
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

  const handleCommissionAction = (action, commissionId) => {
    console.log('Commission action:', action, 'for commission:', commissionId);
    // TODO: Implement commission actions
  };

  const handlePaymentAction = (action, paymentId) => {
    console.log('Payment action:', action, 'for payment:', paymentId);
    // TODO: Implement payment actions
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getFilteredCommissions = () => {
    let filtered = commissionHistory;

    if (searchQuery) {
      filtered = filtered.filter(commission =>
        commission.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        commission.manager.toLowerCase().includes(searchQuery.toLowerCase()) ||
        commission.paymentStatus.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'commissionAmount') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  const filteredCommissions = getFilteredCommissions();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return '#10b981';
      case 'Pending': return '#f59e0b';
      case 'Overdue': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusBackground = (status) => {
    switch (status) {
      case 'Paid': return 'rgba(16, 185, 129, 0.2)';
      case 'Pending': return 'rgba(245, 158, 11, 0.2)';
      case 'Overdue': return 'rgba(239, 68, 68, 0.2)';
      default: return 'rgba(107, 114, 128, 0.2)';
    }
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
            <NavLink onClick={() => handleNavigation('managers')}>
              Managers
            </NavLink>
            <NavLink onClick={() => handleNavigation('email-drafts')}>
              Email Drafts
            </NavLink>
            <NavLink active onClick={() => handleNavigation('commissions')}>
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
              placeholder="Search commissions, accounts, etc..."
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
        <PageHeader>
          <PageTitle>Commission Dashboard</PageTitle>
          <PageSubtitle>Track commissions, payments, and financial performance</PageSubtitle>
        </PageHeader>

        {/* Period Selector */}
        <PeriodSelector>
          <PeriodLabel>View Period:</PeriodLabel>
          <PeriodSelect
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            {periodOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </PeriodSelect>
        </PeriodSelector>

        {/* Commission Statistics */}
        <StatsGrid>
          <StatCard>
            <StatIcon>💰</StatIcon>
            <StatContent>
              <StatValue>${commissionStats.totalCommissions.toLocaleString()}</StatValue>
              <StatLabel>Total Commissions</StatLabel>
            </StatContent>
          </StatCard>
          <StatCard>
            <StatIcon>⏳</StatIcon>
            <StatContent>
              <StatValue>${commissionStats.pendingCommissions.toLocaleString()}</StatValue>
              <StatLabel>Pending Commissions</StatLabel>
            </StatContent>
          </StatCard>
          <StatCard>
            <StatIcon>✅</StatIcon>
            <StatContent>
              <StatValue>${commissionStats.paidCommissions.toLocaleString()}</StatValue>
              <StatLabel>Paid Commissions</StatLabel>
            </StatContent>
          </StatCard>
          <StatCard>
            <StatIcon>📊</StatIcon>
            <StatContent>
              <StatValue>${commissionStats.averageCommission.toLocaleString()}</StatValue>
              <StatLabel>Average Commission</StatLabel>
            </StatContent>
          </StatCard>
          <StatCard>
            <StatIcon>🏢</StatIcon>
            <StatContent>
              <StatValue>{commissionStats.totalAccounts}</StatValue>
              <StatLabel>Total Accounts</StatLabel>
            </StatContent>
          </StatCard>
          <StatCard>
            <StatIcon>⚡</StatIcon>
            <StatContent>
              <StatValue>{commissionStats.activeAccounts}</StatValue>
              <StatLabel>Active Accounts</StatLabel>
            </StatContent>
          </StatCard>
        </StatsGrid>

        {/* Tabbed Interface */}
        <TabContainer>
          <TabButton
            active={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
          >
            Commission Overview
          </TabButton>
          <TabButton
            active={activeTab === 'payments'}
            onClick={() => setActiveTab('payments')}
          >
            Payment History
          </TabButton>
          <TabButton
            active={activeTab === 'reports'}
            onClick={() => setActiveTab('reports')}
          >
            Reports & Analytics
          </TabButton>
        </TabContainer>

        {/* Tab Content */}
        <TabContent>
          {activeTab === 'overview' && (
            <OverviewTab>
              <Section>
                <SectionTitle>Commission History</SectionTitle>
                <CommissionTable>
                  <TableHeader>
                    <TableRow>
                      <TableHeaderCell onClick={() => handleSort('accountName')}>
                        Account Name
                        <SortIcon>{sortField === 'accountName' ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}</SortIcon>
                      </TableHeaderCell>
                      <TableHeaderCell>Manager</TableHeaderCell>
                      <TableHeaderCell onClick={() => handleSort('commissionAmount')}>
                        Commission Amount
                        <SortIcon>{sortField === 'commissionAmount' ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}</SortIcon>
                      </TableHeaderCell>
                      <TableHeaderCell>Payment Status</TableHeaderCell>
                      <TableHeaderCell>Payment Date</TableHeaderCell>
                      <TableHeaderCell>Contract Type</TableHeaderCell>
                      <TableHeaderCell>ESIIDs</TableHeaderCell>
                      <TableHeaderCell>Usage (kWh)</TableHeaderCell>
                      <TableHeaderCell>Actions</TableHeaderCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCommissions.map(commission => (
                      <TableRow key={commission.id}>
                        <TableCell>
                          <AccountLink onClick={() => handleNavigation('accounts')}>
                            {commission.accountName}
                          </AccountLink>
                        </TableCell>
                        <TableCell>{commission.manager}</TableCell>
                        <TableCell>
                          ${commission.commissionAmount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <StatusBadge 
                            status={commission.paymentStatus}
                            color={getStatusColor(commission.paymentStatus)}
                            background={getStatusBackground(commission.paymentStatus)}
                          >
                            {commission.paymentStatus}
                          </StatusBadge>
                        </TableCell>
                        <TableCell>
                          {commission.paymentDate ? new Date(commission.paymentDate).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell>
                          <ContractBadge type={commission.contractType}>
                            {commission.contractType}
                          </ContractBadge>
                        </TableCell>
                        <TableCell>{commission.esiidCount}</TableCell>
                        <TableCell>{commission.usageKwh.toLocaleString()}</TableCell>
                        <TableCell>
                          <ActionButtons>
                            <ActionButton onClick={() => handleCommissionAction('view', commission.id)}>
                              👁️ View
                            </ActionButton>
                            <ActionButton onClick={() => handleCommissionAction('edit', commission.id)}>
                              ✏️ Edit
                            </ActionButton>
                            <ActionButton onClick={() => handleCommissionAction('process', commission.id)}>
                              💳 Process
                            </ActionButton>
                          </ActionButtons>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </CommissionTable>
              </Section>
            </OverviewTab>
          )}

          {activeTab === 'payments' && (
            <PaymentsTab>
              <Section>
                <SectionTitle>Payment History</SectionTitle>
                <PaymentTable>
                  <TableHeader>
                    <TableRow>
                      <TableHeaderCell>Payment Date</TableHeaderCell>
                      <TableHeaderCell>Amount</TableHeaderCell>
                      <TableHeaderCell>Account</TableHeaderCell>
                      <TableHeaderCell>Payment Method</TableHeaderCell>
                      <TableHeaderCell>Status</TableHeaderCell>
                      <TableHeaderCell>Reference</TableHeaderCell>
                      <TableHeaderCell>Actions</TableHeaderCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentHistory.map(payment => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          {new Date(payment.paymentDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          ${payment.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>{payment.account}</TableCell>
                        <TableCell>{payment.method}</TableCell>
                        <TableCell>
                          <StatusBadge 
                            status={payment.status}
                            color={getStatusColor(payment.status)}
                            background={getStatusBackground(payment.status)}
                          >
                            {payment.status}
                          </StatusBadge>
                        </TableCell>
                        <TableCell>{payment.reference}</TableCell>
                        <TableCell>
                          <ActionButtons>
                            <ActionButton onClick={() => handlePaymentAction('view', payment.id)}>
                              👁️ View
                            </ActionButton>
                            <ActionButton onClick={() => handlePaymentAction('download', payment.id)}>
                              📥 Download
                            </ActionButton>
                            <ActionButton onClick={() => handlePaymentAction('resend', payment.id)}>
                              📧 Resend
                            </ActionButton>
                          </ActionButtons>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </PaymentTable>
              </Section>
            </PaymentsTab>
          )}

          {activeTab === 'reports' && (
            <ReportsTab>
              <Section>
                <SectionTitle>Commission Reports</SectionTitle>
                <ReportGrid>
                  <ReportCard>
                    <ReportIcon>📈</ReportIcon>
                    <ReportTitle>Monthly Commission Report</ReportTitle>
                    <ReportDescription>
                      Detailed breakdown of commissions by account, manager, and time period
                    </ReportDescription>
                    <ReportActions>
                      <ReportButton onClick={() => console.log('Generate monthly report')}>
                        📊 Generate Report
                      </ReportButton>
                      <ReportButton onClick={() => console.log('Download monthly report')}>
                        📥 Download
                      </ReportButton>
                    </ReportActions>
                  </ReportCard>

                  <ReportCard>
                    <ReportIcon>💰</ReportIcon>
                    <ReportTitle>Payment Summary</ReportTitle>
                    <ReportDescription>
                      Summary of all payments processed, pending, and overdue
                    </ReportDescription>
                    <ReportActions>
                      <ReportButton onClick={() => console.log('Generate payment summary')}>
                        📊 Generate Report
                      </ReportButton>
                      <ReportButton onClick={() => console.log('Download payment summary')}>
                        📥 Download
                      </ReportButton>
                    </ReportActions>
                  </ReportCard>

                  <ReportCard>
                    <ReportIcon>👥</ReportIcon>
                    <ReportTitle>Manager Performance</ReportTitle>
                    <ReportDescription>
                      Commission performance by manager and account portfolio
                    </ReportDescription>
                    <ReportActions>
                      <ReportButton onClick={() => console.log('Generate manager report')}>
                        📊 Generate Report
                      </ReportButton>
                      <ReportButton onClick={() => console.log('Download manager report')}>
                        📥 Download
                      </ReportButton>
                    </ReportActions>
                  </ReportCard>

                  <ReportCard>
                    <ReportIcon>📋</ReportIcon>
                    <ReportTitle>Contract Analysis</ReportTitle>
                    <ReportDescription>
                      Analysis of commission rates and contract types
                    </ReportDescription>
                    <ReportActions>
                      <ReportButton onClick={() => console.log('Generate contract analysis')}>
                        📊 Generate Report
                      </ReportButton>
                      <ReportButton onClick={() => console.log('Download contract analysis')}>
                        📥 Download
                      </ReportButton>
                    </ReportActions>
                  </ReportCard>
                </ReportGrid>
              </Section>
            </ReportsTab>
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

const PageHeader = styled.div`
  margin-bottom: 32px;
  text-align: center;
`;

const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: white;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const PageSubtitle = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const PeriodSelector = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 20px 24px;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const PeriodLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: white;
`;

const PeriodSelect = styled.select`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  color: white;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: rgba(255, 255, 255, 0.4);
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
  }

  option {
    background: #1e293b;
    color: white;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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

const CommissionTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const PaymentTable = styled.table`
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
  background: ${props => props.background};
  color: ${props => props.color};
  border: 1px solid ${props => props.color}40;
`;

const ContractBadge = styled.span`
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => props.type === 'Premium' ? 'rgba(251, 191, 36, 0.2)' : 'rgba(59, 130, 246, 0.2)'};
  color: ${props => props.type === 'Premium' ? '#fbbf24' : '#93c5fd'};
  border: 1px solid ${props => props.type === 'Premium' ? 'rgba(251, 191, 36, 0.3)' : 'rgba(59, 130, 246, 0.3)'};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 4px;
`;

const ActionButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }
`;

const ReportGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const ReportCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const ReportIcon = styled.div`
  font-size: 32px;
  margin-bottom: 16px;
`;

const ReportTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: white;
  margin-bottom: 8px;
`;

const ReportDescription = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 16px;
  line-height: 1.5;
`;

const ReportActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ReportButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }
`;

// Tab content components
const OverviewTab = styled.div``;
const PaymentsTab = styled.div``;
const ReportsTab = styled.div``;

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
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
`;

const NavLink = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  font-weight: 500;
  color: ${props => props.active ? colors.background : 'rgba(255,255,255,0.8)'};
  cursor: pointer;
  padding: 12px 24px;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  white-space: nowrap;
  &:hover {
    color: ${colors.background};
    background: ${colors.accent1};
  }
  ${props => props.active && `
    background: ${colors.accent1};
    color: ${colors.background};
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  `}
`;

export default CommissionDashboard; 