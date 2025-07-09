import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  Business,
  Person,
  Bolt,
  AttachMoney,
  Factory,
  CheckCircle,
  Add as AddIcon,
  Remove as RemoveIcon,
  NavigateNext,
  NavigateBefore,
  Save
} from '@mui/icons-material';
import './DataEntryModal.scss';

const DataEntryModal = ({ isOpen, onClose, onSave, onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Account Information
    accountName: '',
    accountType: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    
    // Manager Information
    managerName: '',
    managerEmail: '',
    managerPhone: '',
    managerCompany: '',
    
    // ESIID Information
    esiids: [{ esiid: '', usage: '', rate: '' }],
    
    // Commission Information
    commissionRate: '',
    contractType: '',
    contractStartDate: '',
    contractEndDate: '',
    monthlyCommission: '',
    
    // Provider Information
    providerName: '',
    providerContact: '',
    providerEmail: '',
    providerPhone: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { id: 1, title: 'Account Information', icon: <Business /> },
    { id: 2, title: 'Manager Details', icon: <Person /> },
    { id: 3, title: 'ESIID & Usage', icon: <Bolt /> },
    { id: 4, title: 'Commission Setup', icon: <AttachMoney /> },
    { id: 5, title: 'Provider Details', icon: <Factory /> },
    { id: 6, title: 'Review & Submit', icon: <CheckCircle /> }
  ];

  const accountTypes = [
    'Commercial',
    'Industrial',
    'Retail',
    'Office',
    'Multi-Family',
    'Other'
  ];

  const contractTypes = [
    'Standard',
    'Premium',
    'Custom'
  ];

  const providers = [
    'Reliant Energy',
    'TXU Energy',
    'Direct Energy',
    'Green Mountain Energy',
    'Constellation Energy',
    'Other'
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

  const handleEsiidChange = (index, field, value) => {
    const newEsiids = [...formData.esiids];
    newEsiids[index] = {
      ...newEsiids[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      esiids: newEsiids
    }));
  };

  const addEsiid = () => {
    setFormData(prev => ({
      ...prev,
      esiids: [...prev.esiids, { esiid: '', usage: '', rate: '' }]
    }));
  };

  const removeEsiid = (index) => {
    if (formData.esiids.length > 1) {
      const newEsiids = formData.esiids.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        esiids: newEsiids
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.accountName.trim()) newErrors.accountName = 'Account name is required';
        if (!formData.accountType) newErrors.accountType = 'Account type is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
        break;
      
      case 2:
        if (!formData.managerName.trim()) newErrors.managerName = 'Manager name is required';
        if (!formData.managerEmail.trim()) newErrors.managerEmail = 'Manager email is required';
        break;
      
      case 3:
        formData.esiids.forEach((esiid, index) => {
          if (!esiid.esiid.trim()) newErrors[`esiid_${index}`] = 'ESIID is required';
          if (!esiid.usage.trim()) newErrors[`usage_${index}`] = 'Usage is required';
        });
        break;
      
      case 4:
        if (!formData.commissionRate) newErrors.commissionRate = 'Commission rate is required';
        if (!formData.contractType) newErrors.contractType = 'Contract type is required';
        if (!formData.contractStartDate) newErrors.contractStartDate = 'Contract start date is required';
        if (!formData.contractEndDate) newErrors.contractEndDate = 'Contract end date is required';
        break;
      
      case 5:
        if (!formData.providerName) newErrors.providerName = 'Provider name is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (validateStep(currentStep)) {
      setIsSubmitting(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Submitting data:', formData);
        onSave(formData);
        onClose();
      } catch (error) {
        console.error('Error submitting data:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleClose = () => {
    if (currentStep > 1) {
      if (window.confirm('Are you sure you want to close? All unsaved changes will be lost.')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Box className="data-entry-modal-form-section">
            <Typography variant="h6" className="data-entry-modal-section-title">
              <Business /> Account Information
            </Typography>
            <Grid container spacing={3} className="data-entry-modal-form-grid">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Account Name *"
                  value={formData.accountName}
                  onChange={(e) => handleInputChange('accountName', e.target.value)}
                  error={!!errors.accountName}
                  helperText={errors.accountName}
                  className="data-entry-modal-input"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.accountType}>
                  <InputLabel>Account Type *</InputLabel>
                  <Select
                    value={formData.accountType}
                    onChange={(e) => handleInputChange('accountType', e.target.value)}
                    label="Account Type *"
                  >
                    {accountTypes.map(type => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address *"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  error={!!errors.address}
                  helperText={errors.address}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="City *"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  error={!!errors.city}
                  helperText={errors.city}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="State *"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  error={!!errors.state}
                  helperText={errors.state}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="ZIP Code *"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  error={!!errors.zipCode}
                  helperText={errors.zipCode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box className="data-entry-modal-form-section">
            <Typography variant="h6" className="data-entry-modal-section-title">
              <Person /> Manager Details
            </Typography>
            <Grid container spacing={3} className="data-entry-modal-form-grid">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Manager Name *"
                  value={formData.managerName}
                  onChange={(e) => handleInputChange('managerName', e.target.value)}
                  error={!!errors.managerName}
                  helperText={errors.managerName}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Manager Email *"
                  type="email"
                  value={formData.managerEmail}
                  onChange={(e) => handleInputChange('managerEmail', e.target.value)}
                  error={!!errors.managerEmail}
                  helperText={errors.managerEmail}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Manager Phone"
                  value={formData.managerPhone}
                  onChange={(e) => handleInputChange('managerPhone', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Management Company"
                  value={formData.managerCompany}
                  onChange={(e) => handleInputChange('managerCompany', e.target.value)}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 3:
        return (
          <Box className="data-entry-modal-form-section">
            <Typography variant="h6" className="data-entry-modal-section-title">
              <Bolt /> ESIID & Usage Information
            </Typography>
            <Box className="data-entry-modal-esiid-section">
              {formData.esiids.map((esiid, index) => (
                <Card key={index} className="data-entry-modal-esiid-item">
                  <Box className="data-entry-modal-esiid-header">
                    <Typography variant="h6" className="data-entry-modal-esiid-title">
                      ESIID #{index + 1}
                    </Typography>
                    {formData.esiids.length > 1 && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => removeEsiid(index)}
                        className="data-entry-modal-remove-button"
                        startIcon={<RemoveIcon />}
                      >
                        Remove
                      </Button>
                    )}
                  </Box>
                  <Grid container spacing={2} className="data-entry-modal-esiid-grid">
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="ESIID *"
                        value={esiid.esiid}
                        onChange={(e) => handleEsiidChange(index, 'esiid', e.target.value)}
                        error={!!errors[`esiid_${index}`]}
                        helperText={errors[`esiid_${index}`]}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Usage (kWh) *"
                        value={esiid.usage}
                        onChange={(e) => handleEsiidChange(index, 'usage', e.target.value)}
                        error={!!errors[`usage_${index}`]}
                        helperText={errors[`usage_${index}`]}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Rate"
                        value={esiid.rate}
                        onChange={(e) => handleEsiidChange(index, 'rate', e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </Card>
              ))}
              <Button
                variant="outlined"
                onClick={addEsiid}
                className="data-entry-modal-add-button"
                startIcon={<AddIcon />}
              >
                Add ESIID
              </Button>
            </Box>
          </Box>
        );

      case 4:
        return (
          <Box className="data-entry-modal-form-section">
            <Typography variant="h6" className="data-entry-modal-section-title">
              <AttachMoney /> Commission Setup
            </Typography>
            <Grid container spacing={3} className="data-entry-modal-form-grid">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Commission Rate *"
                  value={formData.commissionRate}
                  onChange={(e) => handleInputChange('commissionRate', e.target.value)}
                  error={!!errors.commissionRate}
                  helperText={errors.commissionRate}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.contractType}>
                  <InputLabel>Contract Type *</InputLabel>
                  <Select
                    value={formData.contractType}
                    onChange={(e) => handleInputChange('contractType', e.target.value)}
                    label="Contract Type *"
                  >
                    {contractTypes.map(type => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Contract Start Date *"
                  type="date"
                  value={formData.contractStartDate}
                  onChange={(e) => handleInputChange('contractStartDate', e.target.value)}
                  error={!!errors.contractStartDate}
                  helperText={errors.contractStartDate}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Contract End Date *"
                  type="date"
                  value={formData.contractEndDate}
                  onChange={(e) => handleInputChange('contractEndDate', e.target.value)}
                  error={!!errors.contractEndDate}
                  helperText={errors.contractEndDate}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Monthly Commission"
                  value={formData.monthlyCommission}
                  onChange={(e) => handleInputChange('monthlyCommission', e.target.value)}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 5:
        return (
          <Box className="data-entry-modal-form-section">
            <Typography variant="h6" className="data-entry-modal-section-title">
              <Factory /> Provider Details
            </Typography>
            <Grid container spacing={3} className="data-entry-modal-form-grid">
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.providerName}>
                  <InputLabel>Provider Name *</InputLabel>
                  <Select
                    value={formData.providerName}
                    onChange={(e) => handleInputChange('providerName', e.target.value)}
                    label="Provider Name *"
                  >
                    {providers.map(provider => (
                      <MenuItem key={provider} value={provider}>{provider}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Provider Contact"
                  value={formData.providerContact}
                  onChange={(e) => handleInputChange('providerContact', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Provider Email"
                  type="email"
                  value={formData.providerEmail}
                  onChange={(e) => handleInputChange('providerEmail', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Provider Phone"
                  value={formData.providerPhone}
                  onChange={(e) => handleInputChange('providerPhone', e.target.value)}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 6:
        return (
          <Box className="data-entry-modal-review-section">
            <Typography variant="h6" className="data-entry-modal-review-title">
              Review & Submit
            </Typography>
            <Grid container spacing={2} className="data-entry-modal-review-grid">
              <Grid item xs={12} md={6}>
                <Card className="data-entry-modal-review-item">
                  <Typography variant="subtitle2" className="data-entry-modal-review-label">
                    Account Name
                  </Typography>
                  <Typography variant="body1" className="data-entry-modal-review-value">
                    {formData.accountName}
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card className="data-entry-modal-review-item">
                  <Typography variant="subtitle2" className="data-entry-modal-review-label">
                    Account Type
                  </Typography>
                  <Typography variant="body1" className="data-entry-modal-review-value">
                    {formData.accountType}
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card className="data-entry-modal-review-item">
                  <Typography variant="subtitle2" className="data-entry-modal-review-label">
                    Manager Name
                  </Typography>
                  <Typography variant="body1" className="data-entry-modal-review-value">
                    {formData.managerName}
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card className="data-entry-modal-review-item">
                  <Typography variant="subtitle2" className="data-entry-modal-review-label">
                    Provider Name
                  </Typography>
                  <Typography variant="body1" className="data-entry-modal-review-value">
                    {formData.providerName}
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      className="data-entry-modal-overlay"
    >
      <Box className="data-entry-modal-container">
        <Box className="data-entry-modal-header">
          <Typography variant="h5" className="data-entry-modal-title">
            Data Entry Form
          </Typography>
          <IconButton
            onClick={handleClose}
            className="data-entry-modal-close-button"
            color="inherit"
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent className="data-entry-modal-content">
          <Stepper activeStep={currentStep - 1} className="data-entry-modal-steps">
            {steps.map((step, index) => (
              <Step key={step.id}>
                <StepLabel
                  icon={step.icon}
                  className={`data-entry-modal-step-title ${
                    currentStep > index + 1 ? 'completed' : 
                    currentStep === index + 1 ? 'active' : ''
                  }`}
                >
                  {step.title}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {isSubmitting ? (
            <Box className="data-entry-modal-loading">
              <CircularProgress className="data-entry-modal-spinner" />
              <Typography variant="h6" style={{ marginLeft: 16 }}>
                Submitting data...
              </Typography>
            </Box>
          ) : (
            renderStepContent()
          )}
        </DialogContent>

        <DialogActions className="data-entry-modal-navigation">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="data-entry-modal-button secondary"
            startIcon={<NavigateBefore />}
          >
            Previous
          </Button>
          
          {currentStep < steps.length ? (
            <Button
              onClick={handleNext}
              variant="contained"
              className="data-entry-modal-button primary"
              endIcon={<NavigateNext />}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={isSubmitting}
              className="data-entry-modal-button primary"
              startIcon={<Save />}
            >
              Submit
            </Button>
          )}
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default DataEntryModal; 