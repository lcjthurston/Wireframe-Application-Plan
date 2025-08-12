from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from app.database import get_db
from app.core.dependencies import get_current_user_id, get_pagination_params, require_manager_or_admin
from app.models.management_company import ManagementCompany
from app.models.manager import Manager
from app.models.user import User
from app.schemas.management_company import (
    ManagementCompanyCreate, 
    ManagementCompanyUpdate, 
    ManagementCompanyResponse,
    ManagementCompanyWithStats
)

router = APIRouter()


@router.get("/", response_model=List[ManagementCompanyResponse])
async def get_management_companies(
    pagination: dict = Depends(get_pagination_params),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager_or_admin),
    search: Optional[str] = Query(None, description="Search by company name or code"),
    status: Optional[str] = Query(None, description="Filter by management status"),
    active_only: bool = Query(True, description="Show only active companies")
):
    """Get all management companies with filtering options"""
    query = db.query(ManagementCompany)
    
    # Apply filters
    if active_only:
        query = query.filter(ManagementCompany.is_active == True)
    
    if search:
        query = query.filter(
            (ManagementCompany.company_name.ilike(f"%{search}%")) |
            (ManagementCompany.mgmt_co_code.ilike(f"%{search}%"))
        )
    
    if status:
        query = query.filter(ManagementCompany.mgmt_status.ilike(f"%{status}%"))
    
    # Apply pagination
    companies = query.offset(pagination["skip"]).limit(pagination["limit"]).all()
    return companies


@router.get("/with-stats", response_model=List[ManagementCompanyWithStats])
async def get_management_companies_with_stats(
    pagination: dict = Depends(get_pagination_params),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager_or_admin),
    active_only: bool = Query(True, description="Show only active companies")
):
    """Get management companies with manager and account statistics"""
    query = db.query(
        ManagementCompany,
        func.count(Manager.id).label('manager_count')
    ).outerjoin(
        Manager, 
        (ManagementCompany.id == Manager.management_company_id) & 
        (Manager.is_active == True)
    ).group_by(ManagementCompany.id)
    
    if active_only:
        query = query.filter(ManagementCompany.is_active == True)
    
    # Apply pagination
    results = query.offset(pagination["skip"]).limit(pagination["limit"]).all()
    
    # Convert to response format
    companies_with_stats = []
    for company, manager_count in results:
        company_dict = {
            **company.__dict__,
            'manager_count': manager_count,
            'account_count': 0,  # TODO: Add when accounts are integrated
            'total_commission': 0.0  # TODO: Add when commissions are integrated
        }
        companies_with_stats.append(company_dict)
    
    return companies_with_stats


@router.get("/{company_id}", response_model=ManagementCompanyResponse)
async def get_management_company(
    company_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Get a specific management company by ID"""
    company = db.query(ManagementCompany).filter(ManagementCompany.id == company_id).first()
    if company is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Management company not found"
        )
    return company


@router.post("/", response_model=ManagementCompanyResponse)
async def create_management_company(
    company: ManagementCompanyCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Create a new management company"""
    db_company = ManagementCompany(**company.dict())
    db.add(db_company)
    db.commit()
    db.refresh(db_company)
    return db_company


@router.put("/{company_id}", response_model=ManagementCompanyResponse)
async def update_management_company(
    company_id: int,
    company_update: ManagementCompanyUpdate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Update a management company"""
    company = db.query(ManagementCompany).filter(ManagementCompany.id == company_id).first()
    if company is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Management company not found"
        )
    
    update_data = company_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(company, field, value)
    
    db.commit()
    db.refresh(company)
    return company


@router.delete("/{company_id}")
async def delete_management_company(
    company_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Delete a management company"""
    company = db.query(ManagementCompany).filter(ManagementCompany.id == company_id).first()
    if company is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Management company not found"
        )
    
    db.delete(company)
    db.commit()
    return {"message": "Management company deleted successfully"}


@router.get("/stats/overview")
async def get_companies_overview(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Get overview statistics for management companies"""
    
    # Total companies
    total_companies = db.query(ManagementCompany).filter(ManagementCompany.is_active == True).count()
    
    # Active companies (status contains 'ACTIVE')
    active_companies = db.query(ManagementCompany).filter(
        ManagementCompany.is_active == True,
        ManagementCompany.mgmt_status.ilike('%ACTIVE%')
    ).count()
    
    # Companies with managers
    companies_with_managers = db.query(ManagementCompany).join(Manager).filter(
        ManagementCompany.is_active == True,
        Manager.is_active == True
    ).distinct().count()
    
    # Top companies by manager count
    top_companies = db.query(
        ManagementCompany.company_name,
        ManagementCompany.mgmt_co_code,
        func.count(Manager.id).label('manager_count')
    ).join(Manager).filter(
        ManagementCompany.is_active == True,
        Manager.is_active == True
    ).group_by(
        ManagementCompany.id, ManagementCompany.company_name, ManagementCompany.mgmt_co_code
    ).order_by(
        func.count(Manager.id).desc()
    ).limit(10).all()
    
    # Status distribution
    status_distribution = db.query(
        ManagementCompany.mgmt_status,
        func.count(ManagementCompany.id).label('count')
    ).filter(
        ManagementCompany.is_active == True,
        ManagementCompany.mgmt_status.isnot(None)
    ).group_by(ManagementCompany.mgmt_status).order_by(
        func.count(ManagementCompany.id).desc()
    ).all()
    
    return {
        "total_companies": total_companies,
        "active_companies": active_companies,
        "companies_with_managers": companies_with_managers,
        "top_companies": [
            {
                "company_name": name,
                "company_code": code,
                "manager_count": count
            }
            for name, code, count in top_companies
        ],
        "status_distribution": [
            {"status": status, "count": count}
            for status, count in status_distribution
        ]
    }
