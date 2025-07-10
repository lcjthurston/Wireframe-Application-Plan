import React, { useState } from 'react';
import styled from 'styled-components';
import kilowattImage from '../assets/image.png';
import colors from '../assets/colors';
import Header from './Header';

const EmailDraftDashboard = ({ onLogout, onNavigate }) => {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock email data
  const emailDrafts = [
    {
      id: 1,
      recipient: 'john.smith@abccorp.com',
      account: 'ABC Corporation',
      emailType: 'Pricing Sheet',
      dateDrafted: '2024-01-15 14:30',
      subject: 'New Pricing Sheet - ABC Corporation',
      body: `Dear John Smith,

I hope this email finds you well. Please find attached the new pricing sheet for ABC Corporation.

Key highlights:
- Competitive rates for your business needs
- Flexible contract terms
- Excellent customer service

Please review and let us know if you have any questions.

Best regards,
Kilowatt Team`,
      attachments: ['pricing_sheet_abc_corp.pdf']
    },
    {
      id: 2,
      recipient: 'sarah.johnson@xyzindustries.com',
      account: 'XYZ Industries',
      emailType: 'Contract',
      dateDrafted: '2024-01-15 13:45',
      subject: 'Contract Renewal - XYZ Industries',
      body: `Dear Sarah Johnson,

We're pleased to present the contract renewal for XYZ Industries.

Contract details:
- Term: 12 months
- Rate: $0.085/kWh
- Start date: February 1, 2024

Please review the attached contract and let us know if you need any modifications.

Best regards,
Kilowatt Team`,
      attachments: ['contract_xyz_industries.pdf', 'terms_conditions.pdf']
    },
    {
      id: 3,
      recipient: 'mike.chen@mainstreetplaza.com',
      account: 'Main Street Plaza',
      emailType: 'Manager Change Notification',
      dateDrafted: '2024-01-15 12:15',
      subject: 'Manager Update - Main Street Plaza',
      body: `Dear Mike Chen,

This is to notify you of a manager change for Main Street Plaza.

New manager: Sarah Johnson
Contact: sarah.johnson@company.com
Phone: (713) 555-0123

Please update your records accordingly.

Best regards,
Kilowatt Team`,
      attachments: []
    },
    {
      id: 4,
      recipient: 'contact@downtowncenter.com',
      account: 'Downtown Center',
      emailType: 'Pricing Sheet',
      dateDrafted: '2024-01-15 11:30',
      subject: 'Updated Pricing - Downtown Center',
      body: `Dear Downtown Center Team,

Please find the updated pricing sheet for your facility.

New features:
- Enhanced energy efficiency options
- Green energy alternatives
- Cost savings opportunities

We look forward to your feedback.

Best regards,
Kilowatt Team`,
      attachments: ['pricing_downtown_center.pdf', 'energy_analysis.pdf']
    },
    {
      id: 5,
      recipient: 'admin@techparkllc.com',
      account: 'Tech Park LLC',
      emailType: 'Contract',
      dateDrafted: '2024-01-15 10:00',
      subject: 'Service Agreement - Tech Park LLC',
      body: `Dear Tech Park LLC Team,

We're excited to present the service agreement for your technology park.

Service highlights:
- 24/7 customer support
- Real-time usage monitoring
- Custom reporting options

Please review the attached agreement.

Best regards,
Kilowatt Team`,
      attachments: ['service_agreement_tech_park.pdf']
    }
  ];

  const emailTypes = [
    { id: 'all', label: 'All Emails', count: emailDrafts.length },
    { id: 'pricing-sheet', label: 'Pricing Sheet', count: emailDrafts.filter(e => e.emailType === 'Pricing Sheet').length },
    { id: 'contract', label: 'Contract', count: emailDrafts.filter(e => e.emailType === 'Contract').length },
    { id: 'manager-change', label: 'Manager Change Notification', count: emailDrafts.filter(e => e.emailType === 'Manager Change Notification').length }
  ];

  const sortOptions = [
    { value: 'date', label: 'Date Drafted' },
    { value: 'account', label: 'Account Name' },
    { value: 'type', label: 'Email Type' }
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

  const handleEmailAction = (action, emailId) => {
    console.log('Email action:', action, 'for email:', emailId);
    // TODO: Implement email actions
  };

  const handleBulkAction = (action) => {
    console.log('Bulk action:', action);
    // TODO: Implement bulk actions
  };

  const getFilteredEmails = () => {
    let filtered = emailDrafts;

    // Filter by type
    if (filterType !== 'all') {
      const typeMap = {
        'pricing-sheet': 'Pricing Sheet',
        'contract': 'Contract',
        'manager-change': 'Manager Change Notification'
      };
      filtered = filtered.filter(email => email.emailType === typeMap[filterType]);
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(email =>
        email.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.account.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.subject.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort emails
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'date':
          aValue = new Date(a.dateDrafted);
          bValue = new Date(b.dateDrafted);
          break;
        case 'account':
          aValue = a.account;
          bValue = b.account;
          break;
        case 'type':
          aValue = a.emailType;
          bValue = b.emailType;
          break;
        default:
          aValue = a.dateDrafted;
          bValue = b.dateDrafted;
      }

      if (aValue > bValue) return -1;
      if (aValue < bValue) return 1;
      return 0;
    });

    return filtered;
  };

  const filteredEmails = getFilteredEmails();

  return (
    <PageContainer>
      {/* Dynamic Background Layers */}
      <BackgroundGradient />
      <BackgroundPattern />
      <FloatingShapes />
      
      {/* Top Navigation Bar */}
      <Header
        activePage="email-drafts"
        onNavigate={handleNavigation}
        onLogout={onLogout}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
      />

      {/* Main Content */}
      <MainContainer>
        <PageHeader>
          <PageTitle>Email Draft Dashboard</PageTitle>
          <PageSubtitle>Review, edit, and send bot-drafted communications</PageSubtitle>
        </PageHeader>

        {/* Filter and Sort Controls */}
        <ControlsSection>
          <FilterControls>
            <FilterGroup>
              <FilterLabel>Email Type:</FilterLabel>
              <FilterSelect
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                {emailTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.label} ({type.count})
                  </option>
                ))}
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Sort By:</FilterLabel>
              <FilterSelect
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </FilterSelect>
            </FilterGroup>
          </FilterControls>

          <BulkActions>
            <BulkButton onClick={() => handleBulkAction('approve-all')}>
              Approve and Send All Selected Standard Emails
            </BulkButton>
          </BulkActions>
        </ControlsSection>

        {/* Email Queue and Preview */}
        <EmailContainer>
          {/* Email Queue */}
          <EmailQueue>
            <QueueHeader>
              <QueueTitle>Email Queue ({filteredEmails.length})</QueueTitle>
            </QueueHeader>
            <QueueList>
              {filteredEmails.map(email => (
                <QueueItem
                  key={email.id}
                  selected={selectedEmail?.id === email.id}
                  onClick={() => setSelectedEmail(email)}
                >
                  <EmailInfo>
                    <EmailRecipient>{email.recipient}</EmailRecipient>
                    <EmailAccount>{email.account}</EmailAccount>
                    <EmailType>{email.emailType}</EmailType>
                    <EmailDate>{email.dateDrafted}</EmailDate>
                  </EmailInfo>
                  <EmailActions>
                    <ActionButton onClick={(e) => {
                      e.stopPropagation();
                      handleEmailAction('edit', email.id);
                    }}>
                      ✏️ Edit
                    </ActionButton>
                    <ActionButton onClick={(e) => {
                      e.stopPropagation();
                      handleEmailAction('send', email.id);
                    }}>
                      📤 Send
                    </ActionButton>
                    <ActionButton onClick={(e) => {
                      e.stopPropagation();
                      handleEmailAction('delete', email.id);
                    }}>
                      🗑️ Delete
                    </ActionButton>
                  </EmailActions>
                </QueueItem>
              ))}
            </QueueList>
          </EmailQueue>

          {/* Preview Pane */}
          <PreviewPane>
            {selectedEmail ? (
              <>
                <PreviewHeader>
                  <PreviewTitle>Email Preview</PreviewTitle>
                  <PreviewActions>
                    <PreviewButton onClick={() => handleEmailAction('edit', selectedEmail.id)}>
                      ✏️ Edit & Send
                    </PreviewButton>
                    <PreviewButton onClick={() => handleEmailAction('send', selectedEmail.id)}>
                      📤 Send Now
                    </PreviewButton>
                    <PreviewButton danger onClick={() => handleEmailAction('delete', selectedEmail.id)}>
                      🗑️ Delete Draft
                    </PreviewButton>
                  </PreviewActions>
                </PreviewHeader>
                <PreviewContent>
                  <EmailDetails>
                    <DetailRow>
                      <DetailLabel>To:</DetailLabel>
                      <DetailValue>{selectedEmail.recipient}</DetailValue>
                    </DetailRow>
                    <DetailRow>
                      <DetailLabel>Subject:</DetailLabel>
                      <DetailValue>{selectedEmail.subject}</DetailValue>
                    </DetailRow>
                    <DetailRow>
                      <DetailLabel>Account:</DetailLabel>
                      <DetailValue>{selectedEmail.account}</DetailValue>
                    </DetailRow>
                    <DetailRow>
                      <DetailLabel>Type:</DetailLabel>
                      <DetailValue>
                        <TypeBadge>{selectedEmail.emailType}</TypeBadge>
                      </DetailValue>
                    </DetailRow>
                    <DetailRow>
                      <DetailLabel>Drafted:</DetailLabel>
                      <DetailValue>{selectedEmail.dateDrafted}</DetailValue>
                    </DetailRow>
                    {selectedEmail.attachments.length > 0 && (
                      <DetailRow>
                        <DetailLabel>Attachments:</DetailLabel>
                        <DetailValue>
                          {selectedEmail.attachments.map((attachment, index) => (
                            <AttachmentLink key={index} href="#">
                              📎 {attachment}
                            </AttachmentLink>
                          ))}
                        </DetailValue>
                      </DetailRow>
                    )}
                  </EmailDetails>
                  <EmailBody>
                    <BodyLabel>Message:</BodyLabel>
                    <BodyContent>{selectedEmail.body}</BodyContent>
                  </EmailBody>
                </PreviewContent>
              </>
            ) : (
              <EmptyPreview>
                <EmptyIcon>📧</EmptyIcon>
                <EmptyTitle>No Email Selected</EmptyTitle>
                <EmptyMessage>
                  Select an email from the queue to preview its content.
                </EmptyMessage>
              </EmptyPreview>
            )}
          </PreviewPane>
        </EmailContainer>
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

