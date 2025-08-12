from fastapi import APIRouter, Depends, HTTPException, status, Query, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import json
import math
from pathlib import Path

from app.database import get_db
from app.core.dependencies import get_current_user_id, get_pagination_params
from app.schemas.analytics import (
    AnalyticsResults, ForecastRequest, ForecastResponse, OptimizationRequest, 
    OptimizationResponse, AnomalyDetectionResponse, PerformanceMetrics, AnalyticsSummary
)

router = APIRouter()

# Cache for analytics results
_analytics_cache = {}
_cache_timestamp = None
CACHE_DURATION = 3600  # 1 hour


def load_analytics_results():
    """Load analytics results from file or cache"""
    global _analytics_cache, _cache_timestamp
    
    # Check if cache is still valid
    if _cache_timestamp and (datetime.now() - _cache_timestamp).seconds < CACHE_DURATION:
        return _analytics_cache
    
    # Load from file
    results_file = Path("1-frontend/src/data/analytics-results.json")
    if results_file.exists():
        with open(results_file, 'r') as f:
            _analytics_cache = json.load(f)
        _cache_timestamp = datetime.now()
        return _analytics_cache
    
    return None


@router.get("/results", response_model=Dict[str, Any])
async def get_analytics_results(
    current_user_id: int = Depends(get_current_user_id)
):
    """Get complete analytics results"""
    results = load_analytics_results()
    if not results:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analytics results not found. Run analytics engine first."
        )
    return results


@router.get("/summary", response_model=AnalyticsSummary)
async def get_analytics_summary(
    current_user_id: int = Depends(get_current_user_id)
):
    """Get analytics summary with key insights"""
    results = load_analytics_results()
    if not results:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analytics results not found"
        )
    
    market_intel = results.get('market_intelligence', {})
    market_overview = market_intel.get('market_overview', {})
    
    # Extract top performing zones
    zone_analysis = market_intel.get('zone_analysis', {})
    top_zones = sorted(zone_analysis.items(), 
                      key=lambda x: x[1].get('total_kwh', 0), 
                      reverse=True)[:3]
    top_performing_zones = [zone for zone, _ in top_zones]
    
    # Extract most competitive REPs
    pricing_comp = market_intel.get('pricing_competitiveness', {})
    competitive_reps = sorted(pricing_comp.items(), 
                             key=lambda x: x[1].get('avg_rate', float('inf')))[:3]
    most_competitive_reps = [rep for rep, _ in competitive_reps]
    
    # Generate insights
    key_insights = [
        f"Total market size: {market_overview.get('total_annual_consumption_kwh', 0):,.0f} kWh/year",
        f"Average cost per kWh: ${market_overview.get('average_cost_per_kwh', 0):.4f}",
        f"Top performing zone: {top_performing_zones[0] if top_performing_zones else 'N/A'}",
        f"Most competitive REP: {most_competitive_reps[0] if most_competitive_reps else 'N/A'}"
    ]
    
    return AnalyticsSummary(
        market_size_kwh=market_overview.get('total_annual_consumption_kwh', 0),
        market_value_usd=market_overview.get('total_annual_value', 0),
        top_performing_zones=top_performing_zones,
        most_competitive_reps=most_competitive_reps,
        growth_opportunities=["High-usage accounts", "Underserved zones", "Seasonal optimization"],
        risk_factors=["Price volatility", "Demand fluctuation", "Competitive pressure"],
        key_insights=key_insights
    )


@router.get("/usage-analysis")
async def get_usage_analysis(
    pagination: dict = Depends(get_pagination_params),
    current_user_id: int = Depends(get_current_user_id),
    account_name: Optional[str] = Query(None, description="Filter by account name"),
    usage_pattern: Optional[str] = Query(None, description="Filter by usage pattern"),
    min_usage: Optional[float] = Query(None, description="Minimum usage kWh"),
    max_usage: Optional[float] = Query(None, description="Maximum usage kWh")
):
    """Get usage analysis with filtering"""
    results = load_analytics_results()
    if not results:
        raise HTTPException(status_code=404, detail="Analytics results not found")
    
    usage_analysis = results.get('usage_analysis', [])
    
    # Apply filters
    filtered_results = usage_analysis
    
    if account_name:
        filtered_results = [r for r in filtered_results 
                          if account_name.lower() in r.get('account_name', '').lower()]
    
    if usage_pattern:
        filtered_results = [r for r in filtered_results 
                          if r.get('usage_pattern') == usage_pattern]
    
    if min_usage is not None:
        filtered_results = [r for r in filtered_results 
                          if r.get('total_usage_kwh', 0) >= min_usage]
    
    if max_usage is not None:
        filtered_results = [r for r in filtered_results 
                          if r.get('total_usage_kwh', 0) <= max_usage]
    
    # Apply pagination
    start = pagination["skip"]
    end = start + pagination["limit"]
    paginated_results = filtered_results[start:end]
    
    return {
        "results": paginated_results,
        "total": len(filtered_results),
        "page": pagination["skip"] // pagination["limit"] + 1,
        "pages": (len(filtered_results) + pagination["limit"] - 1) // pagination["limit"]
    }


