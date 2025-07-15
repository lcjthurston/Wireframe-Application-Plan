from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.database import get_db
from app.core.dependencies import get_current_user_id, get_pagination_params, require_admin_user
from app.models.system_health import SystemHealth
from app.models.user import User
from app.schemas.system_health import SystemHealthCreate, SystemHealthResponse
from app.services.centerpoint import centerpoint_client
import redis
from app.core.config import settings

router = APIRouter()


@router.get("/", response_model=List[SystemHealthResponse])
async def get_system_health(
    pagination: dict = Depends(get_pagination_params),
    service_name: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_user)
):
    """Get system health status for all services (admin only)"""
    query = db.query(SystemHealth)

    if service_name:
        query = query.filter(SystemHealth.service_name == service_name)

    health_records = query.offset(pagination["skip"]).limit(pagination["limit"]).all()
    return health_records


@router.get("/services", response_model=List[SystemHealthResponse])
async def get_services_status(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Get status of all monitored services"""
    services = db.query(SystemHealth).all()
    return services


@router.get("/status")
async def get_comprehensive_health_status(db: Session = Depends(get_db)):
    """Get comprehensive system health status"""
    health_status = {
        "timestamp": datetime.utcnow(),
        "overall_status": "healthy",
        "services": {}
    }
    
    # Database health
    try:
        db.execute("SELECT 1")
        health_status["services"]["database"] = {"status": "healthy", "response_time_ms": 0}
    except Exception as e:
        health_status["services"]["database"] = {"status": "unhealthy", "error": str(e)}
        health_status["overall_status"] = "unhealthy"
    
    # Redis health
    try:
        r = redis.from_url(settings.redis_url)
        r.ping()
        health_status["services"]["redis"] = {"status": "healthy"}
    except Exception as e:
        health_status["services"]["redis"] = {"status": "unhealthy", "error": str(e)}
    
    # Centerpoint API health
    try:
        is_healthy = await centerpoint_client.check_connection()
        health_status["services"]["centerpoint_api"] = {
            "status": "healthy" if is_healthy else "unhealthy"
        }
        if not is_healthy:
            health_status["overall_status"] = "degraded"
    except Exception as e:
        health_status["services"]["centerpoint_api"] = {"status": "unhealthy", "error": str(e)}
    
    return health_status


@router.post("/check")
async def run_health_check(db: Session = Depends(get_db)):
    """Run comprehensive health check and store results"""
    health_data = await get_comprehensive_health_status(db)
    
    # Store health check result in database
    health_record = SystemHealth(
        status=health_data["overall_status"],
        details=health_data["services"],
        checked_at=datetime.utcnow()
    )
    db.add(health_record)
    db.commit()
    
    return health_data


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