const ControlsSection = styled.div`
  background: ${colors.surface};
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  border: 2px solid ${colors.border};
  box-shadow: 0 8px 32px ${colors.shadow};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FilterControls = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FilterLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${colors.text};
`;

const FilterSelect = styled.select`
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

const BulkActions = styled.div`
  display: flex;
  gap: 12px;
`;

const BulkButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  padding: 10px 20px;
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

const EmailContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  height: 600px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    height: auto;
  }
`;

const EmailQueue = styled.div`
  background: ${colors.surface};
  border-radius: 16px;
  border: 2px solid ${colors.border};
  overflow: hidden;
  box-shadow: 0 8px 32px ${colors.shadow};
  display: flex;
  flex-direction: column;
`;

const QueueHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid ${colors.border};
`;

const QueueTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${colors.text};
  margin: 0;
`;

const QueueList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0;
`;

const QueueItem = styled.div`
  padding: 16px 24px;
  border-bottom: 1px solid ${colors.border};
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.selected ? colors.accent1 : 'transparent'};

  &:hover {
    background: ${colors.accent1};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const EmailInfo = styled.div`
  margin-bottom: 12px;
`;

const EmailRecipient = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${colors.text};
  margin-bottom: 4px;
`;

const EmailAccount = styled.div`
  font-size: 12px;
  color: ${colors.textLight};
  margin-bottom: 4px;
`;

const EmailType = styled.div`
  font-size: 12px;
  color: #fbbf24;
  font-weight: 500;
  margin-bottom: 4px;
`;

const EmailDate = styled.div`
  font-size: 11px;
  color: ${colors.textLight};
`;

const EmailActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  color: ${colors.text};
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${colors.accent1};
    transform: translateY(-1px);
  }
`;

const PreviewPane = styled.div`
  background: ${colors.surface};
  border-radius: 16px;
  border: 2px solid ${colors.border};
  overflow: hidden;
  box-shadow: 0 8px 32px ${colors.shadow};
  display: flex;
  flex-direction: column;
`;

const PreviewHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid ${colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PreviewTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${colors.text};
  margin: 0;
`;

const PreviewActions = styled.div`
  display: flex;
  gap: 8px;
`;

const PreviewButton = styled.button`
  background: ${props => props.danger ? colors.accent : colors.surface};
  border: 1px solid ${props => props.danger ? colors.accent : colors.border};
  color: ${props => props.danger ? colors.background : colors.text};
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.danger ? colors.accent : colors.accent1};
    transform: translateY(-1px);
  }
