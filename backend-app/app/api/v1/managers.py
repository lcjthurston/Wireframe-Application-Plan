from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.manager import Manager
from app.schemas.manager import ManagerCreate, ManagerUpdate, ManagerResponse
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


@router.get("/", response_model=List[ManagerResponse])
async def get_managers(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Get all managers"""
    managers = db.query(Manager).offset(skip).limit(limit).all()
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