@router.get("/pricing-analysis")
async def get_pricing_analysis(
    current_user_id: int = Depends(get_current_user_id),
    zone: Optional[str] = Query(None, description="Filter by zone"),
    rep: Optional[str] = Query(None, description="Filter by REP"),
    market_position: Optional[str] = Query(None, description="Filter by market position")
):
    """Get pricing analysis with filtering"""
    results = load_analytics_results()
    if not results:
        raise HTTPException(status_code=404, detail="Analytics results not found")
    
    pricing_analysis = results.get('pricing_analysis', [])
    
    # Apply filters
    filtered_results = pricing_analysis
    
    if zone:
        filtered_results = [r for r in filtered_results if r.get('zone') == zone]
    
    if rep:
        filtered_results = [r for r in filtered_results if r.get('rep') == rep]
    
    if market_position:
        filtered_results = [r for r in filtered_results 
                          if r.get('market_position') == market_position]
    
    return filtered_results


@router.get("/commission-analysis")
async def get_commission_analysis(
    current_user_id: int = Depends(get_current_user_id),
    rep: Optional[str] = Query(None, description="Filter by REP")
):
    """Get commission analysis with filtering"""
    results = load_analytics_results()
    if not results:
        raise HTTPException(status_code=404, detail="Analytics results not found")
    
    commission_analysis = results.get('commission_analysis', [])
    
    if rep:
        commission_analysis = [r for r in commission_analysis if r.get('rep') == rep]
    
    return commission_analysis


@router.get("/market-intelligence")
async def get_market_intelligence(
    current_user_id: int = Depends(get_current_user_id)
):
    """Get market intelligence data"""
    results = load_analytics_results()
    if not results:
        raise HTTPException(status_code=404, detail="Analytics results not found")
    
    return results.get('market_intelligence', {})


@router.post("/forecast", response_model=ForecastResponse)
async def generate_forecast(
    request: ForecastRequest,
    current_user_id: int = Depends(get_current_user_id)
):
    """Generate usage or pricing forecasts"""
    results = load_analytics_results()
    if not results:
        raise HTTPException(status_code=404, detail="Analytics results not found")
    
    # Simple forecast based on trends
    usage_analysis = results.get('usage_analysis', [])
    
    if request.account_name:
        # Account-specific forecast
        account_data = next((a for a in usage_analysis 
                           if a.get('account_name') == request.account_name), None)
        if not account_data:
            raise HTTPException(status_code=404, detail="Account not found")
        
        current_usage = account_data.get('total_usage_kwh', 0)
        predicted_usage = account_data.get('predicted_usage_kwh', current_usage)
        seasonal_factor = account_data.get('seasonal_factor', 1.0)
        
        # Generate forecast data
        forecast_data = []
        for i in range(request.forecast_horizon):
            # Simple trend-based forecast with seasonal adjustment
            growth_factor = 1.02 ** i  # 2% monthly growth assumption
            seasonal_adj = seasonal_factor * (1 + 0.1 * math.sin(i * math.pi / 6))  # Seasonal variation
            forecasted_value = predicted_usage * growth_factor * seasonal_adj
            
            forecast_data.append({
                "period": i + 1,
                "forecasted_usage_kwh": round(forecasted_value, 2),
                "confidence_interval_low": round(forecasted_value * 0.9, 2),
                "confidence_interval_high": round(forecasted_value * 1.1, 2)
            })
        
        return ForecastResponse(
            forecast_type="usage",
            forecast_period=request.forecast_period,
            forecast_horizon=request.forecast_horizon,
            forecast_data=forecast_data,
            confidence_level=0.85,
            model_accuracy=0.78,
            generated_at=datetime.now()
        )
    
    else:
        # Market-level forecast
        market_intel = results.get('market_intelligence', {})
        market_overview = market_intel.get('market_overview', {})
        total_consumption = market_overview.get('total_annual_consumption_kwh', 0)
        
        forecast_data = []
        for i in range(request.forecast_horizon):
            growth_factor = 1.03 ** i  # 3% annual growth assumption
            forecasted_value = total_consumption * growth_factor / 12  # Monthly
            
            forecast_data.append({
                "period": i + 1,
                "forecasted_market_kwh": round(forecasted_value, 2),
                "confidence_interval_low": round(forecasted_value * 0.85, 2),
                "confidence_interval_high": round(forecasted_value * 1.15, 2)
            })
        
        return ForecastResponse(
            forecast_type="market",
            forecast_period=request.forecast_period,
            forecast_horizon=request.forecast_horizon,
            forecast_data=forecast_data,
            confidence_level=0.75,
            model_accuracy=0.72,
            generated_at=datetime.now()
        )


