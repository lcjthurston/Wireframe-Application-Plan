from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime
from decimal import Decimal


class CommissionBase(BaseModel):
    manager_id: int
    account_id: int
    amount: Decimal
    commission_type: str
    status: str = "pending"


class CommissionCreate(CommissionBase):
    pass


class CommissionUpdate(BaseModel):
    amount: Optional[Decimal] = None
    commission_type: Optional[str] = None
    status: Optional[str] = None
    payment_date: Optional[datetime] = None
    notes: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


class CommissionResponse(CommissionBase):
    id: int
    payment_date: Optional[datetime] = None
    notes: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True 