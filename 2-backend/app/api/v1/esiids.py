from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_
from typing import List, Optional
from app.database import get_db
from app.core.dependencies import get_current_user_id, get_pagination_params
from app.models.esiid import ESIID
from app.models.provider import Provider
from app.models.management_company import ManagementCompany
from app.schemas.esiid import ESIIDCreate, ESIIDUpdate, ESIIDResponse, ESIIDWithDetails, ESIIDSummary

router = APIRouter()


@router.get("/", response_model=List[ESIIDSummary])
async def get_esiids(
    pagination: dict = Depends(get_pagination_params),
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
    search: Optional[str] = Query(None, description="Search by ESIID, account name, or address"),
    rep: Optional[str] = Query(None, description="Filter by REP/provider"),
    load_profile: Optional[str] = Query(None, description="Filter by load profile"),
    zone: Optional[str] = Query(None, description="Filter by zone"),
    min_kwh_mo: Optional[float] = Query(None, description="Minimum monthly kWh"),
    max_kwh_mo: Optional[float] = Query(None, description="Maximum monthly kWh"),
    min_bill: Optional[float] = Query(None, description="Minimum total bill"),
    max_bill: Optional[float] = Query(None, description="Maximum total bill"),
    active_only: bool = Query(True, description="Show only active ESIIDs")
):
    """Get ESIIDs with filtering options"""
    query = db.query(ESIID)
    
    # Apply filters
    if active_only:
        query = query.filter(ESIID.is_active == True)
    
    if search:
        search_filter = or_(
            ESIID.esi_id.ilike(f"%{search}%"),
            ESIID.account_name.ilike(f"%{search}%"),
            ESIID.service_address_1.ilike(f"%{search}%")
        )
        query = query.filter(search_filter)
    
    if rep:
        query = query.filter(ESIID.rep.ilike(f"%{rep}%"))
    
    if load_profile:
        query = query.filter(ESIID.load_profile.ilike(f"%{load_profile}%"))
    
    if zone:
        query = query.filter(ESIID.zone.ilike(f"%{zone}%"))
    
    if min_kwh_mo is not None:
        query = query.filter(ESIID.kwh_mo >= min_kwh_mo)
    
    if max_kwh_mo is not None:
        query = query.filter(ESIID.kwh_mo <= max_kwh_mo)
    
    if min_bill is not None:
        query = query.filter(ESIID.total_bill >= min_bill)
    
    if max_bill is not None:
        query = query.filter(ESIID.total_bill <= max_bill)
    
    # Apply pagination
    esiids = query.offset(pagination["skip"]).limit(pagination["limit"]).all()
    return esiids


