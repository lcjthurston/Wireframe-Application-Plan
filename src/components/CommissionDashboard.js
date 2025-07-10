import React, { useState } from 'react';
import styled from 'styled-components';
import kilowattImage from '../assets/image.png';
import colors from '../assets/colors';
import Header from './Header';

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
      <Header
        activePage="commissions"
        onNavigate={handleNavigation}
        onLogout={onLogout}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
      />

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

const PageHeader = styled.div`
  margin-bottom: 32px;
  text-align: center;
`;

const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: ${colors.text};
  margin-bottom: 8px;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const PageSubtitle = styled.p`
  font-size: 16px;
  color: ${colors.textLight};
  margin: 0;
`;

const PeriodSelector = styled.div`
  background: ${colors.surface};
  border-radius: 16px;
  padding: 20px 24px;
  margin-bottom: 24px;
  border: 2px solid ${colors.border};
  box-shadow: 0 8px 32px ${colors.shadow};
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
  color: ${colors.text};
`;

const PeriodSelect = styled.select`
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  color: ${colors.text};
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${colors.accent};
    box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.1);
  }

  option {
    background: ${colors.surface};
    color: ${colors.text};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
  background: ${props => props.active ? colors.accent1 : 'transparent'};
  border: none;
  color: ${props => props.active ? colors.accent : colors.textLight};
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: ${colors.accent1};
    color: ${colors.accent};
  }

  ${props => props.active && `
    box-shadow: 0 2px 8px ${colors.shadow};
  `}
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
  border-bottom: 1px solid ${colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${colors.text};
  margin: 0 0 20px 0;
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
  background: ${colors.accent1};
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${colors.border};
  transition: background-color 0.2s ease;

  &:hover {
    background: ${colors.accent1};
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
  color: ${colors.text};
  cursor: pointer;
  transition: all 0.2s ease;
  display: table-cell;
  vertical-align: middle;

  &:hover {
    background: ${colors.surfaceHover};
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
  color: ${colors.text};
  vertical-align: middle;
  display: table-cell;
`;

const AccountLink = styled.button`
  background: none;
  border: none;
  color: ${colors.accent};
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: ${colors.accent};
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
  background: ${props => props.type === 'Premium' ? colors.accent1 : colors.accent1};
  color: ${props => props.type === 'Premium' ? colors.accent : colors.accent};
  border: 1px solid ${props => props.type === 'Premium' ? colors.accent : colors.accent};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 4px;
`;

const ActionButton = styled.button`
  background: ${colors.surface};
  border: 2px solid ${colors.border};
  color: ${colors.text};
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${colors.surfaceHover};
    transform: translateY(-1px);
  }
`;

const ReportGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const ReportCard = styled.div`
  background: ${colors.surface};
  border-radius: 16px;
  padding: 24px;
  border: 2px solid ${colors.border};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px ${colors.shadow};
    border-color: ${colors.accent3};
  }
`;

const ReportIcon = styled.div`
  font-size: 32px;
  margin-bottom: 16px;
`;

const ReportTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${colors.text};
  margin-bottom: 8px;
`;

const ReportDescription = styled.p`
  font-size: 14px;
  color: ${colors.textLight};
  margin-bottom: 16px;
  line-height: 1.5;
`;

const ReportActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ReportButton = styled.button`
  background: ${colors.surface};
  border: 2px solid ${colors.border};
  color: ${colors.text};
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${colors.surfaceHover};
    transform: translateY(-1px);
  }
`;

// Tab content components
const OverviewTab = styled.div``;
const PaymentsTab = styled.div``;
const ReportsTab = styled.div``;



export default CommissionDashboard; 