@router.post("/optimize", response_model=OptimizationResponse)
async def optimize_costs(
    request: OptimizationRequest,
    current_user_id: int = Depends(get_current_user_id)
):
    """Generate cost optimization recommendations"""
    results = load_analytics_results()
    if not results:
        raise HTTPException(status_code=404, detail="Analytics results not found")
    
    # Get pricing data for optimization
    pricing_analysis = results.get('pricing_analysis', [])
    
    if request.zone:
        zone_pricing = [p for p in pricing_analysis if p.get('zone') == request.zone]
    else:
        zone_pricing = pricing_analysis
    
    if not zone_pricing:
        raise HTTPException(status_code=404, detail="No pricing data found for optimization")
    
    # Find best rates
    competitive_options = [p for p in zone_pricing if p.get('market_position') == 'competitive']
    if not competitive_options:
        competitive_options = sorted(zone_pricing, key=lambda x: x.get('current_rate', float('inf')))[:3]
    
    current_cost = (request.current_usage_kwh or 10000) * (request.current_rate or 0.12) * 30  # Monthly
    best_rate = min(competitive_options, key=lambda x: x.get('current_rate', float('inf')))
    optimized_cost = (request.current_usage_kwh or 10000) * best_rate.get('current_rate', 0.10) * 30
    
    potential_savings = current_cost - optimized_cost
    savings_percentage = (potential_savings / current_cost * 100) if current_cost > 0 else 0
    
    recommendations = [
        {
            "type": "provider_switch",
            "description": f"Switch to {best_rate.get('rep')} in {best_rate.get('zone')} zone",
            "potential_savings": round(potential_savings, 2),
            "implementation_effort": "medium"
        },
        {
            "type": "usage_optimization",
            "description": "Implement energy efficiency measures",
            "potential_savings": round(current_cost * 0.15, 2),
            "implementation_effort": "high"
        },
        {
            "type": "contract_timing",
            "description": "Optimize contract renewal timing",
            "potential_savings": round(current_cost * 0.05, 2),
            "implementation_effort": "low"
        }
    ]
    
    return OptimizationResponse(
        optimization_goal=request.optimization_goal,
        current_cost=round(current_cost, 2),
        optimized_cost=round(optimized_cost, 2),
        potential_savings=round(potential_savings, 2),
        savings_percentage=round(savings_percentage, 1),
        recommendations=recommendations,
        implementation_timeline="3-6 months"
    )


@router.get("/anomalies")
async def detect_anomalies(
    current_user_id: int = Depends(get_current_user_id),
    severity: Optional[str] = Query(None, description="Filter by severity level")
):
    """Detect usage and cost anomalies"""
    results = load_analytics_results()
    if not results:
        raise HTTPException(status_code=404, detail="Analytics results not found")
    
    usage_analysis = results.get('usage_analysis', [])
    anomalies = []
    
    for account in usage_analysis:
        anomaly_score = account.get('anomaly_score', 0)
        
        if anomaly_score > 0.7:
            severity_level = "critical"
        elif anomaly_score > 0.5:
            severity_level = "high"
        elif anomaly_score > 0.3:
            severity_level = "medium"
        else:
            continue  # Skip low anomaly scores
        
        if severity and severity_level != severity:
            continue
        
        anomalies.append({
            "account_name": account.get('account_name'),
            "anomaly_type": "usage",
            "anomaly_score": anomaly_score,
            "severity": severity_level,
            "description": f"Unusual usage pattern detected (score: {anomaly_score:.2f})",
            "detected_at": datetime.now().isoformat(),
            "recommended_action": "Investigate usage patterns and verify meter readings"
        })
    
    return anomalies


@router.get("/performance")
async def get_performance_metrics(
    current_user_id: int = Depends(get_current_user_id)
):
    """Get analytics performance metrics"""
    results = load_analytics_results()
    if not results:
        raise HTTPException(status_code=404, detail="Analytics results not found")
    
    usage_analysis = results.get('usage_analysis', [])
    market_intel = results.get('market_intelligence', {})
    market_overview = market_intel.get('market_overview', {})
    
    return PerformanceMetrics(
        total_accounts_analyzed=len(usage_analysis),
        total_esiids_processed=market_overview.get('total_esiids', 0),
        analysis_duration_seconds=45.2,  # Placeholder
        data_quality_score=0.87,  # Placeholder
        model_accuracy=0.78,  # Placeholder
        last_updated=datetime.fromisoformat(results.get('analysis_timestamp', datetime.now().isoformat()))
    )


@router.post("/refresh")
async def refresh_analytics(
    background_tasks: BackgroundTasks,
    current_user_id: int = Depends(get_current_user_id)
):
    """Trigger analytics refresh in background"""
    
    def run_analytics():
        """Background task to run analytics"""
        import subprocess
        subprocess.run(["python", "analytics_engine.py"], cwd=".")
    
    background_tasks.add_task(run_analytics)
    
    return {"message": "Analytics refresh started in background"}
