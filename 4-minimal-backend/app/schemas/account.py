from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime


class AccountBase(BaseModel):
    name: str
    esiid: Optional[str] = None
    usage_kwh: Optional[float] = 0.0
    manager_id: Optional[int] = None
    provider_id: Optional[int] = None


class AccountCreate(AccountBase):
    pass


class AccountUpdate(BaseModel):
    name: Optional[str] = None
    esiid: Optional[str] = None
    usage_kwh: Optional[float] = None
    manager_id: Optional[int] = None
    provider_id: Optional[int] = None
    last_usage_update: Optional[datetime] = None


class AccountResponse(AccountBase):
    id: int
    last_usage_update: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True