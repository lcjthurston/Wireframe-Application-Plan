import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Analytics as AnalyticsIcon,
  Speed as SpeedIcon,
  Insights as InsightsIcon,
  PredictiveText as ForecastIcon,
  Optimize as OptimizeIcon,
  Warning as WarningIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import NavBar from '../shared/NavBar';

const AnalyticsDashboard = ({ onLogout, onNavigate }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load analytics data
  useEffect(() => {
    const loadAnalyticsData = async () => {
      try {
        setLoading(true);
        
        // Import the analytics results
        const analyticsResults = await import('../../data/analytics-results.json');
        const realAnalytics = analyticsResults.default || analyticsResults;
        
        console.log(`📊 Loaded analytics data with ${realAnalytics.usage_analysis?.length || 0} usage analyses`);
        setAnalyticsData(realAnalytics);
        setError(null);
      } catch (error) {
        console.error('❌ Error loading analytics data:', error);
        setError('Failed to load analytics data. Please run the analytics engine first.');
      } finally {
        setLoading(false);
      }
    };
    
    loadAnalyticsData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
        <NavBar 
          onNavigate={onNavigate}
          onProfileMenuOpen={onLogout}
          userProfile={{ name: 'Profile' }}
          currentPage="analytics"
        />
        <Container maxWidth="xl" sx={{ py: 4, textAlign: 'center' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading Analytics Data...
          </Typography>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
        <NavBar 
          onNavigate={onNavigate}
          onProfileMenuOpen={onLogout}
          userProfile={{ name: 'Profile' }}
          currentPage="analytics"
        />
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        </Container>
      </Box>
    );
  }

  const marketIntel = analyticsData?.market_intelligence || {};
  const marketOverview = marketIntel.market_overview || {};
  const usageAnalysis = analyticsData?.usage_analysis || [];
  const pricingAnalysis = analyticsData?.pricing_analysis || [];
  const commissionAnalysis = analyticsData?.commission_analysis || [];

  // Calculate key metrics
  const totalMarketValue = marketOverview.total_annual_value || 0;
  const totalConsumption = marketOverview.total_annual_consumption_kwh || 0;
  const avgCostPerKwh = marketOverview.average_cost_per_kwh || 0;
  const totalAccounts = marketOverview.total_accounts || 0;

  // Top performing accounts
  const topAccounts = usageAnalysis
    .sort((a, b) => b.total_usage_kwh - a.total_usage_kwh)
    .slice(0, 10);

  // Most competitive pricing
  const competitivePricing = pricingAnalysis
    .filter(p => p.market_position === 'competitive')
    .sort((a, b) => a.current_rate - b.current_rate)
    .slice(0, 5);

  // High efficiency accounts
  const efficientAccounts = usageAnalysis
    .filter(a => a.efficiency_score > 80)
    .sort((a, b) => b.efficiency_score - a.efficiency_score)
    .slice(0, 5);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <NavBar 
        onNavigate={onNavigate}
        onProfileMenuOpen={onLogout}
        userProfile={{ name: 'Profile' }}
        currentPage="analytics"
      />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Advanced Analytics
          </Typography>
          <Button
            variant="contained"
            startIcon={<AnalyticsIcon />}
            onClick={() => window.location.reload()}
            size="large"
            sx={{ 
              background: 'linear-gradient(135deg, #C82828 0%, #B71C1C 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #B71C1C 0%, #A01818 100%)'
              }
            }}
          >
            Refresh Analytics
          </Button>
        </Box>

        {/* Key Metrics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <AssessmentIcon sx={{ fontSize: 40, color: '#C82828', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  ${(totalMarketValue / 1000000).toFixed(1)}M
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Annual Market Value
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <SpeedIcon sx={{ fontSize: 40, color: '#4CAF50', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {(totalConsumption / 1000000).toFixed(0)}M
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Annual kWh Consumption
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <TrendingUpIcon sx={{ fontSize: 40, color: '#2196F3', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  ${avgCostPerKwh.toFixed(4)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Average Cost per kWh
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <InsightsIcon sx={{ fontSize: 40, color: '#FF9800', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {totalAccounts.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Accounts Analyzed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Analytics Tabs */}
        <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="analytics tabs">
              <Tab label="Usage Analysis" icon={<SpeedIcon />} />
              <Tab label="Pricing Intelligence" icon={<TrendingUpIcon />} />
              <Tab label="Commission Performance" icon={<AssessmentIcon />} />
              <Tab label="Market Intelligence" icon={<InsightsIcon />} />
            </Tabs>
          </Box>

          <CardContent sx={{ p: 3 }}>
            {/* Usage Analysis Tab */}
            {activeTab === 0 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Top Performing Accounts by Usage
                </Typography>
                <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                  <Table>
                    <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Account Name</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Monthly Usage (kWh)</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Predicted Usage</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Efficiency Score</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Usage Pattern</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>ESIIDs</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {topAccounts.map((account, index) => (
                        <TableRow key={index} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {account.account_name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="primary" fontWeight="medium">
                              {account.total_usage_kwh?.toLocaleString() || 0}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {account.predicted_usage_kwh?.toLocaleString() || 0}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={account.efficiency_score || 0} 
                                sx={{ width: 60, height: 6, borderRadius: 3 }}
                              />
                              <Typography variant="body2">
                                {(account.efficiency_score || 0).toFixed(0)}%
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={account.usage_pattern || 'Unknown'} 
                              size="small"
                              color={
                                account.usage_pattern === 'stable' ? 'success' :
                                account.usage_pattern === 'moderate_variation' ? 'warning' : 'error'
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {account.esiid_count || 0}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {/* Pricing Intelligence Tab */}
            {activeTab === 1 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Most Competitive Pricing Options
                </Typography>
                <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                  <Table>
                    <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Zone</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>REP</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Current Rate</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Predicted Rate</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Market Position</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Trend</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Volatility</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {competitivePricing.map((pricing, index) => (
                        <TableRow key={index} hover>
                          <TableCell>
                            <Chip label={pricing.zone} color="primary" size="small" />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {pricing.rep}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="success.main" fontWeight="medium">
                              ${pricing.current_rate?.toFixed(2) || '0.00'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              ${pricing.predicted_rate?.toFixed(2) || '0.00'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={pricing.market_position} 
                              size="small"
                              color="success"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={pricing.rate_trend} 
                              size="small"
                              color={
                                pricing.rate_trend === 'decreasing' ? 'success' :
                                pricing.rate_trend === 'stable' ? 'info' : 'warning'
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {(pricing.volatility * 100)?.toFixed(1) || '0.0'}%
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {/* Commission Performance Tab */}
            {activeTab === 2 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Commission Performance by REP
                </Typography>
                <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                  <Table>
                    <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>REP</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Total Commission</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Average Commission</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Commission Count</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Predicted Monthly</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Trend</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {commissionAnalysis.map((commission, index) => (
                        <TableRow key={index} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {commission.rep}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="success.main" fontWeight="medium">
                              ${commission.total_commission?.toLocaleString() || '0'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              ${commission.avg_commission?.toFixed(2) || '0.00'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {commission.commission_count || 0}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="primary">
                              ${commission.predicted_monthly_commission?.toFixed(2) || '0.00'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={commission.commission_trend} 
                              size="small"
                              color={
                                commission.commission_trend === 'increasing' ? 'success' :
                                commission.commission_trend === 'stable' ? 'info' : 'warning'
                              }
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {/* Market Intelligence Tab */}
            {activeTab === 3 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Market Intelligence Overview
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ p: 3, borderRadius: 2 }}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        Key Market Metrics
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Total Market Size:</Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {(totalConsumption / 1000000).toFixed(1)}M kWh/year
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Market Value:</Typography>
                          <Typography variant="body2" fontWeight="medium">
                            ${(totalMarketValue / 1000000).toFixed(1)}M/year
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Average Rate:</Typography>
                          <Typography variant="body2" fontWeight="medium">
                            ${avgCostPerKwh.toFixed(4)}/kWh
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Total Accounts:</Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {totalAccounts.toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ p: 3, borderRadius: 2 }}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        Top Efficiency Performers
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {efficientAccounts.slice(0, 5).map((account, index) => (
                          <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {account.account_name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={account.efficiency_score || 0} 
                                sx={{ width: 40, height: 4, borderRadius: 2 }}
                              />
                              <Typography variant="body2" fontWeight="medium">
                                {(account.efficiency_score || 0).toFixed(0)}%
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default AnalyticsDashboard;
