from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime


class ManagerBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    department: Optional[str] = None


class ManagerCreate(ManagerBase):
    pass


class ManagerUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    accounts_count: Optional[int] = None
    performance_metrics: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None


class ManagerResponse(ManagerBase):
    id: int
    accounts_count: int
    performance_metrics: Optional[Dict[str, Any]] = None
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True 