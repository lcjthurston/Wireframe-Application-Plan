from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.database import get_db
from app.core.dependencies import get_current_user_id, get_pagination_params, require_manager_or_admin
from app.models.commission import Commission
from app.models.user import User
from app.schemas.commission import CommissionCreate, CommissionUpdate, CommissionResponse

router = APIRouter()


@router.get("/", response_model=List[CommissionResponse])
async def get_commissions(
    pagination: dict = Depends(get_pagination_params),
    status: str = None,
    manager_id: int = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager_or_admin)
):
    """Get all commissions with optional filtering (requires manager or admin role)"""
    query = db.query(Commission)

    if status:
        query = query.filter(Commission.status == status)
    if manager_id:
        query = query.filter(Commission.manager_id == manager_id)

    commissions = query.offset(pagination["skip"]).limit(pagination["limit"]).all()
    return commissions


@router.get("/{commission_id}", response_model=CommissionResponse)
async def get_commission(
    commission_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Get commission by ID"""
    commission = db.query(Commission).filter(Commission.id == commission_id).first()
    if commission is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Commission not found"
        )
    return commission


@router.post("/", response_model=CommissionResponse)
async def create_commission(
    commission_data: CommissionCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Create a new commission"""
    db_commission = Commission(**commission_data.dict())
    db.add(db_commission)
    db.commit()
    db.refresh(db_commission)
    return db_commission


@router.put("/{commission_id}", response_model=CommissionResponse)
async def update_commission(
    commission_id: int,
    commission_data: CommissionUpdate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Update a commission"""
    commission = db.query(Commission).filter(Commission.id == commission_id).first()
    if commission is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Commission not found"
        )
    
    update_data = commission_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(commission, field, value)
    
    db.commit()
    db.refresh(commission)
    return commission


@router.post("/{commission_id}/process-payment")
async def process_payment(
    commission_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Process payment for a commission"""
    commission = db.query(Commission).filter(Commission.id == commission_id).first()
    if commission is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Commission not found"
        )
    
    commission.status = "paid"
    commission.payment_date = datetime.utcnow()
    db.commit()
    db.refresh(commission)
    
    return {"message": "Payment processed successfully", "commission_id": commission_id} 