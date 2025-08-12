from pydantic import BaseModel
from typing import Optional, Dict, List, Any
from datetime import datetime


class UsageAnalyticsResponse(BaseModel):
    account_name: str
    esiid_count: int
    total_usage_kwh: float
    avg_usage_kwh: float
    predicted_usage_kwh: float
    usage_pattern: str
    efficiency_score: float
    anomaly_score: float
    seasonal_factor: float
    cost_per_kwh: float
    total_monthly_bill: float


class PricingAnalyticsResponse(BaseModel):
    zone: str
    rep: str
    current_rate: float
    avg_rate: float
    predicted_rate: float
    rate_trend: str
    market_position: str
    volatility: float
    percentile_rank: float
    data_points: int


class CommissionAnalyticsResponse(BaseModel):
    rep: str
    total_commission: float
    avg_commission: float
    commission_count: int
    predicted_monthly_commission: float
    commission_trend: str
    monthly_performance: Dict[str, float]


class MarketOverview(BaseModel):
    total_annual_consumption_kwh: float
    total_annual_value: float
    average_cost_per_kwh: float
    total_accounts: int
    total_esiids: int


class ZoneAnalysis(BaseModel):
    total_kwh: float
    avg_kwh: float
    esiid_count: int
    total_bill: float


class RepMarketShare(BaseModel):
    total_kwh: float
    total_bill: float


class PricingCompetitiveness(BaseModel):
    avg_rate: float
    min_rate: float
    max_rate: float


class MarketIntelligenceResponse(BaseModel):
    market_overview: MarketOverview
    zone_analysis: Dict[str, ZoneAnalysis]
    rep_market_share: Dict[str, RepMarketShare]
    pricing_competitiveness: Dict[str, PricingCompetitiveness]
    analysis_date: str


class AnalyticsResults(BaseModel):
    usage_analysis: List[UsageAnalyticsResponse]
    pricing_analysis: List[PricingAnalyticsResponse]
    commission_analysis: List[CommissionAnalyticsResponse]
    market_intelligence: MarketIntelligenceResponse
    analysis_timestamp: str


class ForecastRequest(BaseModel):
    account_name: Optional[str] = None
    zone: Optional[str] = None
    rep: Optional[str] = None
    forecast_period: str = "monthly"  # monthly, quarterly, annual
    forecast_horizon: int = 12  # number of periods to forecast


class ForecastResponse(BaseModel):
    forecast_type: str
    forecast_period: str
    forecast_horizon: int
    forecast_data: List[Dict[str, Any]]
    confidence_level: float
    model_accuracy: float
    generated_at: datetime


class OptimizationRequest(BaseModel):
    account_name: Optional[str] = None
    current_usage_kwh: Optional[float] = None
    current_rate: Optional[float] = None
    zone: Optional[str] = None
    optimization_goal: str = "cost"  # cost, efficiency, sustainability


class OptimizationResponse(BaseModel):
    optimization_goal: str
    current_cost: float
    optimized_cost: float
    potential_savings: float
    savings_percentage: float
    recommendations: List[Dict[str, Any]]
    implementation_timeline: str


class AnomalyDetectionResponse(BaseModel):
    account_name: str
    anomaly_type: str  # usage, cost, pattern
    anomaly_score: float
    severity: str  # low, medium, high, critical
    description: str
    detected_at: datetime
    recommended_action: str


class PerformanceMetrics(BaseModel):
    total_accounts_analyzed: int
    total_esiids_processed: int
    analysis_duration_seconds: float
    data_quality_score: float
    model_accuracy: float
    last_updated: datetime


class AnalyticsSummary(BaseModel):
    market_size_kwh: float
    market_value_usd: float
    top_performing_zones: List[str]
    most_competitive_reps: List[str]
    growth_opportunities: List[str]
    risk_factors: List[str]
    key_insights: List[str]
