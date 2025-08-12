from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ManagementCompanyBase(BaseModel):
    company_name: str
    mgmt_co_code: Optional[str] = None
    mgmt_status: Optional[str] = None
    data_contact: Optional[str] = None
    office_street: Optional[str] = None
    office_city_state_zip: Optional[str] = None
    office_phone: Optional[str] = None
    office_fax: Optional[str] = None
    billing_street: Optional[str] = None
    billing_city: Optional[str] = None
    billing_state: Optional[str] = None
    billing_zip: Optional[str] = None
    billing_phone: Optional[str] = None
    billing_fax: Optional[str] = None
    billing_email: Optional[str] = None


class ManagementCompanyCreate(ManagementCompanyBase):
    mgmt_co_id: Optional[int] = None  # Original MGMT_CO_ID from Excel
    follow_up: Optional[datetime] = None
    priority: Optional[float] = None


class ManagementCompanyUpdate(BaseModel):
    company_name: Optional[str] = None
    mgmt_co_code: Optional[str] = None
    mgmt_status: Optional[str] = None
    data_contact: Optional[str] = None
    office_street: Optional[str] = None
    office_city_state_zip: Optional[str] = None
    office_phone: Optional[str] = None
    office_fax: Optional[str] = None
    billing_street: Optional[str] = None
    billing_city: Optional[str] = None
    billing_state: Optional[str] = None
    billing_zip: Optional[str] = None
    billing_phone: Optional[str] = None
    billing_fax: Optional[str] = None
    billing_email: Optional[str] = None
    follow_up: Optional[datetime] = None
    priority: Optional[float] = None
    is_active: Optional[bool] = None


class ManagementCompanyResponse(ManagementCompanyBase):
    id: int
    mgmt_co_id: Optional[int]
    follow_up: Optional[datetime]
    priority: Optional[float]
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class ManagementCompanyWithStats(ManagementCompanyResponse):
    manager_count: int = 0
    account_count: int = 0
    total_commission: float = 0.0
