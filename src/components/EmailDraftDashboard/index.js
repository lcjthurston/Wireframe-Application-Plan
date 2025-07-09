import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Grid,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Chip,
  Container,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Search as SearchIcon,
  Dashboard as DashboardIcon,
  Assignment as TaskIcon,
  AccountCircle as AccountIcon,
  Email as EmailIcon,
  AttachMoney as MoneyIcon,
  Business as BusinessIcon,
  HealthAndSafety as HealthIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Send as SendIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  ExpandMore as ExpandMoreIcon,
  AttachFile as AttachFileIcon
} from '@mui/icons-material';
import kilowattImage from '../../assets/image.png';
import './EmailDraftDashboard.scss';

const EmailDraftDashboard = ({ onLogout, onNavigate }) => {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [searchQuery, setSearchQuery] = useState('');
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);

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
    { value: 'recipient', label: 'Recipient' },
    { value: 'account', label: 'Account' },
    { value: 'type', label: 'Email Type' }
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

  const handleEmailAction = (action, emailId) => {
    console.log(`${action} email:`, emailId);
    if (action === 'view') {
      const email = emailDrafts.find(e => e.id === emailId);
      setSelectedEmail(email);
      setEmailDialogOpen(true);
    }
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk ${action} emails`);
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

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(email =>
        email.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.account.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.subject.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.dateDrafted) - new Date(a.dateDrafted);
        case 'recipient':
          return a.recipient.localeCompare(b.recipient);
        case 'account':
          return a.account.localeCompare(b.account);
        case 'type':
          return a.emailType.localeCompare(b.emailType);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const getEmailTypeColor = (type) => {
    switch (type) {
      case 'Pricing Sheet':
        return 'primary';
      case 'Contract':
        return 'success';
      case 'Manager Change Notification':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getEmailTypeClass = (type) => {
    switch (type) {
      case 'Pricing Sheet':
        return 'email-draft-type-pricing';
      case 'Contract':
        return 'email-draft-type-contract';
      case 'Manager Change Notification':
        return 'email-draft-type-manager';
      default:
        return '';
    }
  };

  const filteredEmails = getFilteredEmails();

  return (
    <Box className="email-draft-dashboard">
      <AppBar position="static" className="email-draft-app-bar">
        <Toolbar className="email-draft-toolbar">
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <img src={kilowattImage} alt="Kilowatt" className="email-draft-logo" />
            <Typography variant="h6" component="div" className="email-draft-brand">
              Kilowatt
            </Typography>
          </Box>

          <Box className="email-draft-search-container">
            <TextField
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              variant="outlined"
              size="small"
              className="email-draft-search-field"
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                ),
              }}
            />
          </Box>

          <Button
            color="inherit"
            onClick={() => handleNavigation('home')}
            className="email-draft-profile-button"
            startIcon={<AccountIcon />}
          >
            Profile
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" className="email-draft-content">
        <Box className="email-draft-header">
          <Typography variant="h4" className="email-draft-title">
            Email Draft Dashboard
          </Typography>
          <Typography variant="body1" className="email-draft-subtitle">
            Manage and review email drafts before sending
          </Typography>
        </Box>

        <Grid container spacing={3} className="email-draft-stats">
          <Grid item xs={12} sm={6} md={3}>
            <Card className="email-draft-stat-card">
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h3" className="email-draft-stat-value">
                  {emailDrafts.length}
                </Typography>
                <Typography variant="body2" className="email-draft-stat-label">
                  Total Drafts
                </Typography>
                <Typography variant="h2" className="email-draft-stat-icon">
                  📧
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="email-draft-stat-card">
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h3" className="email-draft-stat-value">
                  {emailDrafts.filter(e => e.emailType === 'Pricing Sheet').length}
                </Typography>
                <Typography variant="body2" className="email-draft-stat-label">
                  Pricing Sheets
                </Typography>
                <Typography variant="h2" className="email-draft-stat-icon">
                  💰
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="email-draft-stat-card">
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h3" className="email-draft-stat-value">
                  {emailDrafts.filter(e => e.emailType === 'Contract').length}
                </Typography>
                <Typography variant="body2" className="email-draft-stat-label">
                  Contracts
                </Typography>
                <Typography variant="h2" className="email-draft-stat-icon">
                  📋
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="email-draft-stat-card">
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h3" className="email-draft-stat-value">
                  {emailDrafts.filter(e => e.emailType === 'Manager Change Notification').length}
                </Typography>
                <Typography variant="body2" className="email-draft-stat-label">
                  Manager Changes
                </Typography>
                <Typography variant="h2" className="email-draft-stat-icon">
                  👤
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper className="email-draft-filters">
          <Box className="email-draft-filter-row">
            <FormControl className="email-draft-filter-item">
              <InputLabel>Filter by Type</InputLabel>
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                label="Filter by Type"
              >
                {emailTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.label} ({type.count})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl className="email-draft-filter-item">
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Sort by"
              >
                {sortOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Paper>

        <Box className="email-draft-bulk-actions">
          <Typography variant="h6" sx={{ mb: 2 }}>
            Bulk Actions
          </Typography>
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={() => handleBulkAction('send')}
            className="email-draft-bulk-button"
          >
            Send Selected
          </Button>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => handleBulkAction('edit')}
            className="email-draft-bulk-button"
          >
            Edit Selected
          </Button>
          <Button
            variant="outlined"
            startIcon={<DeleteIcon />}
            onClick={() => handleBulkAction('delete')}
            className="email-draft-bulk-button"
          >
            Delete Selected
          </Button>
        </Box>

        <TableContainer className="email-draft-table-container">
          <Table className="email-draft-table">
            <TableHead>
              <TableRow>
                <TableCell>Recipient</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Email Type</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Date Drafted</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmails.map((email) => (
                <TableRow key={email.id}>
                  <TableCell>{email.recipient}</TableCell>
                  <TableCell>{email.account}</TableCell>
                  <TableCell>
                    <Chip
                      label={email.emailType}
                      color={getEmailTypeColor(email.emailType)}
                      size="small"
                      className={`email-draft-email-type-chip ${getEmailTypeClass(email.emailType)}`}
                    />
                  </TableCell>
                  <TableCell>{email.subject}</TableCell>
                  <TableCell>{email.dateDrafted}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleEmailAction('view', email.id)}
                      className="email-draft-action-button"
                    >
                      View
                    </Button>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleEmailAction('edit', email.id)}
                      className="email-draft-action-button"
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      startIcon={<SendIcon />}
                      onClick={() => handleEmailAction('send', email.id)}
                      className="email-draft-action-button"
                    >
                      Send
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredEmails.length === 0 && (
          <Box className="email-draft-empty-state">
            <Typography className="email-draft-empty-icon">
              📧
            </Typography>
            <Typography variant="h6" className="email-draft-empty-text">
              No email drafts found
            </Typography>
            <Typography variant="body2" className="email-draft-empty-subtext">
              Try adjusting your filters or search terms
            </Typography>
          </Box>
        )}
      </Container>

      <Dialog
        open={emailDialogOpen}
        onClose={() => setEmailDialogOpen(false)}
        maxWidth="md"
        fullWidth
        className="email-draft-dialog"
      >
        <DialogTitle className="email-draft-dialog-title">
          Email Details
        </DialogTitle>
        <DialogContent className="email-draft-dialog-content">
          {selectedEmail && (
            <>
              <Box className="email-draft-email-details">
                <Box className="email-draft-detail-row">
                  <Typography className="email-draft-detail-label">Recipient:</Typography>
                  <Typography className="email-draft-detail-value">{selectedEmail.recipient}</Typography>
                </Box>
                <Box className="email-draft-detail-row">
                  <Typography className="email-draft-detail-label">Account:</Typography>
                  <Typography className="email-draft-detail-value">{selectedEmail.account}</Typography>
                </Box>
                <Box className="email-draft-detail-row">
                  <Typography className="email-draft-detail-label">Subject:</Typography>
                  <Typography className="email-draft-detail-value">{selectedEmail.subject}</Typography>
                </Box>
                <Box className="email-draft-detail-row">
                  <Typography className="email-draft-detail-label">Type:</Typography>
                  <Typography className="email-draft-detail-value">{selectedEmail.emailType}</Typography>
                </Box>
                <Box className="email-draft-detail-row">
                  <Typography className="email-draft-detail-label">Date:</Typography>
                  <Typography className="email-draft-detail-value">{selectedEmail.dateDrafted}</Typography>
                </Box>
              </Box>

              <Typography variant="h6" sx={{ mb: 2 }}>
                Email Body
              </Typography>
              <Box className="email-draft-email-body">
                {selectedEmail.body}
              </Box>

              {selectedEmail.attachments.length > 0 && (
                <>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Attachments
                  </Typography>
                  <Box className="email-draft-attachments">
                    {selectedEmail.attachments.map((attachment, index) => (
                      <Box key={index} className="email-draft-attachment-item">
                        <AttachFileIcon className="email-draft-attachment-icon" />
                        <Typography className="email-draft-attachment-name">
                          {attachment}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEmailDialogOpen(false)}>Close</Button>
          <Button variant="contained" startIcon={<SendIcon />}>
            Send Email
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmailDraftDashboard; 