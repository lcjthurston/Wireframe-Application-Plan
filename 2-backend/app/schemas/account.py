from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime


class AccountBase(BaseModel):
    account_name: str
    manager_name: Optional[str] = None
    management_company: Optional[str] = None
    procurement_status: Optional[str] = None
    contact_name: Optional[str] = None
    email: Optional[str] = None
    telephone: Optional[str] = None
    fax: Optional[str] = None
    billing_street: Optional[str] = None
    billing_city: Optional[str] = None
    billing_state: Optional[str] = None
    billing_zip: Optional[str] = None
    legal_name: Optional[str] = None
    fed_tax_id: Optional[str] = None
    customer_type: Optional[str] = None
    usage_kwh: Optional[float] = None
    load_profile: Optional[str] = None
    max_kva: Optional[float] = None
    activity_date: Optional[str] = None
    current_activity: Optional[str] = None
    zone_account: Optional[str] = None
    usage_date: Optional[str] = None
    usage_tdsp: Optional[float] = None

    # Legacy fields for backward compatibility
    name: Optional[str] = None
    esiid: Optional[str] = None
    manager_id: Optional[int] = None
    provider_id: Optional[int] = None


class AccountCreate(AccountBase):
    pass


class AccountUpdate(BaseModel):
    account_name: Optional[str] = None
    manager_name: Optional[str] = None
    management_company: Optional[str] = None
    procurement_status: Optional[str] = None
    contact_name: Optional[str] = None
    email: Optional[str] = None
    telephone: Optional[str] = None
    fax: Optional[str] = None
    billing_street: Optional[str] = None
    billing_city: Optional[str] = None
    billing_state: Optional[str] = None
    billing_zip: Optional[str] = None
    legal_name: Optional[str] = None
    fed_tax_id: Optional[str] = None
    customer_type: Optional[str] = None
    usage_kwh: Optional[float] = None
    load_profile: Optional[str] = None
    max_kva: Optional[float] = None
    activity_date: Optional[str] = None
    current_activity: Optional[str] = None
    zone_account: Optional[str] = None
    usage_date: Optional[str] = None
    usage_tdsp: Optional[float] = None

    # Legacy fields
    name: Optional[str] = None
    esiid: Optional[str] = None
    manager_id: Optional[int] = None
    provider_id: Optional[int] = None
    last_usage_update: Optional[datetime] = None


class AccountResponse(AccountBase):
    id: int
    account_list_id: Optional[str] = None
    last_usage_update: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True