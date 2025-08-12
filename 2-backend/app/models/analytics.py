from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey, Text, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class UsageAnalytics(Base):
    __tablename__ = "usage_analytics"

    id = Column(Integer, primary_key=True, index=True)
    
    # Reference information
    account_name = Column(String, index=True)
    esiid_id = Column(String, index=True)
    zone = Column(String, index=True)
    rep = Column(String, index=True)
    load_profile = Column(String, index=True)
    
    # Usage metrics
    current_usage_kwh = Column(Float)  # Current monthly usage
    predicted_usage_kwh = Column(Float)  # Predicted next month usage
    usage_trend = Column(String)  # 'increasing', 'decreasing', 'stable'
    seasonal_factor = Column(Float)  # Seasonal adjustment factor
    
    # Analytics results
    usage_pattern = Column(String)  # 'high', 'medium', 'low', 'variable'
    efficiency_score = Column(Float)  # Energy efficiency rating (0-100)
    cost_optimization_potential = Column(Float)  # Potential savings percentage
    anomaly_score = Column(Float)  # Anomaly detection score (0-1)
    
    # Forecasting data
    forecast_period = Column(String)  # 'monthly', 'quarterly', 'annual'
    forecast_confidence = Column(Float)  # Confidence level (0-1)
    forecast_data = Column(JSON)  # Detailed forecast results
    
    # Analysis metadata
    analysis_date = Column(DateTime, index=True)
    model_version = Column(String)
    data_quality_score = Column(Float)
    
    # System fields
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class PricingAnalytics(Base):
    __tablename__ = "pricing_analytics"

    id = Column(Integer, primary_key=True, index=True)
    
    # Reference information
    zone = Column(String, index=True)
    rep = Column(String, index=True)
    load_profile = Column(String, index=True)
    
    # Current pricing
    current_rate = Column(Float)  # Current daily rate
    predicted_rate = Column(Float)  # Predicted future rate
    rate_trend = Column(String)  # 'increasing', 'decreasing', 'stable'
    
    # Market analysis
    market_position = Column(String)  # 'competitive', 'average', 'expensive'
    price_volatility = Column(Float)  # Price volatility score (0-1)
    seasonal_adjustment = Column(Float)  # Seasonal price factor
    
    # Optimization insights
    best_contract_term = Column(Integer)  # Recommended contract length (months)
    optimal_switch_timing = Column(String)  # When to switch providers
    potential_savings = Column(Float)  # Potential savings amount
    
    # Forecasting data
    forecast_period = Column(String)  # 'monthly', 'quarterly', 'annual'
    forecast_confidence = Column(Float)  # Confidence level (0-1)
    price_forecast = Column(JSON)  # Detailed price forecasts
    
    # Analysis metadata
    analysis_date = Column(DateTime, index=True)
    model_version = Column(String)
    data_quality_score = Column(Float)
    
    # System fields
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class CommissionAnalytics(Base):
    __tablename__ = "commission_analytics"

    id = Column(Integer, primary_key=True, index=True)
    
    # Reference information
    rep = Column(String, index=True)
    account_name = Column(String, index=True)
    commission_type = Column(String, index=True)
    
    # Current performance
    current_monthly_commission = Column(Float)
    predicted_monthly_commission = Column(Float)
    commission_trend = Column(String)  # 'increasing', 'decreasing', 'stable'
    
    # Performance metrics
    conversion_rate = Column(Float)  # Success rate (0-1)
    average_commission_value = Column(Float)
    commission_growth_rate = Column(Float)  # Monthly growth rate
    
    # Opportunity analysis
    high_value_opportunities = Column(JSON)  # List of high-value prospects
    optimal_sales_timing = Column(JSON)  # Best times for sales activities
    market_share_potential = Column(Float)  # Potential market share
    
    # Forecasting data
    forecast_period = Column(String)  # 'monthly', 'quarterly', 'annual'
    forecast_confidence = Column(Float)  # Confidence level (0-1)
    commission_forecast = Column(JSON)  # Detailed commission forecasts
    
    # Analysis metadata
    analysis_date = Column(DateTime, index=True)
    model_version = Column(String)
    data_quality_score = Column(Float)
    
    # System fields
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class MarketIntelligence(Base):
    __tablename__ = "market_intelligence"

    id = Column(Integer, primary_key=True, index=True)
    
    # Market scope
    market_segment = Column(String, index=True)  # 'residential', 'commercial', 'industrial'
    geographic_zone = Column(String, index=True)
    time_period = Column(String, index=True)  # 'monthly', 'quarterly', 'annual'
    
    # Market metrics
    total_market_size = Column(Float)  # Total market size (kWh or $)
    market_growth_rate = Column(Float)  # Growth rate percentage
    competitive_intensity = Column(Float)  # Competition level (0-1)
    
    # Pricing intelligence
    average_market_rate = Column(Float)
    rate_volatility = Column(Float)
    pricing_trends = Column(JSON)  # Detailed pricing trend data
    
    # Competitive analysis
    market_leaders = Column(JSON)  # Top performers by market share
    competitive_positioning = Column(JSON)  # Competitive landscape
    market_opportunities = Column(JSON)  # Identified opportunities
    
    # Forecasting insights
    market_forecast = Column(JSON)  # Market size and growth forecasts
    demand_forecast = Column(JSON)  # Energy demand predictions
    price_forecast = Column(JSON)  # Price trend predictions
    
    # Analysis metadata
    analysis_date = Column(DateTime, index=True)
    model_version = Column(String)
    data_sources = Column(JSON)  # Data sources used
    confidence_level = Column(Float)  # Overall confidence (0-1)
    
    # System fields
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
