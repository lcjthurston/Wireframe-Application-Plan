from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.database import get_db
from app.models.system_health import SystemHealth
from app.schemas.system_health import SystemHealthCreate, SystemHealthResponse
from app.api.v1.auth import oauth2_scheme
from app.core.security import verify_token

router = APIRouter()


def get_current_user_id(token: str = Depends(oauth2_scheme)) -> int:
    payload = verify_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return int(payload.get("sub"))


@router.get("/", response_model=List[SystemHealthResponse])
async def get_system_health(
    skip: int = 0,
    limit: int = 100,
    service_name: str = None,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Get system health status for all services"""
    query = db.query(SystemHealth)
    
    if service_name:
        query = query.filter(SystemHealth.service_name == service_name)
    
    health_records = query.offset(skip).limit(limit).all()
    return health_records


@router.get("/services", response_model=List[SystemHealthResponse])
async def get_services_status(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Get status of all monitored services"""
    services = db.query(SystemHealth).all()
    return services


@router.post("/check")
async def check_system_health(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Manual system health check"""
    # TODO: Implement actual health checks for:
    # - Database connectivity
    # - External API connectivity (Centerpoint)
    # - Email service connectivity
    # - Redis connectivity
    
    # Mock health check for now
    health_status = {
        "database": "OK",
        "centerpoint_api": "OK", 
        "email_service": "OK",
        "redis": "OK",
        "timestamp": datetime.utcnow().isoformat()
    }
    
    return {
        "status": "healthy",
        "services": health_status,
        "message": "All systems operational"
    }


@router.post("/", response_model=SystemHealthResponse)
async def create_health_record(
    health_data: SystemHealthCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Create a new system health record"""
    db_health = SystemHealth(**health_data.dict())
    db.add(db_health)
    db.commit()
    db.refresh(db_health)
    return db_health 