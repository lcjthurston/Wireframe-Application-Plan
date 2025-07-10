import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import kilowattImage from '../assets/image.png';
import colors from '../assets/colors';
import Header from './Header';

const ProviderDashboard = ({ onLogout, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('providers');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('providerName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  // Mock provider data
  const providers = [
    {
      id: 1,
      providerName: 'Reliant Energy',
      status: 'Active',
      contractType: 'Standard',
      commissionRate: 0.085,
      contractEndDate: '2024-12-31',
      totalAccounts: 12,
      totalEsiids: 24,
      monthlyRevenue: 45000,
      contactPerson: 'John Smith',
      contactEmail: 'john.smith@reliant.com',
      contactPhone: '(713) 555-0101'
    },
    {
      id: 2,
      providerName: 'TXU Energy',
      status: 'Active',
      contractType: 'Premium',
      commissionRate: 0.092,
      contractEndDate: '2024-06-30',
      totalAccounts: 8,
      totalEsiids: 16,
      monthlyRevenue: 32000,
      contactPerson: 'Sarah Johnson',
      contactEmail: 'sarah.johnson@txu.com',
      contactPhone: '(713) 555-0102'
    },
    {
      id: 3,
      providerName: 'Direct Energy',
      status: 'Pending',
      contractType: 'Standard',
      commissionRate: 0.078,
      contractEndDate: '2024-09-15',
      totalAccounts: 4,
      totalEsiids: 8,
      monthlyRevenue: 18000,
      contactPerson: 'Mike Chen',
      contactEmail: 'mike.chen@directenergy.com',
      contactPhone: '(713) 555-0103'
    },
    {
      id: 4,
      providerName: 'Green Mountain Energy',
      status: 'Active',
      contractType: 'Premium',
      commissionRate: 0.095,
      contractEndDate: '2024-11-30',
      totalAccounts: 6,
      totalEsiids: 12,
      monthlyRevenue: 28000,
      contactPerson: 'Lisa Wang',
      contactEmail: 'lisa.wang@greenmountain.com',
      contactPhone: '(713) 555-0104'
    },
    {
      id: 5,
      providerName: 'Constellation Energy',
      status: 'Inactive',
      contractType: 'Standard',
      commissionRate: 0.082,
      contractEndDate: '2024-03-15',
      totalAccounts: 0,
      totalEsiids: 0,
      monthlyRevenue: 0,
      contactPerson: 'David Brown',
      contactEmail: 'david.brown@constellation.com',
      contactPhone: '(713) 555-0105'
    }
  ];

  const pricingSheets = [
    {
      id: 1,
      providerName: 'Reliant Energy',
      sheetName: 'Q1 2024 Pricing Sheet',
      effectiveDate: '2024-01-01',
      status: 'Active',
      rateType: 'Fixed',
      baseRate: 0.085,
      peakRate: 0.095,
      offPeakRate: 0.075
    },
    {
      id: 2,
      providerName: 'TXU Energy',
      sheetName: 'Premium Business Rates',
      effectiveDate: '2024-02-01',
      status: 'Active',
      rateType: 'Variable',
      baseRate: 0.092,
      peakRate: 0.102,
      offPeakRate: 0.082
    },
    {
      id: 3,
      providerName: 'Direct Energy',
      sheetName: 'Competitive Business Rates',
      effectiveDate: '2024-03-01',
      status: 'Pending',
      rateType: 'Fixed',
      baseRate: 0.078,
      peakRate: 0.088,
      offPeakRate: 0.068
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
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

  const handleProviderAction = (action, providerId) => {
    console.log('Provider action:', action, 'for provider:', providerId);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getFilteredProviders = () => {
    let filtered = providers;

    if (searchQuery) {
      filtered = filtered.filter(provider =>
        provider.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.status.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'commissionRate' || sortField === 'monthlyRevenue') {
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

  const filteredProviders = getFilteredProviders();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return '#10b981';
      case 'Pending': return '#f59e0b';
      case 'Inactive': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusBackground = (status) => {
    switch (status) {
      case 'Active': return 'rgba(16, 185, 129, 0.2)';
      case 'Pending': return 'rgba(245, 158, 11, 0.2)';
      case 'Inactive': return 'rgba(239, 68, 68, 0.2)';
      default: return 'rgba(107, 114, 128, 0.2)';
    }
  };

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
      <BackgroundGradient />
      <BackgroundPattern />
      <FloatingShapes />
      
      <Header
        activePage="providers"
        onNavigate={handleNavigation}
        onLogout={onLogout}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
      />

      <MainContainer>
        <PageHeader>
          <PageTitle>Provider & Pricing Management</PageTitle>
          <PageSubtitle>Manage energy providers, pricing sheets, and contracts</PageSubtitle>
        </PageHeader>

        <TabContainer>
          <TabButton
            active={activeTab === 'providers'}
            onClick={() => setActiveTab('providers')}
          >
            Energy Providers
          </TabButton>
          <TabButton
            active={activeTab === 'pricing'}
            onClick={() => setActiveTab('pricing')}
          >
            Pricing Sheets
          </TabButton>
          <TabButton
            active={activeTab === 'contracts'}
            onClick={() => setActiveTab('contracts')}
          >
            Contract Management
          </TabButton>
        </TabContainer>

        <TabContent>
          {activeTab === 'providers' && (
            <ProvidersTab>
              <Section>
                <SectionTitle>Energy Providers</SectionTitle>
                <ProviderTable>
                  <TableHeader>
                    <TableRow>
                      <TableHeaderCell onClick={() => handleSort('providerName')}>
                        Provider Name
                        <SortIcon>{sortField === 'providerName' ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}</SortIcon>
                      </TableHeaderCell>
                      <TableHeaderCell>Status</TableHeaderCell>
                      <TableHeaderCell>Contract Type</TableHeaderCell>
                      <TableHeaderCell onClick={() => handleSort('commissionRate')}>
                        Commission Rate
                        <SortIcon>{sortField === 'commissionRate' ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}</SortIcon>
                      </TableHeaderCell>
                      <TableHeaderCell>Contract End Date</TableHeaderCell>
                      <TableHeaderCell>Total Accounts</TableHeaderCell>
                      <TableHeaderCell onClick={() => handleSort('monthlyRevenue')}>
                        Monthly Revenue
                        <SortIcon>{sortField === 'monthlyRevenue' ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}</SortIcon>
                      </TableHeaderCell>
                      <TableHeaderCell>Actions</TableHeaderCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProviders.map(provider => (
                      <TableRow key={provider.id}>
                        <TableCell>
                          <ProviderLink onClick={() => setSelectedProvider(provider)}>
                            {provider.providerName}
                          </ProviderLink>
                        </TableCell>
                        <TableCell>
                          <StatusBadge 
                            status={provider.status}
                            color={getStatusColor(provider.status)}
                            background={getStatusBackground(provider.status)}
                          >
                            {provider.status}
                          </StatusBadge>
                        </TableCell>
                        <TableCell>
                          <ContractBadge type={provider.contractType}>
                            {provider.contractType}
                          </ContractBadge>
                        </TableCell>
                        <TableCell>
                          {(provider.commissionRate * 100).toFixed(1)}%
                        </TableCell>
                        <TableCell>
                          {new Date(provider.contractEndDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{provider.totalAccounts}</TableCell>
                        <TableCell>
                          ${provider.monthlyRevenue.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <ActionButtons>
                            <ActionButton onClick={() => handleProviderAction('view', provider.id)}>
                              👁️ View
                            </ActionButton>
                            <ActionButton onClick={() => handleProviderAction('edit', provider.id)}>
                              ✏️ Edit
                            </ActionButton>
                            <ActionButton onClick={() => handleProviderAction('pricing', provider.id)}>
                              💰 Pricing
                            </ActionButton>
                          </ActionButtons>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </ProviderTable>
              </Section>
            </ProvidersTab>
          )}

          {activeTab === 'pricing' && (
            <PricingTab>
              <Section>
                <SectionTitle>Pricing Sheets</SectionTitle>
                <PricingTable>
                  <TableHeader>
                    <TableRow>
                      <TableHeaderCell>Provider</TableHeaderCell>
                      <TableHeaderCell>Sheet Name</TableHeaderCell>
                      <TableHeaderCell>Effective Date</TableHeaderCell>
                      <TableHeaderCell>Status</TableHeaderCell>
                      <TableHeaderCell>Rate Type</TableHeaderCell>
                      <TableHeaderCell>Base Rate</TableHeaderCell>
                      <TableHeaderCell>Actions</TableHeaderCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pricingSheets.map(sheet => (
                      <TableRow key={sheet.id}>
                        <TableCell>{sheet.providerName}</TableCell>
                        <TableCell>{sheet.sheetName}</TableCell>
                        <TableCell>
                          {new Date(sheet.effectiveDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <StatusBadge 
                            status={sheet.status}
                            color={getStatusColor(sheet.status)}
                            background={getStatusBackground(sheet.status)}
                          >
                            {sheet.status}
                          </StatusBadge>
                        </TableCell>
                        <TableCell>{sheet.rateType}</TableCell>
                        <TableCell>${sheet.baseRate.toFixed(3)}/kWh</TableCell>
                        <TableCell>
                          <ActionButtons>
                            <ActionButton onClick={() => console.log('View pricing sheet', sheet.id)}>
                              👁️ View
                            </ActionButton>
                            <ActionButton onClick={() => console.log('Edit pricing sheet', sheet.id)}>
                              ✏️ Edit
                            </ActionButton>
                            <ActionButton onClick={() => console.log('Download pricing sheet', sheet.id)}>
                              📥 Download
                            </ActionButton>
                          </ActionButtons>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </PricingTable>
              </Section>
            </PricingTab>
          )}

          {activeTab === 'contracts' && (
            <ContractsTab>
              <Section>
                <SectionTitle>Contract Management</SectionTitle>
                <ContractGrid>
                  <ContractCard>
                    <ContractIcon>📋</ContractIcon>
                    <ContractTitle>Active Contracts</ContractTitle>
                    <ContractCount>4</ContractCount>
                    <ContractDescription>
                      Currently active provider contracts
                    </ContractDescription>
                    <ContractActions>
                      <ContractButton onClick={() => console.log('View active contracts')}>
                        👁️ View All
                      </ContractButton>
                    </ContractActions>
                  </ContractCard>

                  <ContractCard>
                    <ContractIcon>⏳</ContractIcon>
                    <ContractTitle>Expiring Soon</ContractTitle>
                    <ContractCount>2</ContractCount>
                    <ContractDescription>
                      Contracts expiring within 90 days
                    </ContractDescription>
                    <ContractActions>
                      <ContractButton onClick={() => console.log('View expiring contracts')}>
                        👁️ View All
                      </ContractButton>
                    </ContractActions>
                  </ContractCard>

                  <ContractCard>
                    <ContractIcon>📝</ContractIcon>
                    <ContractTitle>Draft Contracts</ContractTitle>
                    <ContractCount>1</ContractCount>
                    <ContractDescription>
                      Contracts in negotiation phase
                    </ContractDescription>
                    <ContractActions>
                      <ContractButton onClick={() => console.log('View draft contracts')}>
                        👁️ View All
                      </ContractButton>
                    </ContractActions>
                  </ContractCard>

                  <ContractCard>
                    <ContractIcon>📊</ContractIcon>
                    <ContractTitle>Contract Analytics</ContractTitle>
                    <ContractCount>-</ContractCount>
                    <ContractDescription>
                      Performance and revenue analytics
                    </ContractDescription>
                    <ContractActions>
                      <ContractButton onClick={() => console.log('View analytics')}>
                        📊 View Reports
                      </ContractButton>
                    </ContractActions>
                  </ContractCard>
                </ContractGrid>
              </Section>
            </ContractsTab>
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

const ProviderTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const PricingTable = styled.table`
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

const ProviderLink = styled.button`
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

const ContractGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;

const ContractCard = styled.div`
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

const ContractIcon = styled.div`
  font-size: 32px;
  margin-bottom: 16px;
`;

const ContractTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${colors.text};
  margin-bottom: 8px;
`;

const ContractCount = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${colors.accent};
  margin-bottom: 8px;
`;

const ContractDescription = styled.p`
  font-size: 14px;
  color: ${colors.textLight};
  margin-bottom: 16px;
  line-height: 1.5;
`;

const ContractActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ContractButton = styled.button`
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
const ProvidersTab = styled.div``;
const PricingTab = styled.div``;
const ContractsTab = styled.div``;

export default ProviderDashboard; 