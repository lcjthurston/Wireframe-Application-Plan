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
import { styled } from '@mui/material/styles';
import kilowattImage from '../assets/image.png';

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
    { value: 'account', label: 'Account Name' },
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
    console.log('Email action:', action, 'for email:', emailId);
    if (action === 'view') {
      const email = emailDrafts.find(e => e.id === emailId);
      setSelectedEmail(email);
      setEmailDialogOpen(true);
    }
  };

  const handleBulkAction = (action) => {
    console.log('Bulk action:', action);
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
          return 0;
      }

      if (aValue < bValue) return -1;
      if (aValue > bValue) return 1;
      return 0;
    });

    return filtered;
  };

  const filteredEmails = getFilteredEmails();

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

  const StyledAppBar = styled(AppBar)(({ theme }) => ({
    background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  }));

  const LogoImage = styled('img')({
    width: 40,
    height: 40,
    marginRight: 12,
    borderRadius: 8,
  });

  const DashboardCard = styled(Card)(({ theme }) => ({
    height: '100%',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
    },
  }));

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <StyledAppBar position="static">
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <LogoImage src={kilowattImage} alt="Kilowatt" />
            <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
              Kilowatt
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button color="inherit" onClick={() => handleNavigation('home')}>
              Home
            </Button>
            <Button color="inherit" onClick={() => handleNavigation('task-queue')}>
              Task Queue
            </Button>
            <Button color="inherit" onClick={() => handleNavigation('accounts')}>
              Accounts
            </Button>
            <Button color="inherit" onClick={() => handleNavigation('managers')}>
              Managers
            </Button>
            <Button color="inherit" variant="contained" sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
              Email Drafts
            </Button>
            <Button color="inherit" onClick={() => handleNavigation('commissions')}>
              Commissions
            </Button>
            <Button color="inherit" onClick={() => handleNavigation('providers')}>
              Providers
            </Button>
            <Button color="inherit" onClick={() => handleNavigation('system-health')}>
              System Health
            </Button>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 2 }}>
            <Paper component="form" onSubmit={handleSearch} sx={{ display: 'flex', alignItems: 'center', px: 2 }}>
              <TextField
                size="small"
                placeholder="Search emails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="standard"
                sx={{ minWidth: 200 }}
                InputProps={{ disableUnderline: true }}
              />
              <IconButton type="submit" size="small">
                <SearchIcon />
              </IconButton>
            </Paper>

            <IconButton onClick={onLogout} sx={{ color: 'inherit' }}>
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </StyledAppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            Email Draft Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and send email drafts to clients and partners
          </Typography>
        </Box>

        {/* Filters and Controls */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
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
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="Sort By"
                >
                  {sortOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="outlined" onClick={() => handleBulkAction('send')} startIcon={<SendIcon />}>
                  Send Selected
                </Button>
                <Button variant="outlined" onClick={() => handleBulkAction('delete')} startIcon={<DeleteIcon />}>
                  Delete Selected
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Email Queue */}
        <Grid container spacing={3}>
          {filteredEmails.map((email) => (
            <Grid item xs={12} key={email.id}>
              <DashboardCard>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
                        {email.subject}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        To: {email.recipient}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Account: {email.account}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip
                        label={email.emailType}
                        color={getEmailTypeColor(email.emailType)}
                        size="small"
                      />
                      <Typography variant="body2" color="text.secondary">
                        {email.dateDrafted}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {email.body.substring(0, 150)}...
                  </Typography>

                  {email.attachments.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Attachments:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {email.attachments.map((attachment, index) => (
                          <Chip
                            key={index}
                            icon={<AttachFileIcon />}
                            label={attachment}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleEmailAction('view', email.id)}
                      startIcon={<VisibilityIcon />}
                    >
                      View
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleEmailAction('edit', email.id)}
                      startIcon={<EditIcon />}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleEmailAction('send', email.id)}
                      startIcon={<SendIcon />}
                    >
                      Send
                    </Button>
                  </Box>
                </CardContent>
              </DashboardCard>
            </Grid>
          ))}
        </Grid>

        {/* Email Preview Dialog */}
        <Dialog
          open={emailDialogOpen}
          onClose={() => setEmailDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          {selectedEmail && (
            <>
              <DialogTitle>
                <Typography variant="h6">{selectedEmail.subject}</Typography>
                <Typography variant="body2" color="text.secondary">
                  To: {selectedEmail.recipient}
                </Typography>
              </DialogTitle>
              <DialogContent>
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={selectedEmail.emailType}
                    color={getEmailTypeColor(selectedEmail.emailType)}
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary" component="span">
                    Drafted: {selectedEmail.dateDrafted}
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                  {selectedEmail.body}
                </Typography>
                {selectedEmail.attachments.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Attachments:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {selectedEmail.attachments.map((attachment, index) => (
                        <Chip
                          key={index}
                          icon={<AttachFileIcon />}
                          label={attachment}
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setEmailDialogOpen(false)}>Close</Button>
                <Button variant="contained" startIcon={<SendIcon />}>
                  Send Email
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </Box>
  );
};

export default EmailDraftDashboard; 