@router.get("/{esiid_id}", response_model=ESIIDWithDetails)
async def get_esiid(
    esiid_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Get ESIID by ID with detailed information"""
    esiid = db.query(ESIID).filter(ESIID.id == esiid_id).first()
    if esiid is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="ESIID not found"
        )
    return esiid


@router.post("/", response_model=ESIIDResponse)
async def create_esiid(
    esiid_data: ESIIDCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Create a new ESIID"""
    db_esiid = ESIID(**esiid_data.dict())
    db.add(db_esiid)
    db.commit()
    db.refresh(db_esiid)
    return db_esiid


@router.put("/{esiid_id}", response_model=ESIIDResponse)
async def update_esiid(
    esiid_id: int,
    esiid_data: ESIIDUpdate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Update an ESIID"""
    esiid = db.query(ESIID).filter(ESIID.id == esiid_id).first()
    if esiid is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="ESIID not found"
        )
    
    update_data = esiid_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(esiid, field, value)
    
    db.commit()
    db.refresh(esiid)
    return esiid


@router.delete("/{esiid_id}")
async def delete_esiid(
    esiid_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Delete an ESIID"""
    esiid = db.query(ESIID).filter(ESIID.id == esiid_id).first()
    if esiid is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="ESIID not found"
        )
    
    db.delete(esiid)
    db.commit()
    return {"message": "ESIID deleted successfully"}


@router.get("/stats/overview")
async def get_esiids_overview(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Get overview statistics for ESIIDs"""
    
    # Total ESIIDs
    total_esiids = db.query(ESIID).filter(ESIID.is_active == True).count()
    
    # ESIIDs with usage data
    esiids_with_usage = db.query(ESIID).filter(
        ESIID.is_active == True,
        ESIID.kwh_mo.isnot(None),
        ESIID.kwh_mo > 0
    ).count()
    
    # ESIIDs linked to providers
    esiids_with_provider = db.query(ESIID).filter(
        ESIID.is_active == True,
        ESIID.provider_id.isnot(None)
    ).count()
    
    # ESIIDs linked to management companies
    esiids_with_company = db.query(ESIID).filter(
        ESIID.is_active == True,
        ESIID.management_company_id.isnot(None)
    ).count()
    
    # Usage statistics
    usage_stats = db.query(
        func.sum(ESIID.kwh_mo).label('total_kwh_mo'),
        func.sum(ESIID.kwh_yr).label('total_kwh_yr'),
        func.sum(ESIID.total_bill).label('total_billing'),
        func.avg(ESIID.kwh_mo).label('avg_kwh_mo'),
        func.avg(ESIID.total_bill).label('avg_bill')
    ).filter(
        ESIID.is_active == True,
        ESIID.kwh_mo.isnot(None),
        ESIID.kwh_mo > 0
    ).first()
    
    # Top REPs by ESIID count
    top_reps = db.query(
        ESIID.rep,
        func.count(ESIID.id).label('count')
    ).filter(
        ESIID.is_active == True,
        ESIID.rep.isnot(None)
    ).group_by(ESIID.rep).order_by(
        func.count(ESIID.id).desc()
    ).limit(10).all()
    
    # Load profile distribution
    load_profiles = db.query(
        ESIID.load_profile,
        func.count(ESIID.id).label('count')
    ).filter(
        ESIID.is_active == True,
        ESIID.load_profile.isnot(None)
    ).group_by(ESIID.load_profile).order_by(
        func.count(ESIID.id).desc()
    ).limit(10).all()
    
    return {
        "total_esiids": total_esiids,
        "esiids_with_usage": esiids_with_usage,
        "esiids_with_provider": esiids_with_provider,
        "esiids_with_company": esiids_with_company,
        "usage_statistics": {
            "total_kwh_mo": float(usage_stats.total_kwh_mo or 0),
            "total_kwh_yr": float(usage_stats.total_kwh_yr or 0),
            "total_billing": float(usage_stats.total_billing or 0),
            "avg_kwh_mo": float(usage_stats.avg_kwh_mo or 0),
            "avg_bill": float(usage_stats.avg_bill or 0)
        },
        "top_reps": [
            {"rep": rep, "count": count}
            for rep, count in top_reps
        ],
        "load_profiles": [
            {"profile": profile, "count": count}
            for profile, count in load_profiles
        ]
    }


@router.get("/by-provider/{provider_id}")
async def get_esiids_by_provider(
    provider_id: int,
    pagination: dict = Depends(get_pagination_params),
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Get ESIIDs for a specific provider"""
    esiids = db.query(ESIID).filter(
        ESIID.provider_id == provider_id,
        ESIID.is_active == True
    ).offset(pagination["skip"]).limit(pagination["limit"]).all()
    
    return esiids


@router.get("/by-company/{company_id}")
async def get_esiids_by_company(
    company_id: int,
    pagination: dict = Depends(get_pagination_params),
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Get ESIIDs for a specific management company"""
    esiids = db.query(ESIID).filter(
        ESIID.management_company_id == company_id,
        ESIID.is_active == True
    ).offset(pagination["skip"]).limit(pagination["limit"]).all()
    
    return esiids
