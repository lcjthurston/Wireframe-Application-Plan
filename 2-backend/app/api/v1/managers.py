from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.core.dependencies import get_current_user_id, get_optional_current_user_id, get_test_user_id, get_pagination_params, require_manager_or_admin
from app.models.manager import Manager
from app.models.user import User
from app.schemas.manager import ManagerCreate, ManagerUpdate, ManagerResponse

router = APIRouter()


@router.get("/", response_model=List[ManagerResponse])
async def get_managers(
    pagination: dict = Depends(get_pagination_params),
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_test_user_id),
    search: Optional[str] = Query(None, description="Search by manager name"),
    management_company: Optional[str] = Query(None, description="Filter by management company"),
    office_city: Optional[str] = Query(None, description="Filter by office city"),
    mgr_status: Optional[str] = Query(None, description="Filter by manager status"),
    active_only: bool = Query(True, description="Show only active managers")
):
    """Get all managers with filtering options"""
    query = db.query(Manager)

    # Apply filters
    if active_only:
        query = query.filter(Manager.is_active == True)

    if search:
        query = query.filter(Manager.name.ilike(f"%{search}%"))

    if management_company:
        query = query.filter(Manager.management_company.ilike(f"%{management_company}%"))

    if office_city:
        query = query.filter(Manager.office_city.ilike(f"%{office_city}%"))

    if mgr_status:
        query = query.filter(Manager.mgr_status.ilike(f"%{mgr_status}%"))

    # Apply pagination
    managers = query.offset(pagination["skip"]).limit(pagination["limit"]).all()
    return managers


@router.get("/{manager_id}", response_model=ManagerResponse)
async def get_manager(
    manager_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Get manager by ID"""
    manager = db.query(Manager).filter(Manager.id == manager_id).first()
    if manager is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Manager not found"
        )
    return manager


@router.post("/", response_model=ManagerResponse)
async def create_manager(
    manager_data: ManagerCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Create a new manager"""
    db_manager = Manager(**manager_data.dict())
    db.add(db_manager)
    db.commit()
    db.refresh(db_manager)
    return db_manager


@router.put("/{manager_id}", response_model=ManagerResponse)
async def update_manager(
    manager_id: int,
    manager_data: ManagerUpdate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Update a manager"""
    manager = db.query(Manager).filter(Manager.id == manager_id).first()
    if manager is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Manager not found"
        )
    
    update_data = manager_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(manager, field, value)
    
    db.commit()
    db.refresh(manager)
    return manager


@router.delete("/{manager_id}")
async def delete_manager(
    manager_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Delete a manager"""
    manager = db.query(Manager).filter(Manager.id == manager_id).first()
    if manager is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Manager not found"
        )

    db.delete(manager)
    db.commit()
    return {"message": "Manager deleted successfully"}


@router.get("/stats/companies")
async def get_management_companies_stats(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Get statistics about management companies"""
    from sqlalchemy import func

    # Get company counts
    company_stats = db.query(
        Manager.management_company,
        func.count(Manager.id).label('manager_count')
    ).filter(
        Manager.management_company.isnot(None),
        Manager.is_active == True
    ).group_by(Manager.management_company).order_by(
        func.count(Manager.id).desc()
    ).limit(20).all()

    # Get total stats
    total_managers = db.query(Manager).filter(Manager.is_active == True).count()
    total_companies = db.query(Manager.management_company).filter(
        Manager.management_company.isnot(None),
        Manager.is_active == True
    ).distinct().count()

    return {
        "total_managers": total_managers,
        "total_companies": total_companies,
        "top_companies": [
            {"company": company, "manager_count": count}
            for company, count in company_stats
        ]
    }