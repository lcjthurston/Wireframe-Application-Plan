from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_
from typing import List, Optional
from datetime import datetime, date
from app.database import get_db
from app.core.dependencies import get_current_user_id, get_pagination_params
from app.models.daily_pricing import DailyPricing
from app.schemas.daily_pricing import (
    DailyPricingCreate, DailyPricingUpdate, DailyPricingResponse, 
    DailyPricingSummary, PricingStats, ZonePricingComparison, RepPricingAnalysis
)

router = APIRouter()


@router.get("/", response_model=List[DailyPricingSummary])
async def get_daily_pricing(
    pagination: dict = Depends(get_pagination_params),
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
    zone: Optional[str] = Query(None, description="Filter by zone"),
    rep: Optional[str] = Query(None, description="Filter by REP/provider"),
    load_profile: Optional[str] = Query(None, description="Filter by load profile"),
    date_from: Optional[str] = Query(None, description="Filter from date (YYYY-MM-DD)"),
    date_to: Optional[str] = Query(None, description="Filter to date (YYYY-MM-DD)"),
    min_rate: Optional[float] = Query(None, description="Minimum daily rate"),
    max_rate: Optional[float] = Query(None, description="Maximum daily rate"),
    active_only: bool = Query(True, description="Show only active pricing")
):
    """Get daily pricing records with filtering options"""
    query = db.query(DailyPricing)
    
    # Apply filters
    if active_only:
        query = query.filter(DailyPricing.is_active == True)
    
    if zone:
        query = query.filter(DailyPricing.zone.ilike(f"%{zone}%"))
    
    if rep:
        query = query.filter(DailyPricing.rep.ilike(f"%{rep}%"))
    
    if load_profile:
        query = query.filter(DailyPricing.load_profile.ilike(f"%{load_profile}%"))
    
    if date_from:
        try:
            from_date = datetime.strptime(date_from, "%Y-%m-%d")
            query = query.filter(DailyPricing.effective_date >= from_date)
        except ValueError:
            pass
    
    if date_to:
        try:
            to_date = datetime.strptime(date_to, "%Y-%m-%d")
            query = query.filter(DailyPricing.effective_date <= to_date)
        except ValueError:
            pass
    
    if min_rate is not None:
        query = query.filter(DailyPricing.daily_rate >= min_rate)
    
    if max_rate is not None:
        query = query.filter(DailyPricing.daily_rate <= max_rate)
    
    # Apply pagination and ordering
    pricing_records = query.order_by(DailyPricing.effective_date.desc()).offset(pagination["skip"]).limit(pagination["limit"]).all()
    return pricing_records


