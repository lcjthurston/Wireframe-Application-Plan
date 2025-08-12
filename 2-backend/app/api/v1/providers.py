from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from app.database import get_db
from app.core.dependencies import get_current_user_id, get_pagination_params, require_admin_user
from app.models.provider import Provider
from app.models.user import User
from app.schemas.provider import ProviderCreate, ProviderUpdate, ProviderResponse, ProviderWithStats

router = APIRouter()


@router.get("/", response_model=List[ProviderResponse])
async def get_providers(
    pagination: dict = Depends(get_pagination_params),
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
    search: Optional[str] = Query(None, description="Search by provider name"),
    provider_type: Optional[str] = Query(None, description="Filter by provider type"),
    refund_type: Optional[str] = Query(None, description="Filter by refund type"),
    active_only: bool = Query(True, description="Show only active providers"),
    rep_active_only: bool = Query(False, description="Show only REP active providers")
):
    """Get all providers with filtering options"""
    query = db.query(Provider)

    # Apply filters
    if active_only:
        query = query.filter(Provider.is_active == True)

    if rep_active_only:
        query = query.filter(Provider.rep_active == 1.0)

    if search:
        query = query.filter(Provider.name.ilike(f"%{search}%"))

    if provider_type:
        query = query.filter(Provider.type.ilike(f"%{provider_type}%"))

    if refund_type:
        query = query.filter(Provider.refund_type.ilike(f"%{refund_type}%"))

    # Apply pagination
    providers = query.offset(pagination["skip"]).limit(pagination["limit"]).all()
    return providers


@router.get("/{provider_id}", response_model=ProviderResponse)
async def get_provider(
    provider_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Get provider by ID"""
    provider = db.query(Provider).filter(Provider.id == provider_id).first()
    if provider is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Provider not found"
        )
    return provider


@router.post("/", response_model=ProviderResponse)
async def create_provider(
    provider_data: ProviderCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Create a new provider"""
    db_provider = Provider(**provider_data.dict())
    db.add(db_provider)
    db.commit()
    db.refresh(db_provider)
    return db_provider


@router.put("/{provider_id}", response_model=ProviderResponse)
async def update_provider(
    provider_id: int,
    provider_data: ProviderUpdate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Update a provider"""
    provider = db.query(Provider).filter(Provider.id == provider_id).first()
    if provider is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Provider not found"
        )
    
    update_data = provider_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(provider, field, value)
    
    db.commit()
    db.refresh(provider)
    return provider


@router.delete("/{provider_id}")
async def delete_provider(
    provider_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Delete a provider"""
    provider = db.query(Provider).filter(Provider.id == provider_id).first()
    if provider is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Provider not found"
        )

    db.delete(provider)
    db.commit()
    return {"message": "Provider deleted successfully"}


@router.get("/stats/overview")
async def get_providers_overview(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Get overview statistics for providers"""

    # Total providers
    total_providers = db.query(Provider).filter(Provider.is_active == True).count()

    # REP active providers
    rep_active_providers = db.query(Provider).filter(
        Provider.is_active == True,
        Provider.rep_active == 1.0
    ).count()

    # Providers with contact info
    providers_with_email = db.query(Provider).filter(
        Provider.is_active == True,
        Provider.rep_email.isnot(None),
        Provider.rep_email != ''
    ).count()

    providers_with_phone = db.query(Provider).filter(
        Provider.is_active == True,
        Provider.rep_phone.isnot(None),
        Provider.rep_phone != ''
    ).count()

    # Refund type distribution
    refund_distribution = db.query(
        Provider.refund_type,
        func.count(Provider.id).label('count')
    ).filter(
        Provider.is_active == True,
        Provider.refund_type.isnot(None)
    ).group_by(Provider.refund_type).order_by(
        func.count(Provider.id).desc()
    ).all()

    # Top providers by name (active ones)
    top_providers = db.query(
        Provider.name,
        Provider.rep_contact,
        Provider.refund_type
    ).filter(
        Provider.is_active == True,
        Provider.rep_active == 1.0
    ).order_by(Provider.name).limit(10).all()

    return {
        "total_providers": total_providers,
        "rep_active_providers": rep_active_providers,
        "providers_with_email": providers_with_email,
        "providers_with_phone": providers_with_phone,
        "refund_distribution": [
            {"refund_type": refund_type, "count": count}
            for refund_type, count in refund_distribution
        ],
        "top_active_providers": [
            {
                "name": name,
                "contact": contact,
                "refund_type": refund_type
            }
            for name, contact, refund_type in top_providers
        ]
    }