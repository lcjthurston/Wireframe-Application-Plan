import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stepper,
  Step,
  StepLabel,
  Box,
  Typography,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Alert,
  LinearProgress,
  Divider,
  Card,
  CardContent,
  IconButton
} from '@mui/material';
import {
  Person,
  Business,
  AttachMoney,
  CheckCircle,
  NavigateNext,
  NavigateBefore,
  Close
} from '@mui/icons-material';

const DataEntryModal = ({ open, onClose, onSubmit, type = 'account' }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Account Information
    accountName: '',
    accountType: '',
    customerName: '',
    email: '',
    phone: '',
    address: '',
    
    // Business Information
    businessType: '',
    taxId: '',
    annualUsage: '',
    currentProvider: '',
    
    // Commission Information
    commissionRate: '',
    commissionType: 'percentage',
    paymentTerms: '',
    managerAssigned: '',
    
    // Additional Options
    autoRenewal: false,
    emailNotifications: true,
    smsNotifications: false
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { label: 'Account Details', icon: <Person /> },
    { label: 'Business Info', icon: <Business /> },
    { label: 'Commission Setup', icon: <AttachMoney /> },
    { label: 'Review & Submit', icon: <CheckCircle /> }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 0: // Account Details
        if (!formData.accountName) newErrors.accountName = 'Account name is required';
        if (!formData.customerName) newErrors.customerName = 'Customer name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.phone) newErrors.phone = 'Phone is required';
        break;
        
      case 1: // Business Info
        if (!formData.businessType) newErrors.businessType = 'Business type is required';
        if (!formData.annualUsage) newErrors.annualUsage = 'Annual usage is required';
        break;
        
      case 2: // Commission Setup
        if (!formData.commissionRate) newErrors.commissionRate = 'Commission rate is required';
        if (!formData.managerAssigned) newErrors.managerAssigned = 'Manager assignment is required';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
      // Reset form
      setFormData({
        accountName: '',
        accountType: '',
        customerName: '',
        email: '',
        phone: '',
        address: '',
        businessType: '',
        taxId: '',
        annualUsage: '',
        currentProvider: '',
        commissionRate: '',
        commissionType: 'percentage',
        paymentTerms: '',
        managerAssigned: '',
        autoRenewal: false,
        emailNotifications: true,
        smsNotifications: false
      });
      setActiveStep(0);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Account Name"
                value={formData.accountName}
                onChange={(e) => handleInputChange('accountName', e.target.value)}
                error={!!errors.accountName}
                helperText={errors.accountName}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Account Type</InputLabel>
                <Select
                  value={formData.accountType}
                  onChange={(e) => handleInputChange('accountType', e.target.value)}
                  label="Account Type"
                >
                  <MenuItem value="residential">Residential</MenuItem>
                  <MenuItem value="commercial">Commercial</MenuItem>
                  <MenuItem value="industrial">Industrial</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Customer Name"
                value={formData.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                error={!!errors.customerName}
                helperText={errors.customerName}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                error={!!errors.phone}
                helperText={errors.phone}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Business Type</InputLabel>
                <Select
                  value={formData.businessType}
                  onChange={(e) => handleInputChange('businessType', e.target.value)}
                  label="Business Type"
                >
                  <MenuItem value="soleProprietorship">Sole Proprietorship</MenuItem>
                  <MenuItem value="partnership">Partnership</MenuItem>
                  <MenuItem value="corporation">Corporation</MenuItem>
                  <MenuItem value="llc">LLC</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tax ID"
                value={formData.taxId}
                onChange={(e) => handleInputChange('taxId', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Annual Usage"
                value={formData.annualUsage}
                onChange={(e) => handleInputChange('annualUsage', e.target.value)}
                error={!!errors.annualUsage}
                helperText={errors.annualUsage}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Current Provider"
                value={formData.currentProvider}
                onChange={(e) => handleInputChange('currentProvider', e.target.value)}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Commission Rate"
                value={formData.commissionRate}
                onChange={(e) => handleInputChange('commissionRate', e.target.value)}
                error={!!errors.commissionRate}
                helperText={errors.commissionRate}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Commission Type</InputLabel>
                <Select
                  value={formData.commissionType}
                  onChange={(e) => handleInputChange('commissionType', e.target.value)}
                  label="Commission Type"
                >
                  <MenuItem value="percentage">Percentage</MenuItem>
                  <MenuItem value="fixed">Fixed Amount</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Payment Terms"
                value={formData.paymentTerms}
                onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Manager Assigned</InputLabel>
                <Select
                  value={formData.managerAssigned}
                  onChange={(e) => handleInputChange('managerAssigned', e.target.value)}
                  label="Manager Assigned"
                >
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Review Your Entry</Typography>
              <Typography variant="body1" gutterBottom>Account Details:</Typography>
              <Typography variant="body2">Account Name: {formData.accountName}</Typography>
              <Typography variant="body2">Account Type: {formData.accountType}</Typography>
              <Typography variant="body2">Customer Name: {formData.customerName}</Typography>
              <Typography variant="body2">Email: {formData.email}</Typography>
              <Typography variant="body2">Phone: {formData.phone}</Typography>
              <Typography variant="body2">Address: {formData.address}</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1" gutterBottom>Business Information:</Typography>
              <Typography variant="body2">Business Type: {formData.businessType}</Typography>
              <Typography variant="body2">Tax ID: {formData.taxId}</Typography>
              <Typography variant="body2">Annual Usage: {formData.annualUsage}</Typography>
              <Typography variant="body2">Current Provider: {formData.currentProvider}</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1" gutterBottom>Commission Setup:</Typography>
              <Typography variant="body2">Commission Rate: {formData.commissionRate}</Typography>
              <Typography variant="body2">Commission Type: {formData.commissionType}</Typography>
              <Typography variant="body2">Payment Terms: {formData.paymentTerms}</Typography>
              <Typography variant="body2">Manager Assigned: {formData.managerAssigned}</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1" gutterBottom>Additional Options:</Typography>
              <Typography variant="body2">Auto Renewal: {formData.autoRenewal ? 'Yes' : 'No'}</Typography>
              <Typography variant="body2">Email Notifications: {formData.emailNotifications ? 'Yes' : 'No'}</Typography>
              <Typography variant="body2">SMS Notifications: {formData.smsNotifications ? 'Yes' : 'No'}</Typography>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {type === 'account' ? 'New Account' : 'New Entry'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((step) => (
            <Step key={step.label}>
              <StepLabel icon={step.icon}>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {renderStepContent(activeStep)}
      </DialogContent>
      
      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Button 
          onClick={onClose}
          color="inherit"
        >
          Cancel
        </Button>
        <Box>
          {activeStep > 0 && (
            <Button 
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
          )}
          {activeStep < steps.length - 1 ? (
            <Button 
              onClick={handleNext}
              variant="contained"
            >
              Next
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              variant="contained"
              color="primary"
            >
              Submit
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default DataEntryModal; 
