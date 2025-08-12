from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_
from typing import List, Optional
from datetime import datetime
from app.database import get_db
from app.core.dependencies import get_current_user_id, get_pagination_params, require_manager_or_admin
from app.models.commission import Commission
from app.models.user import User
from app.schemas.commission import CommissionCreate, CommissionUpdate, CommissionResponse, CommissionSummary, CommissionStats

router = APIRouter()


@router.get("/", response_model=List[CommissionSummary])
async def get_commissions(
    pagination: dict = Depends(get_pagination_params),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager_or_admin),
    search: Optional[str] = Query(None, description="Search by account name or REP"),
    commission_type: Optional[str] = Query(None, description="Filter by commission type (received/scheduled)"),
    k_rep: Optional[str] = Query(None, description="Filter by K_REP/provider"),
    status: Optional[str] = Query(None, description="Filter by status"),
    manager_id: Optional[int] = Query(None, description="Filter by manager ID"),
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
    date_from: Optional[str] = Query(None, description="Filter from date (YYYY-MM-DD)"),
    date_to: Optional[str] = Query(None, description="Filter to date (YYYY-MM-DD)")
):
    """Get all commissions with advanced filtering (requires manager or admin role)"""
    query = db.query(Commission)

    # Apply filters
    if search:
        search_filter = or_(
            Commission.account_name.ilike(f"%{search}%"),
            Commission.k_rep.ilike(f"%{search}%")
        )
        query = query.filter(search_filter)

    if commission_type:
        query = query.filter(Commission.commission_type == commission_type)

    if k_rep:
        query = query.filter(Commission.k_rep.ilike(f"%{k_rep}%"))

    if status:
        query = query.filter(Commission.status == status)

    if manager_id:
        query = query.filter(Commission.manager_id == manager_id)

    if is_active is not None:
        query = query.filter(Commission.is_active == is_active)

    if date_from:
        try:
            from_date = datetime.strptime(date_from, "%Y-%m-%d")
            query = query.filter(Commission.actual_payment_date >= from_date)
        except ValueError:
            pass

    if date_to:
        try:
            to_date = datetime.strptime(date_to, "%Y-%m-%d")
            query = query.filter(Commission.actual_payment_date <= to_date)
        except ValueError:
            pass

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


@router.get("/stats/overview", response_model=CommissionStats)
async def get_commission_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager_or_admin)
):
    """Get commission statistics overview"""

    # Total received commissions
    received_stats = db.query(
        func.sum(Commission.actual_payment_amount).label('total_received'),
        func.count(Commission.id).label('count_received')
    ).filter(Commission.commission_type == 'received').first()

    # Total scheduled commissions (count only, amounts are in JSON)
    scheduled_stats = db.query(
        func.count(Commission.id).label('count_scheduled')
    ).filter(Commission.commission_type == 'scheduled').first()

    # Active schedules
    active_schedules = db.query(Commission).filter(
        Commission.commission_type == 'scheduled',
        Commission.is_active == True
    ).count()

    # Total commissions
    total_commissions = db.query(Commission).count()

    return CommissionStats(
        total_received=received_stats.total_received or 0,
        total_scheduled=0,  # Would need to parse JSON to calculate
        total_commissions=total_commissions,
        received_commissions=received_stats.count_received or 0,
        scheduled_commissions=scheduled_stats.count_scheduled or 0,
        active_schedules=active_schedules
    )


@router.get("/by-rep/{rep_name}")
async def get_commissions_by_rep(
    rep_name: str,
    pagination: dict = Depends(get_pagination_params),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager_or_admin)
):
    """Get commissions for a specific REP/provider"""
    commissions = db.query(Commission).filter(
        Commission.k_rep.ilike(f"%{rep_name}%")
    ).offset(pagination["skip"]).limit(pagination["limit"]).all()

    return commissions


@router.get("/monthly-summary")
async def get_monthly_commission_summary(
    year: int = Query(2024, description="Year for summary"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager_or_admin)
):
    """Get monthly commission summary for a given year"""

    # Get received commissions by month
    received_by_month = db.query(
        func.strftime('%m', Commission.actual_payment_date).label('month'),
        func.sum(Commission.actual_payment_amount).label('total_amount'),
        func.count(Commission.id).label('count')
    ).filter(
        Commission.commission_type == 'received',
        func.strftime('%Y', Commission.actual_payment_date) == str(year)
    ).group_by(func.strftime('%m', Commission.actual_payment_date)).all()

    monthly_data = {}
    for month, total, count in received_by_month:
        month_name = datetime.strptime(month, '%m').strftime('%B')
        monthly_data[month_name] = {
            'total_amount': float(total or 0),
            'count': count or 0
        }

    return {
        'year': year,
        'monthly_data': monthly_data,
        'total_year_amount': sum(data['total_amount'] for data in monthly_data.values()),
        'total_year_count': sum(data['count'] for data in monthly_data.values())
    }