`;

const PreviewContent = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
`;

const EmailDetails = styled.div`
  margin-bottom: 24px;
`;

const DetailRow = styled.div`
  display: flex;
  margin-bottom: 12px;
  align-items: flex-start;
`;

const DetailLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${colors.textLight};
  min-width: 100px;
  margin-right: 16px;
`;

const DetailValue = styled.div`
  font-size: 14px;
  color: ${colors.text};
  flex: 1;
`;

const TypeBadge = styled.span`
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  background: ${colors.accent1};
  color: ${colors.accent};
  border: 1px solid ${colors.accent};
`;

const AttachmentLink = styled.a`
  display: block;
  color: ${colors.accent};
  text-decoration: none;
  font-size: 12px;
  margin-bottom: 4px;
  transition: color 0.2s ease;

  &:hover {
    color: ${colors.accent};
    text-decoration: underline;
  }
`;

const EmailBody = styled.div`
  border-top: 1px solid ${colors.border};
  padding-top: 20px;
`;

const BodyLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${colors.textLight};
  margin-bottom: 12px;
`;

const BodyContent = styled.div`
  font-size: 14px;
  color: ${colors.text};
  line-height: 1.6;
  white-space: pre-wrap;
`;

const EmptyPreview = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const EmptyTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${colors.text};
  margin-bottom: 8px;
`;

const EmptyMessage = styled.p`
  font-size: 14px;
  color: ${colors.textLight};
  margin: 0;
`;

export default EmailDraftDashboard; 