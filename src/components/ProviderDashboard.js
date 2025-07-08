import React, { useState } from 'react';
import styled from 'styled-components';
import kilowattImage from '../assets/image.png';
import colors from '../assets/colors';

const ProviderDashboard = ({ onLogout, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('providers');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('providerName');
  const [sortDirection, setSortDirection] = useState('asc');

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
            <NavLink onClick={() => handleNavigation('commissions')}>
              Commissions
            </NavLink>
            <NavLink active onClick={() => handleNavigation('providers')}>
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
              placeholder="Search providers, pricing, etc..."
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

const ProviderTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const PricingTable = styled.table`
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

const ProviderLink = styled.button`
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

const ContractGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;

const ContractCard = styled.div`
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

const ContractIcon = styled.div`
  font-size: 32px;
  margin-bottom: 16px;
`;

const ContractTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: white;
  margin-bottom: 8px;
`;

const ContractCount = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #fbbf24;
  margin-bottom: 8px;
`;

const ContractDescription = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 16px;
  line-height: 1.5;
`;

const ContractActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ContractButton = styled.button`
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
const ProvidersTab = styled.div``;
const PricingTab = styled.div``;
const ContractsTab = styled.div``;

export default ProviderDashboard; 