@router.get("/{pricing_id}", response_model=DailyPricingResponse)
async def get_pricing_record(
    pricing_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Get pricing record by ID"""
    pricing = db.query(DailyPricing).filter(DailyPricing.id == pricing_id).first()
    if pricing is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pricing record not found"
        )
    return pricing


@router.get("/stats/overview", response_model=PricingStats)
async def get_pricing_stats(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Get pricing statistics overview"""
    
    # Total pricing records
    total_records = db.query(DailyPricing).filter(DailyPricing.is_active == True).count()
    
    # Unique zones and REPs
    unique_zones = db.query(func.count(func.distinct(DailyPricing.zone))).filter(
        DailyPricing.is_active == True,
        DailyPricing.zone.isnot(None)
    ).scalar()
    
    unique_reps = db.query(func.count(func.distinct(DailyPricing.rep))).filter(
        DailyPricing.is_active == True,
        DailyPricing.rep.isnot(None)
    ).scalar()
    
    # Date range
    date_range = db.query(
        func.min(DailyPricing.effective_date).label('start_date'),
        func.max(DailyPricing.effective_date).label('end_date')
    ).filter(
        DailyPricing.is_active == True,
        DailyPricing.effective_date.isnot(None)
    ).first()
    
    # Rate statistics
    rate_stats = db.query(
        func.avg(DailyPricing.daily_rate).label('avg_rate'),
        func.min(DailyPricing.daily_rate).label('min_rate'),
        func.max(DailyPricing.daily_rate).label('max_rate')
    ).filter(
        DailyPricing.is_active == True,
        DailyPricing.daily_rate.isnot(None)
    ).first()
    
    return PricingStats(
        total_pricing_records=total_records,
        unique_zones=unique_zones or 0,
        unique_reps=unique_reps or 0,
        date_range_start=date_range.start_date if date_range else None,
        date_range_end=date_range.end_date if date_range else None,
        avg_daily_rate=float(rate_stats.avg_rate or 0),
        min_daily_rate=float(rate_stats.min_rate or 0),
        max_daily_rate=float(rate_stats.max_rate or 0)
    )


@router.get("/analysis/zones", response_model=List[ZonePricingComparison])
async def get_zone_pricing_analysis(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Get pricing analysis by zone"""
    
    zone_analysis = db.query(
        DailyPricing.zone,
        func.avg(DailyPricing.daily_rate).label('avg_rate'),
        func.min(DailyPricing.daily_rate).label('min_rate'),
        func.max(DailyPricing.daily_rate).label('max_rate'),
        func.count(DailyPricing.id).label('record_count')
    ).filter(
        DailyPricing.is_active == True,
        DailyPricing.zone.isnot(None),
        DailyPricing.daily_rate.isnot(None)
    ).group_by(DailyPricing.zone).order_by(
        func.avg(DailyPricing.daily_rate).desc()
    ).all()
    
    return [
        ZonePricingComparison(
            zone=zone,
            avg_rate=float(avg_rate),
            min_rate=float(min_rate),
            max_rate=float(max_rate),
            record_count=record_count
        )
        for zone, avg_rate, min_rate, max_rate, record_count in zone_analysis
    ]


@router.get("/analysis/reps", response_model=List[RepPricingAnalysis])
async def get_rep_pricing_analysis(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Get pricing analysis by REP"""
    
    rep_analysis = db.query(
        DailyPricing.rep,
        func.avg(DailyPricing.daily_rate).label('avg_rate'),
        func.min(DailyPricing.daily_rate).label('min_rate'),
        func.max(DailyPricing.daily_rate).label('max_rate'),
        func.count(DailyPricing.id).label('record_count'),
        func.count(func.distinct(DailyPricing.zone)).label('zones_served')
    ).filter(
        DailyPricing.is_active == True,
        DailyPricing.rep.isnot(None),
        DailyPricing.daily_rate.isnot(None)
    ).group_by(DailyPricing.rep).order_by(
        func.avg(DailyPricing.daily_rate).asc()
    ).all()
    
    return [
        RepPricingAnalysis(
            rep=rep,
            avg_rate=float(avg_rate),
            min_rate=float(min_rate),
            max_rate=float(max_rate),
            record_count=record_count,
            zones_served=zones_served
        )
        for rep, avg_rate, min_rate, max_rate, record_count, zones_served in rep_analysis
    ]


@router.get("/trends/monthly")
async def get_monthly_pricing_trends(
    year: int = Query(2025, description="Year for trends"),
    zone: Optional[str] = Query(None, description="Filter by zone"),
    rep: Optional[str] = Query(None, description="Filter by REP"),
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Get monthly pricing trends"""
    
    query = db.query(
        func.strftime('%m', DailyPricing.effective_date).label('month'),
        func.avg(DailyPricing.daily_rate).label('avg_rate'),
        func.min(DailyPricing.daily_rate).label('min_rate'),
        func.max(DailyPricing.daily_rate).label('max_rate'),
        func.count(DailyPricing.id).label('record_count')
    ).filter(
        DailyPricing.is_active == True,
        func.strftime('%Y', DailyPricing.effective_date) == str(year),
        DailyPricing.daily_rate.isnot(None)
    )
    
    if zone:
        query = query.filter(DailyPricing.zone.ilike(f"%{zone}%"))
    
    if rep:
        query = query.filter(DailyPricing.rep.ilike(f"%{rep}%"))
    
    monthly_trends = query.group_by(
        func.strftime('%m', DailyPricing.effective_date)
    ).order_by(
        func.strftime('%m', DailyPricing.effective_date)
    ).all()
    
    month_names = {
        '01': 'January', '02': 'February', '03': 'March', '04': 'April',
        '05': 'May', '06': 'June', '07': 'July', '08': 'August',
        '09': 'September', '10': 'October', '11': 'November', '12': 'December'
    }
    
    trends_data = {}
    for month, avg_rate, min_rate, max_rate, count in monthly_trends:
        month_name = month_names.get(month, f"Month {month}")
        trends_data[month_name] = {
            'avg_rate': float(avg_rate),
            'min_rate': float(min_rate),
            'max_rate': float(max_rate),
            'record_count': count
        }
    
    return {
        'year': year,
        'zone': zone,
        'rep': rep,
        'monthly_trends': trends_data
    }


@router.get("/best-rates")
async def get_best_rates(
    zone: Optional[str] = Query(None, description="Filter by zone"),
    load_profile: Optional[str] = Query(None, description="Filter by load profile"),
    term_months: Optional[float] = Query(None, description="Filter by term length"),
    limit: int = Query(10, description="Number of best rates to return"),
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Get best available rates with filters"""
    
    query = db.query(DailyPricing).filter(
        DailyPricing.is_active == True,
        DailyPricing.daily_rate.isnot(None)
    )
    
    if zone:
        query = query.filter(DailyPricing.zone.ilike(f"%{zone}%"))
    
    if load_profile:
        query = query.filter(DailyPricing.load_profile.ilike(f"%{load_profile}%"))
    
    if term_months:
        query = query.filter(DailyPricing.term_months == term_months)
    
    best_rates = query.order_by(DailyPricing.daily_rate.asc()).limit(limit).all()
    
    return [
        {
            'id': rate.id,
            'rep': rate.rep,
            'zone': rate.zone,
            'load_profile': rate.load_profile,
            'daily_rate': rate.daily_rate,
            'term_months': rate.term_months,
            'effective_date': rate.effective_date,
            'min_mwh': rate.min_mwh,
            'max_mwh': rate.max_mwh
        }
        for rate in best_rates
    ]
