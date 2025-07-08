import React, { useState } from 'react';
import styled from 'styled-components';
import kilowattImage from '../assets/image.png';
import colors from '../assets/colors';

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
    { id: 1, title: 'Account Information', icon: '🏢' },
    { id: 2, title: 'Manager Details', icon: '👤' },
    { id: 3, title: 'ESIID & Usage', icon: '⚡' },
    { id: 4, title: 'Commission Setup', icon: '💰' },
    { id: 5, title: 'Provider Details', icon: '🏭' },
    { id: 6, title: 'Review & Submit', icon: '✅' }
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
          <StepContent>
            <StepTitle>Account Information</StepTitle>
            <FormGrid>
              <FormGroup>
                <Label>Account Name *</Label>
                <Input
                  type="text"
                  value={formData.accountName}
                  onChange={(e) => handleInputChange('accountName', e.target.value)}
                  placeholder="Enter account name"
                  error={errors.accountName}
                />
                {errors.accountName && <ErrorMessage>{errors.accountName}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Account Type *</Label>
                <Select
                  value={formData.accountType}
                  onChange={(e) => handleInputChange('accountType', e.target.value)}
                  error={errors.accountType}
                >
                  <option value="">Select account type</option>
                  {accountTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </Select>
                {errors.accountType && <ErrorMessage>{errors.accountType}</ErrorMessage>}
              </FormGroup>

              <FormGroup fullWidth>
                <Label>Address *</Label>
                <Input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter street address"
                  error={errors.address}
                />
                {errors.address && <ErrorMessage>{errors.address}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>City *</Label>
                <Input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Enter city"
                  error={errors.city}
                />
                {errors.city && <ErrorMessage>{errors.city}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>State *</Label>
                <Input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="Enter state"
                  error={errors.state}
                />
                {errors.state && <ErrorMessage>{errors.state}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>ZIP Code *</Label>
                <Input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  placeholder="Enter ZIP code"
                  error={errors.zipCode}
                />
                {errors.zipCode && <ErrorMessage>{errors.zipCode}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Phone</Label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                />
              </FormGroup>

              <FormGroup>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                />
              </FormGroup>
            </FormGrid>
          </StepContent>
        );

      case 2:
        return (
          <StepContent>
            <StepTitle>Manager Details</StepTitle>
            <FormGrid>
              <FormGroup>
                <Label>Manager Name *</Label>
                <Input
                  type="text"
                  value={formData.managerName}
                  onChange={(e) => handleInputChange('managerName', e.target.value)}
                  placeholder="Enter manager name"
                  error={errors.managerName}
                />
                {errors.managerName && <ErrorMessage>{errors.managerName}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Manager Email *</Label>
                <Input
                  type="email"
                  value={formData.managerEmail}
                  onChange={(e) => handleInputChange('managerEmail', e.target.value)}
                  placeholder="Enter manager email"
                  error={errors.managerEmail}
                />
                {errors.managerEmail && <ErrorMessage>{errors.managerEmail}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Manager Phone</Label>
                <Input
                  type="tel"
                  value={formData.managerPhone}
                  onChange={(e) => handleInputChange('managerPhone', e.target.value)}
                  placeholder="Enter manager phone"
                />
              </FormGroup>

              <FormGroup>
                <Label>Manager Company</Label>
                <Input
                  type="text"
                  value={formData.managerCompany}
                  onChange={(e) => handleInputChange('managerCompany', e.target.value)}
                  placeholder="Enter manager company"
                />
              </FormGroup>
            </FormGrid>
          </StepContent>
        );

      case 3:
        return (
          <StepContent>
            <StepTitle>ESIID & Usage Information</StepTitle>
            <EsiidSection>
              {formData.esiids.map((esiid, index) => (
                <EsiidCard key={index}>
                  <EsiidHeader>
                    <EsiidTitle>ESIID #{index + 1}</EsiidTitle>
                    {formData.esiids.length > 1 && (
                      <RemoveButton onClick={() => removeEsiid(index)}>
                        🗑️ Remove
                      </RemoveButton>
                    )}
                  </EsiidHeader>
                  
                  <FormGrid>
                    <FormGroup>
                      <Label>ESIID *</Label>
                      <Input
                        type="text"
                        value={esiid.esiid}
                        onChange={(e) => handleEsiidChange(index, 'esiid', e.target.value)}
                        placeholder="Enter ESIID"
                        error={errors[`esiid_${index}`]}
                      />
                      {errors[`esiid_${index}`] && <ErrorMessage>{errors[`esiid_${index}`]}</ErrorMessage>}
                    </FormGroup>

                    <FormGroup>
                      <Label>Usage (kWh) *</Label>
                      <Input
                        type="number"
                        value={esiid.usage}
                        onChange={(e) => handleEsiidChange(index, 'usage', e.target.value)}
                        placeholder="Enter usage"
                        error={errors[`usage_${index}`]}
                      />
                      {errors[`usage_${index}`] && <ErrorMessage>{errors[`usage_${index}`]}</ErrorMessage>}
                    </FormGroup>

                    <FormGroup>
                      <Label>Rate ($/kWh)</Label>
                      <Input
                        type="number"
                        step="0.001"
                        value={esiid.rate}
                        onChange={(e) => handleEsiidChange(index, 'rate', e.target.value)}
                        placeholder="Enter rate"
                      />
                    </FormGroup>
                  </FormGrid>
                </EsiidCard>
              ))}
              
              <AddButton onClick={addEsiid}>
                ➕ Add Another ESIID
              </AddButton>
            </EsiidSection>
          </StepContent>
        );

      case 4:
        return (
          <StepContent>
            <StepTitle>Commission Setup</StepTitle>
            <FormGrid>
              <FormGroup>
                <Label>Commission Rate (%) *</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.commissionRate}
                  onChange={(e) => handleInputChange('commissionRate', e.target.value)}
                  placeholder="Enter commission rate"
                  error={errors.commissionRate}
                />
                {errors.commissionRate && <ErrorMessage>{errors.commissionRate}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Contract Type *</Label>
                <Select
                  value={formData.contractType}
                  onChange={(e) => handleInputChange('contractType', e.target.value)}
                  error={errors.contractType}
                >
                  <option value="">Select contract type</option>
                  {contractTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </Select>
                {errors.contractType && <ErrorMessage>{errors.contractType}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Contract Start Date *</Label>
                <Input
                  type="date"
                  value={formData.contractStartDate}
                  onChange={(e) => handleInputChange('contractStartDate', e.target.value)}
                  error={errors.contractStartDate}
                />
                {errors.contractStartDate && <ErrorMessage>{errors.contractStartDate}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Contract End Date *</Label>
                <Input
                  type="date"
                  value={formData.contractEndDate}
                  onChange={(e) => handleInputChange('contractEndDate', e.target.value)}
                  error={errors.contractEndDate}
                />
                {errors.contractEndDate && <ErrorMessage>{errors.contractEndDate}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Monthly Commission ($)</Label>
                <Input
                  type="number"
                  value={formData.monthlyCommission}
                  onChange={(e) => handleInputChange('monthlyCommission', e.target.value)}
                  placeholder="Enter monthly commission"
                />
              </FormGroup>
            </FormGrid>
          </StepContent>
        );

      case 5:
        return (
          <StepContent>
            <StepTitle>Provider Details</StepTitle>
            <FormGrid>
              <FormGroup>
                <Label>Provider Name *</Label>
                <Select
                  value={formData.providerName}
                  onChange={(e) => handleInputChange('providerName', e.target.value)}
                  error={errors.providerName}
                >
                  <option value="">Select provider</option>
                  {providers.map(provider => (
                    <option key={provider} value={provider}>{provider}</option>
                  ))}
                </Select>
                {errors.providerName && <ErrorMessage>{errors.providerName}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Provider Contact</Label>
                <Input
                  type="text"
                  value={formData.providerContact}
                  onChange={(e) => handleInputChange('providerContact', e.target.value)}
                  placeholder="Enter provider contact name"
                />
              </FormGroup>

              <FormGroup>
                <Label>Provider Email</Label>
                <Input
                  type="email"
                  value={formData.providerEmail}
                  onChange={(e) => handleInputChange('providerEmail', e.target.value)}
                  placeholder="Enter provider email"
                />
              </FormGroup>

              <FormGroup>
                <Label>Provider Phone</Label>
                <Input
                  type="tel"
                  value={formData.providerPhone}
                  onChange={(e) => handleInputChange('providerPhone', e.target.value)}
                  placeholder="Enter provider phone"
                />
              </FormGroup>
            </FormGrid>
          </StepContent>
        );

      case 6:
        return (
          <StepContent>
            <StepTitle>Review & Submit</StepTitle>
            <ReviewSection>
              <ReviewCard>
                <ReviewTitle>Account Information</ReviewTitle>
                <ReviewItem>
                  <ReviewLabel>Account Name:</ReviewLabel>
                  <ReviewValue>{formData.accountName}</ReviewValue>
                </ReviewItem>
                <ReviewItem>
                  <ReviewLabel>Account Type:</ReviewLabel>
                  <ReviewValue>{formData.accountType}</ReviewValue>
                </ReviewItem>
                <ReviewItem>
                  <ReviewLabel>Address:</ReviewLabel>
                  <ReviewValue>{formData.address}, {formData.city}, {formData.state} {formData.zipCode}</ReviewValue>
                </ReviewItem>
              </ReviewCard>

              <ReviewCard>
                <ReviewTitle>Manager Details</ReviewTitle>
                <ReviewItem>
                  <ReviewLabel>Manager Name:</ReviewLabel>
                  <ReviewValue>{formData.managerName}</ReviewValue>
                </ReviewItem>
                <ReviewItem>
                  <ReviewLabel>Manager Email:</ReviewLabel>
                  <ReviewValue>{formData.managerEmail}</ReviewValue>
                </ReviewItem>
              </ReviewCard>

              <ReviewCard>
                <ReviewTitle>ESIID Information</ReviewTitle>
                {formData.esiids.map((esiid, index) => (
                  <ReviewItem key={index}>
                    <ReviewLabel>ESIID #{index + 1}:</ReviewLabel>
                    <ReviewValue>{esiid.esiid} - {esiid.usage} kWh</ReviewValue>
                  </ReviewItem>
                ))}
              </ReviewCard>

              <ReviewCard>
                <ReviewTitle>Commission Setup</ReviewTitle>
                <ReviewItem>
                  <ReviewLabel>Commission Rate:</ReviewLabel>
                  <ReviewValue>{formData.commissionRate}%</ReviewValue>
                </ReviewItem>
                <ReviewItem>
                  <ReviewLabel>Contract Type:</ReviewLabel>
                  <ReviewValue>{formData.contractType}</ReviewValue>
                </ReviewItem>
                <ReviewItem>
                  <ReviewLabel>Contract Period:</ReviewLabel>
                  <ReviewValue>{formData.contractStartDate} to {formData.contractEndDate}</ReviewValue>
                </ReviewItem>
              </ReviewCard>

              <ReviewCard>
                <ReviewTitle>Provider Details</ReviewTitle>
                <ReviewItem>
                  <ReviewLabel>Provider:</ReviewLabel>
                  <ReviewValue>{formData.providerName}</ReviewValue>
                </ReviewItem>
              </ReviewCard>
            </ReviewSection>
          </StepContent>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>
          <HeaderLeft>
            <LogoSection>
              <LogoImage src={kilowattImage} alt="Kilowatt" />
              <LogoText>Kilowatt</LogoText>
            </LogoSection>
            <ModalTitle>New Account & Commission Entry</ModalTitle>
          </HeaderLeft>
          <CloseButton onClick={handleClose}>✕</CloseButton>
        </ModalHeader>

        <StepIndicator>
          {steps.map((step, index) => (
            <StepItem key={step.id} active={currentStep >= step.id} completed={currentStep > step.id}>
              <StepIcon>{step.icon}</StepIcon>
              <StepLabel>{step.title}</StepLabel>
              {index < steps.length - 1 && <StepConnector />}
            </StepItem>
          ))}
        </StepIndicator>

        <ModalContent>
          {renderStepContent()}
        </ModalContent>

        <ModalFooter>
          <FooterLeft>
            <StepInfo>
              Step {currentStep} of {steps.length}
            </StepInfo>
          </FooterLeft>
          
          <FooterRight>
            {currentStep > 1 && (
              <Button secondary onClick={handlePrevious}>
                ← Previous
              </Button>
            )}
            
            {currentStep < steps.length ? (
              <Button primary onClick={handleNext}>
                Next →
              </Button>
            ) : (
              <Button primary onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Account'}
              </Button>
            )}
          </FooterRight>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(200,40,40,0.7);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContainer = styled.div`
  background: ${colors.background};
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.10);
  padding: 40px;
  max-width: 600px;
  width: 100%;
  color: ${colors.text};
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: ${colors.primary};
  text-align: center;
  margin-bottom: 24px;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LogoImage = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 6px;
`;

const LogoText = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  color: #64748b;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
    color: #1e293b;
  }
`;

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 32px;
  background: rgba(248, 250, 252, 0.8);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  overflow-x: auto;
`;

const StepItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  flex-shrink: 0;
`;

const StepIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.active || props.completed ? '#3b82f6' : '#e2e8f0'};
  color: ${props => props.active || props.completed ? 'white' : '#64748b'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
`;

const StepLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.active || props.completed ? '#1e293b' : '#64748b'};
  white-space: nowrap;
`;

const StepConnector = styled.div`
  width: 40px;
  height: 2px;
  background: #e2e8f0;
  margin: 0 8px;
`;

const ModalContent = styled.div`
  background: ${colors.background};
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.10);
  padding: 40px;
  max-width: 600px;
  width: 100%;
  color: ${colors.text};
  font-size: 1.25rem;
`;

const StepContent = styled.div``;

const StepTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 24px 0;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  grid-column: ${props => props.fullWidth ? '1 / -1' : 'auto'};
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid ${props => props.error ? '#ef4444' : '#d1d5db'};
  border-radius: 8px;
  font-size: 14px;
  background: white;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 1px solid ${props => props.error ? '#ef4444' : '#d1d5db'};
  border-radius: 8px;
  font-size: 14px;
  background: white;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ErrorMessage = styled.span`
  font-size: 12px;
  color: #ef4444;
  margin-top: 4px;
`;

const EsiidSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const EsiidCard = styled.div`
  background: rgba(248, 250, 252, 0.8);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
`;

const EsiidHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const EsiidTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
`;

const RemoveButton = styled.button`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #ef4444;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(239, 68, 68, 0.2);
  }
`;

const AddButton = styled.button`
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  width: fit-content;

  &:hover {
    background: rgba(59, 130, 246, 0.2);
  }
`;

const ReviewSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ReviewCard = styled.div`
  background: rgba(248, 250, 252, 0.8);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
`;

const ReviewTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 16px 0;
`;

const ReviewItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }
`;

const ReviewLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
`;

const ReviewValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.9);
`;

const FooterLeft = styled.div``;

const FooterRight = styled.div`
  display: flex;
  gap: 12px;
`;

const StepInfo = styled.span`
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  ${props => props.primary && `
    background: #3b82f6;
    color: white;

    &:hover:not(:disabled) {
      background: #2563eb;
      transform: translateY(-1px);
    }

    &:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }
  `}

  ${props => props.secondary && `
    background: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
    border: 1px solid rgba(59, 130, 246, 0.2);

    &:hover {
      background: rgba(59, 130, 246, 0.2);
    }
  `}
`;

export default DataEntryModal; 