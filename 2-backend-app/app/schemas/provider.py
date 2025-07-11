from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime


class ProviderBase(BaseModel):
    name: str
    type: str
    contact_info: Optional[Dict[str, Any]] = None
    performance_metrics: Optional[Dict[str, Any]] = None


class ProviderCreate(ProviderBase):
    pass


class ProviderUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    contact_info: Optional[Dict[str, Any]] = None
    performance_metrics: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None


class ProviderResponse(ProviderBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True 