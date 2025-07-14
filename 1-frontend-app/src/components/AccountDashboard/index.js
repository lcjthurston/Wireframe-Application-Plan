import React, { useState, useRef, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Badge,
  Box,
  Grid,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon,
  AccountCircle,
  Business,
  Phone,
  Email,
  LocationOn,
  Person,
  AttachMoney,
  Description,
  History,
  Refresh,
  GetApp,
  Edit,
  MoreVert,
  CheckCircle,
  Warning,
  Error,
  Info,
  ArrowBack
} from '@mui/icons-material';
import kilowattImage from '../../assets/image.png';
import './AccountDashboard.scss';
import styled from 'styled-components';
import colors from '../../assets/colors';
import DataEntryModal from '../DataEntryModal';

const AccountDashboard = ({ onLogout, onNavigate, accountId }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showManagerModal, setShowManagerModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const [showDataEntryModal, setShowDataEntryModal] = useState(false);
  const [refreshStatus, setRefreshStatus] = useState('idle'); // 'idle', 'pending', 'success', 'error'

  // Mock account data
  const account = {
    name: 'ABC Corporation',
    status: 'Needs Pricing',
    manager: 'Sarah Johnson',
    managementCompany: 'Property Management Inc.',
    address: '123 Business Ave, Suite 100, Houston, TX 77001',
    contactInfo: {
      phone: '(713) 555-0123',
      email: 'contact@abccorp.com'
    },
    requiresAction: true,
    actionMessage: 'This account needs providers selected before a pricing sheet can be generated.'
  };

  const contract = {
    provider: 'Energy Plus',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    documents: [
      { name: 'Signed Contract.pdf', url: '#' },
      { name: 'Docusign Link', url: '#' }
    ]
  };

  const pricingHistory = [
    { date: '2024-01-15', provider: 'Energy Plus', status: 'Sent' },
    { date: '2024-01-10', provider: 'Power Solutions', status: 'Sent' },
    { date: '2024-01-05', provider: 'Green Energy Co.', status: 'Sent' }
  ];

  const esiids = [
    {
      number: '1234567890123456',
      rep: 'TXU Energy',
      loadProfile: 'Commercial',
      kwhPerMonth: 12500,
      kwhPerYear: 150000
    },
    {
      number: '9876543210987654',
      rep: 'Reliant Energy',
      loadProfile: 'Industrial',
      kwhPerMonth: 45000,
      kwhPerYear: 540000
    },
    {
      number: '5555666677778888',
      rep: 'Direct Energy',
      loadProfile: 'Small Commercial',
      kwhPerMonth: 8200,
      kwhPerYear: 98400
    }
  ];

  const commissions = {
    projected: 2500,
    realized: 2300,
    monthly: [
      { month: 'Jan 2024', projected: 2500, realized: 2300 },
      { month: 'Dec 2023', projected: 2400, realized: 2400 },
      { month: 'Nov 2023', projected: 2500, realized: 2450 }
    ]
  };

  const activityHistory = [
    {
      timestamp: '2024-01-15 15:30',
      type: 'bot',
      action: 'Usage data updated from Centerpoint',
      user: null
    },
    {
      timestamp: '2024-01-15 14:00',
      type: 'user',
      action: 'Generated new pricing sheet',
      user: 'John Doe'
    },
    {
      timestamp: '2024-01-15 10:15',
      type: 'bot',
      action: 'Contract follow-up email sent',
      user: null
    },
    {
      timestamp: '2024-01-14 16:45',
      type: 'user',
      action: 'Updated manager to Sarah Johnson',
      user: 'Mike Chen'
    }
  ];

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

  const handleRefreshUsage = () => {
    console.log('Running refresh usage automation');
    setRefreshStatus('pending');

    // Simulate API call
    setTimeout(() => {
      setRefreshStatus('success');
      // Reset to idle after 3 seconds
      setTimeout(() => {
        setRefreshStatus('idle');
      }, 3000);
    }, 2000);
  };

  const handleGeneratePricing = () => {
    console.log('Generating new pricing sheet');
    // TODO: Implement pricing generation
  };

  const handleDraftContract = () => {
    console.log('Drafting new contract');
    // TODO: Implement contract drafting
  };

  const handleNewAccount = () => {
    setShowDataEntryModal(true);
  };
  const handleCloseDataEntryModal = () => {
    setShowDataEntryModal(false);
  };
  const handleSaveNewAccount = (data) => {
    // TODO: Implement actual save logic
    console.log('New Account Data:', data);
    setShowDataEntryModal(false);
  };

  const handleAddMeter = () => {
    console.log('Adding new meter');
    // TODO: Implement add meter functionality
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'contracts', label: 'Contracts & Pricing' },
    { id: 'esiids', label: 'ESIIDs & Usage' },
    { id: 'commissions', label: 'Commissions' },
    { id: 'activity', label: 'Activity History' }
  ];

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

      {/* Top AppBar (Material-UI, modeled after TaskQueue) */}
      <AppBar position="static" className="account-dashboard-app-bar">
        <Toolbar className="account-dashboard-toolbar">
          <Box display="flex" alignItems="center" flexGrow={1}>
            <Box
              sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => handleNavigation('home')}
            >
              <img src={kilowattImage} alt="Kilowatt" className="account-dashboard-logo" />
              <Typography variant="h5" className="account-dashboard-brand">
                Kilowatt
              </Typography>
            </Box>
            {/* Navigation Links */}
            <Box ml={4} display="flex" alignItems="center" gap={2}>
              <Button
                color="inherit"
                onClick={() => handleNavigation('accounts')}
                startIcon={<ArrowBack />}
                variant="outlined"
              >
                Back to Accounts
              </Button>
              <Button color="inherit" onClick={() => handleNavigation('home')}>Home</Button>
              <Button color="inherit" onClick={() => handleNavigation('task-queue')}>Task Queue</Button>
              <Button
                color="primary"
                variant="contained"
                onClick={handleNewAccount}
                sx={{ ml: 2 }}
              >
                New Account
              </Button>
              <Button
                color="inherit"
                onClick={() => setDropdownOpen(v => !v)}
                ref={dropdownRef}
                endIcon={<MoreVert />}
              >
                More
              </Button>
              {dropdownOpen && (
                <Menu
                  anchorEl={dropdownRef.current}
                  open={dropdownOpen}
                  onClose={() => setDropdownOpen(false)}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                >
                  <MenuItem onClick={() => { setDropdownOpen(false); handleNavigation('managers'); }}>Managers</MenuItem>
                  <MenuItem onClick={() => { setDropdownOpen(false); handleNavigation('email-drafts'); }}>Email Drafts</MenuItem>
                  <MenuItem onClick={() => { setDropdownOpen(false); handleNavigation('commissions'); }}>Commissions</MenuItem>
                  <MenuItem onClick={() => { setDropdownOpen(false); handleNavigation('providers'); }}>Providers</MenuItem>
                  <MenuItem onClick={() => { setDropdownOpen(false); handleNavigation('system-health'); }}>System Health</MenuItem>
                </Menu>
              )}
            </Box>
          </Box>

          {/* Search */}
          <Box className="account-dashboard-search-container">
            <TextField
              placeholder="Search accounts, managers, etc..."
              variant="outlined"
              size="small"
              className="account-dashboard-search-field"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Profile */}
          <Button
            color="inherit"
            className="account-dashboard-profile-button"
            onClick={() => handleProfileAction('profile')}
            startIcon={<AccountCircle />}
          >
            John Doe
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <MainContainer>
        {/* Header Section */}
        <AccountHeader>
          <AccountInfo>
            <AccountName>{account.name}</AccountName>
            <AccountStatus status={account.status}>
              {account.status}
            </AccountStatus>
          </AccountInfo>
          <AccountDetails>
            <DetailItem>
              <DetailLabel>Manager:</DetailLabel>
              <DetailValue>
                <ManagerLink onClick={() => handleNavigation('managers')}>
                  {account.manager}
                </ManagerLink>
              </DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Management Co.:</DetailLabel>
              <DetailValue>
                <CompanyLink onClick={() => handleNavigation('management-co')}>
                  {account.managementCompany}
                </CompanyLink>
              </DetailValue>
            </DetailItem>
          </AccountDetails>
        </AccountHeader>

        {/* Required Action Banner */}
        {account.requiresAction && (
          <ActionBanner>
            <ActionIcon>⚠️</ActionIcon>
            <ActionMessage>{account.actionMessage}</ActionMessage>
          </ActionBanner>
        )}

        {/* Tabbed Interface */}
        <TabContainer>
          {tabs.map(tab => (
            <TabButton
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </TabButton>
          ))}
        </TabContainer>

        {/* Tab Content */}
        <TabContent>
          {activeTab === 'overview' && (
            <OverviewTab>
              <Section>
                <SectionTitle>Contact Information</SectionTitle>
                <ContactGrid>
                  <ContactItem>
                    <ContactLabel>Address:</ContactLabel>
                    <ContactValue>{account.address}</ContactValue>
                  </ContactItem>
                  <ContactItem>
                    <ContactLabel>Phone:</ContactLabel>
                    <ContactValue>{account.contactInfo.phone}</ContactValue>
                  </ContactItem>
                  <ContactItem>
                    <ContactLabel>Email:</ContactLabel>
                    <ContactValue>{account.contactInfo.email}</ContactValue>
                  </ContactItem>
                </ContactGrid>
              </Section>

              <Section>
                <SectionTitle>Management Details</SectionTitle>
                <ManagementDetails>
                  <DetailRow>
                    <DetailLabel>Current Manager:</DetailLabel>
                    <DetailValue>{account.manager}</DetailValue>
                    <OverviewActionButton onClick={() => setShowManagerModal(true)}>
                      Change Manager
                    </OverviewActionButton>
                  </DetailRow>
                  <DetailRow>
                    <DetailLabel>Management Company:</DetailLabel>
                    <DetailValue>{account.managementCompany}</DetailValue>
                  </DetailRow>
                </ManagementDetails>
              </Section>
            </OverviewTab>
          )}

          {activeTab === 'contracts' && (
            <ContractsTab>
              <Section>
                <SectionTitle>Current Contract</SectionTitle>
                <ContractInfo>
                  <ContractDetail>
                    <DetailLabel>Provider:</DetailLabel>
                    <DetailValue>{contract.provider}</DetailValue>
                  </ContractDetail>
                  <ContractDetail>
                    <DetailLabel>Start Date:</DetailLabel>
                    <DetailValue>{new Date(contract.startDate).toLocaleDateString()}</DetailValue>
                  </ContractDetail>
                  <ContractDetail>
                    <DetailLabel>End Date:</DetailLabel>
                    <DetailValue>{new Date(contract.endDate).toLocaleDateString()}</DetailValue>
                  </ContractDetail>
                </ContractInfo>

                <DocumentLinks>
                  <SectionSubtitle>Contract Documents</SectionSubtitle>
                  {contract.documents.map((doc, index) => (
                    <DocumentLink key={index} href={doc.url}>
                      📄 {doc.name}
                    </DocumentLink>
                  ))}
                </DocumentLinks>

                <ActionButtons>
                  <PrimaryButton onClick={handleDraftContract}>
                    Draft New Contract
                  </PrimaryButton>
                  <SecondaryButton onClick={handleGeneratePricing}>
                    Generate New Pricing Sheet
                  </SecondaryButton>
                </ActionButtons>
              </Section>

              <Section>
                <SectionTitle>Pricing History</SectionTitle>
                <PricingTable>
                  <TableHeader>
                    <TableRow>
                      <TableHeaderCell>Date</TableHeaderCell>
                      <TableHeaderCell>Provider</TableHeaderCell>
                      <TableHeaderCell>Status</TableHeaderCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pricingHistory.map((pricing, index) => (
                      <TableRow key={index}>
                        <TableCell>{new Date(pricing.date).toLocaleDateString()}</TableCell>
                        <TableCell>{pricing.provider}</TableCell>
                        <TableCell>
                          <StatusBadge status={pricing.status}>
                            {pricing.status}
                          </StatusBadge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </PricingTable>
              </Section>
            </ContractsTab>
          )}

          {activeTab === 'esiids' && (
            <EsiidsTab>
              <Section>
                <SectionHeader>
                  <SectionTitle>ESIIDs & Usage</SectionTitle>
                  <Box display="flex" gap={2}>
                    <RefreshButton
                      onClick={handleRefreshUsage}
                      disabled={refreshStatus === 'pending'}
                      status={refreshStatus}
                    >
                      {refreshStatus === 'pending' ? (
                        <>🔄 Pending Refresh...</>
                      ) : refreshStatus === 'success' ? (
                        <>✅ Successfully Refreshed</>
                      ) : (
                        <>🔄 Run Refresh Usage Automation</>
                      )}
                    </RefreshButton>
                    <AddMeterButton onClick={handleAddMeter}>
                      ➕ Add Meter
                    </AddMeterButton>
                  </Box>
                </SectionHeader>
                <EsiidsTable>
                  <TableHeader>
                    <TableRow>
                      <TableHeaderCell>ESIID</TableHeaderCell>
                      <TableHeaderCell>Rep</TableHeaderCell>
                      <TableHeaderCell>Load Profile</TableHeaderCell>
                      <TableHeaderCell>kWh per Month</TableHeaderCell>
                      <TableHeaderCell>kWh Per Year</TableHeaderCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {esiids.map((esiid, index) => (
                      <TableRow key={index}>
                        <TableCell>{esiid.number}</TableCell>
                        <TableCell>{esiid.rep}</TableCell>
                        <TableCell>{esiid.loadProfile}</TableCell>
                        <TableCell>{esiid.kwhPerMonth?.toLocaleString()}</TableCell>
                        <TableCell>{esiid.kwhPerYear?.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </EsiidsTable>
              </Section>
            </EsiidsTab>
          )}

          {activeTab === 'commissions' && (
            <CommissionsTab>
              <Section>
                <SectionTitle>Commission Summary</SectionTitle>
                <CommissionCards>
                  <CommissionCard>
                    <CardTitle>Projected</CardTitle>
                    <CardAmount>${commissions.projected.toLocaleString()}</CardAmount>
                  </CommissionCard>
                  <CommissionCard>
                    <CardTitle>Realized</CardTitle>
                    <CardAmount>${commissions.realized.toLocaleString()}</CardAmount>
                  </CommissionCard>
                  <CommissionCard>
                    <CardTitle>Difference</CardTitle>
                    <CardAmount difference={commissions.projected - commissions.realized}>
                      ${(commissions.projected - commissions.realized).toLocaleString()}
                    </CardAmount>
                  </CommissionCard>
                </CommissionCards>
              </Section>

              <Section>
                <SectionTitle>Monthly Commission History</SectionTitle>
                <CommissionTable>
                  <TableHeader>
                    <TableRow>
                      <TableHeaderCell>Month</TableHeaderCell>
                      <TableHeaderCell>Projected</TableHeaderCell>
                      <TableHeaderCell>Realized</TableHeaderCell>
                      <TableHeaderCell>Difference</TableHeaderCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {commissions.monthly.map((month, index) => (
                      <TableRow key={index}>
                        <TableCell>{month.month}</TableCell>
                        <TableCell>${month.projected.toLocaleString()}</TableCell>
                        <TableCell>${month.realized.toLocaleString()}</TableCell>
                        <TableCell>
                          <DifferenceBadge difference={month.projected - month.realized}>
                            ${(month.projected - month.realized).toLocaleString()}
                          </DifferenceBadge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </CommissionTable>
              </Section>
            </CommissionsTab>
          )}

          {activeTab === 'activity' && (
            <ActivityTab>
              <Section>
                <SectionTitle>Activity History</SectionTitle>
                <ActivityList>
                  {activityHistory.map((activity, index) => (
                    <ActivityItem key={index}>
                      <ActivityIcon>
                        {activity.type === 'bot' ? '🤖' : '👤'}
                      </ActivityIcon>
                      <ActivityContent>
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
                      </ActivityContent>
                    </ActivityItem>
                  ))}
                </ActivityList>
              </Section>
            </ActivityTab>
          )}
        </TabContent>
      </MainContainer>
      <DataEntryModal
        isOpen={showDataEntryModal}
        onClose={handleCloseDataEntryModal}
        onSave={handleSaveNewAccount}
      />
    </PageContainer>
  );
};

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: ${colors.primary.main};
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
  padding: 0 40px;
  height: 100px;
  background: ${colors.primary.main};
  border-bottom: 1px solid ${colors.border};
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 100vw;
  max-width: 100vw;
  @media (max-width: 768px) {
    padding: 0 12px;
    height: 80px;
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
  flex-wrap: wrap;
  gap: 24px 32px;
  justify-content: center;
  align-items: center;
  width: auto;
  max-width: 100vw;
  overflow-x: visible;
  row-gap: 16px;
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

const AccountHeader = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const AccountInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
`;

const AccountName = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: white;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const AccountStatus = styled.span`
  padding: 6px 12px;
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

const AccountDetails = styled.div`
  display: flex;
  gap: 32px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DetailLabel = styled.span`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
`;

const DetailValue = styled.span`
  font-size: 14px;
  color: white;
  font-weight: 600;
`;

const ManagerLink = styled.button`
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

const CompanyLink = styled.button`
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

const ActionBanner = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  backdrop-filter: blur(10px);
`;

const ActionIcon = styled.span`
  font-size: 20px;
`;

const ActionMessage = styled.p`
  color: #fca5a5;
  font-size: 14px;
  font-weight: 500;
  margin: 0;
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

  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
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

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: white;
  margin: 0 0 16px 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const SectionSubtitle = styled.h3`
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 12px 0;
`;

const ContactGrid = styled.div`
  display: grid;
  gap: 12px;
`;

const ContactItem = styled.div`
  display: flex;
  gap: 8px;
`;

const ContactLabel = styled.span`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  min-width: 80px;
`;

const ContactValue = styled.span`
  font-size: 14px;
  color: white;
  font-weight: 500;
`;

const ManagementDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const OverviewActionButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 6px 12px;
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

const ContractInfo = styled.div`
  display: grid;
  gap: 12px;
  margin-bottom: 20px;
`;

const ContractDetail = styled.div`
  display: flex;
  gap: 8px;
`;

const DocumentLinks = styled.div`
  margin-bottom: 20px;
`;

const DocumentLink = styled.a`
  display: block;
  color: #fbbf24;
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 8px;
  transition: color 0.2s ease;

  &:hover {
    color: #f59e0b;
    text-decoration: underline;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const PrimaryButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
`;

const SecondaryButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
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
  padding: 12px 16px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: white;
`;

const TableBody = styled.tbody``;

const TableCell = styled.td`
  padding: 12px 16px;
  font-size: 14px;
  color: white;
  vertical-align: middle;
`;

const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  background: rgba(34, 197, 94, 0.2);
  color: #86efac;
  border: 1px solid rgba(34, 197, 94, 0.3);
`;

const RefreshButton = styled.button`
  background: ${props => {
    if (props.status === 'pending') return 'rgba(255, 193, 7, 0.2)';
    if (props.status === 'success') return 'rgba(34, 197, 94, 0.2)';
    return 'rgba(255, 255, 255, 0.1)';
  }};
  border: 1px solid ${props => {
    if (props.status === 'pending') return 'rgba(255, 193, 7, 0.3)';
    if (props.status === 'success') return 'rgba(34, 197, 94, 0.3)';
    return 'rgba(255, 255, 255, 0.2)';
  }};
  color: ${props => {
    if (props.status === 'pending') return '#fbbf24';
    if (props.status === 'success') return '#86efac';
    return 'white';
  }};
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  opacity: ${props => props.disabled ? 0.7 : 1};

  &:hover {
    background: ${props => {
      if (props.disabled) return 'inherit';
      if (props.status === 'pending') return 'rgba(255, 193, 7, 0.3)';
      if (props.status === 'success') return 'rgba(34, 197, 94, 0.3)';
      return 'rgba(255, 255, 255, 0.2)';
    }};
    transform: ${props => props.disabled ? 'none' : 'translateY(-1px)'};
  }
`;

const AddMeterButton = styled.button`
  background: rgba(34, 197, 94, 0.2);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #86efac;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(34, 197, 94, 0.3);
    transform: translateY(-1px);
  }
`;

const EsiidsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const CommissionCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const CommissionCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
`;

const CardTitle = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  margin-bottom: 8px;
`;

const CardAmount = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.difference >= 0 ? '#86efac' : '#fca5a5'};
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const CommissionTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const DifferenceBadge = styled.span`
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => props.difference >= 0 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
  color: ${props => props.difference >= 0 ? '#86efac' : '#fca5a5'};
  border: 1px solid ${props => props.difference >= 0 ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'};
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

const ActivityUser = styled.span`
  font-weight: 600;
  color: #fbbf24;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const ActivityTime = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
`;

// Tab content components
const OverviewTab = styled.div``;
const ContractsTab = styled.div``;
const EsiidsTab = styled.div``;
const CommissionsTab = styled.div``;
const ActivityTab = styled.div``;

const NavLink = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  font-weight: 500;
  color: ${props => props.active ? colors.background : 'rgba(255,255,255,0.8)'};
  cursor: pointer;
  padding: 18px 28px;
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

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const MoreOptionsButton = styled(NavLink)`
  padding-right: 36px;
  &::after {
    content: '';
    display: inline-block;
    margin-left: 8px;
  }
`;

const NavDropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: ${colors.primary.main};
  border: 1px solid ${colors.border};
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  min-width: 180px;
  z-index: 1000;
  padding: 8px 0;
`;

const NavDropdownItem = styled.button`
  width: 100%;
  background: none;
  border: none;
  color: white;
  font-size: 1.1rem;
  text-align: left;
  padding: 12px 24px;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: ${colors.accent1};
    color: ${colors.background};
  }
`;

export default AccountDashboard; 