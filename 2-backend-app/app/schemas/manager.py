from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class ManagerBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    department: Optional[str] = None
    position: Optional[str] = None


class ManagerCreate(ManagerBase):
    hire_date: Optional[datetime] = None
    notes: Optional[str] = None


class ManagerUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    position: Optional[str] = None
    notes: Optional[str] = None
    is_active: Optional[bool] = None


class ManagerResponse(ManagerBase):
    id: int
    is_active: bool
    hire_date: Optional[datetime]
    notes: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True 
