from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime
from decimal import Decimal


class CommissionBase(BaseModel):
    account_name: Optional[str] = None
    k_rep: Optional[str] = None
    commission_type: str  # 'received' or 'scheduled'


class CommissionCreate(CommissionBase):
    commission_sched_id: Optional[int] = None
    # For received commissions
    actual_payment_amount: Optional[Decimal] = None
    actual_payment_received: Optional[Decimal] = None
    actual_payment_date: Optional[datetime] = None
    actual_mils: Optional[float] = None
    payment_type: Optional[str] = None
    # For scheduled commissions
    contract_date: Optional[datetime] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_active: Optional[bool] = True
    is_currently_active: Optional[bool] = None
    annual_amount: Optional[str] = None
    contracted_amount: Optional[str] = None
    monthly_scheduled: Optional[Dict[str, Any]] = None
    monthly_received: Optional[Dict[str, Any]] = None
    # Legacy fields
    manager_id: Optional[int] = None
    account_id: Optional[int] = None
    provider_id: Optional[int] = None
    amount: Optional[Decimal] = None
    status: Optional[str] = "pending"
    notes: Optional[str] = None
    commission_metadata: Optional[Dict[str, Any]] = None


class CommissionUpdate(BaseModel):
    account_name: Optional[str] = None
    k_rep: Optional[str] = None
    commission_type: Optional[str] = None
    actual_payment_amount: Optional[Decimal] = None
    actual_payment_received: Optional[Decimal] = None
    actual_payment_date: Optional[datetime] = None
    payment_type: Optional[str] = None
    contract_date: Optional[datetime] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_active: Optional[bool] = None
    is_currently_active: Optional[bool] = None
    annual_amount: Optional[str] = None
    contracted_amount: Optional[str] = None
    monthly_scheduled: Optional[Dict[str, Any]] = None
    monthly_received: Optional[Dict[str, Any]] = None
    manager_id: Optional[int] = None
    account_id: Optional[int] = None
    provider_id: Optional[int] = None
    amount: Optional[Decimal] = None
    status: Optional[str] = None
    payment_date: Optional[datetime] = None
    notes: Optional[str] = None
    commission_metadata: Optional[Dict[str, Any]] = None


class CommissionResponse(CommissionBase):
    id: int
    commission_sched_id: Optional[int]
    actual_payment_amount: Optional[Decimal]
    actual_payment_received: Optional[Decimal]
    actual_payment_date: Optional[datetime]
    actual_mils: Optional[float]
    payment_type: Optional[str]
    contract_date: Optional[datetime]
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    is_active: Optional[bool]
    is_currently_active: Optional[bool]
    annual_amount: Optional[str]
    contracted_amount: Optional[str]
    monthly_scheduled: Optional[Dict[str, Any]]
    monthly_received: Optional[Dict[str, Any]]
    manager_id: Optional[int]
    account_id: Optional[int]
    provider_id: Optional[int]
    amount: Optional[Decimal]
    status: Optional[str]
    payment_date: Optional[datetime]
    notes: Optional[str]
    commission_metadata: Optional[Dict[str, Any]]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class CommissionSummary(BaseModel):
    id: int
    account_name: Optional[str]
    k_rep: Optional[str]
    commission_type: str
    actual_payment_amount: Optional[Decimal]
    actual_payment_date: Optional[datetime]
    annual_amount: Optional[str]
    status: Optional[str]
    is_active: Optional[bool]


class CommissionStats(BaseModel):
    total_received: Decimal
    total_scheduled: Decimal
    total_commissions: int
    received_commissions: int
    scheduled_commissions: int
    active_schedules: int