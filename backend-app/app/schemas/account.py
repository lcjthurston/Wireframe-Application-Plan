from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime


class AccountBase(BaseModel):
    name: str
    account_number: str
    manager_id: Optional[int] = None
    provider_id: Optional[int] = None
    status: str = "active"


class AccountCreate(AccountBase):
    pass


class AccountUpdate(BaseModel):
    name: Optional[str] = None
    account_number: Optional[str] = None
    manager_id: Optional[int] = None
    provider_id: Optional[int] = None
    status: Optional[str] = None
    usage_data: Optional[Dict[str, Any]] = None
    pricing_data: Optional[Dict[str, Any]] = None
    contract_data: Optional[Dict[str, Any]] = None


class AccountResponse(AccountBase):
    id: int
    usage_data: Optional[Dict[str, Any]] = None
    pricing_data: Optional[Dict[str, Any]] = None
    contract_data: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True 