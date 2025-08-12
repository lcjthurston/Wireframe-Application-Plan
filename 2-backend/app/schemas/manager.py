from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class ManagerBase(BaseModel):
    name: str
    mgr_status: Optional[str] = None
    mgr_class: Optional[str] = None
    management_company: Optional[str] = None
    office: Optional[str] = None
    office_city: Optional[str] = None
    supervisor: Optional[str] = None
    admin_assistant: Optional[str] = None
    email: Optional[str] = None  # Changed from EmailStr since many are null/invalid
    assistant_email: Optional[str] = None
    phone: Optional[str] = None
    cell: Optional[str] = None
    fax: Optional[str] = None


class ManagerCreate(ManagerBase):
    mgr_id: Optional[int] = None  # Original MGR_ID from Excel
    mgr_note: Optional[str] = None
    last_update: Optional[str] = None


class ManagerUpdate(BaseModel):
    name: Optional[str] = None
    mgr_status: Optional[str] = None
    mgr_class: Optional[str] = None
    management_company: Optional[str] = None
    office: Optional[str] = None
    office_city: Optional[str] = None
    supervisor: Optional[str] = None
    admin_assistant: Optional[str] = None
    email: Optional[str] = None
    assistant_email: Optional[str] = None
    phone: Optional[str] = None
    cell: Optional[str] = None
    fax: Optional[str] = None
    mgr_note: Optional[str] = None
    last_update: Optional[str] = None
    is_active: Optional[bool] = None


class ManagerResponse(ManagerBase):
    id: int
    mgr_id: Optional[int]
    mgr_note: Optional[str]
    last_update: Optional[str]
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True
