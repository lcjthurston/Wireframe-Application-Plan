from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.core.dependencies import get_current_user_id, get_pagination_params, require_admin_user
from app.models.provider import Provider
from app.models.user import User
from app.schemas.provider import ProviderCreate, ProviderUpdate, ProviderResponse

router = APIRouter()


@router.get("/", response_model=List[ProviderResponse])
async def get_providers(
    pagination: dict = Depends(get_pagination_params),
    provider_type: str = None,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Get all providers with optional filtering"""
    query = db.query(Provider)

    if provider_type:
        query = query.filter(Provider.type == provider_type)

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