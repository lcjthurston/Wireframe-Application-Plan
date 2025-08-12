from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime


class ProviderBase(BaseModel):
    name: str
    type: Optional[str] = "electricity"
    street_address: Optional[str] = None
    city_state_zip: Optional[str] = None
    rep_phone: Optional[str] = None
    rep_contact: Optional[str] = None
    rep_email: Optional[str] = None
    rep_note: Optional[str] = None
    rep_payment_terms: Optional[str] = None
    rep_agreement_date: Optional[str] = None
    refund_type: Optional[str] = None
    rep_fed_tax_id: Optional[str] = None
    rep_tax_payer_number: Optional[float] = None
    tax_email: Optional[str] = None
    tax_fax: Optional[str] = None
    tax_mail_address: Optional[str] = None
    call_to_check: Optional[str] = None
    rep_provided_spreadsheet: Optional[str] = None
    rep_provided_forms: Optional[str] = None
    cust_provided_spreadsheet: Optional[str] = None
    cust_provided_bill_copies: Optional[str] = None
    cust_provided_bank_stmts: Optional[str] = None


class ProviderCreate(ProviderBase):
    rep_id: Optional[int] = None  # Original REP_ID from Excel
    rep_active: Optional[float] = None
    contact_info: Optional[Dict[str, Any]] = None
    performance_metrics: Optional[Dict[str, Any]] = None


class ProviderUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    street_address: Optional[str] = None
    city_state_zip: Optional[str] = None
    rep_phone: Optional[str] = None
    rep_contact: Optional[str] = None
    rep_email: Optional[str] = None
    rep_note: Optional[str] = None
    rep_payment_terms: Optional[str] = None
    rep_agreement_date: Optional[str] = None
    refund_type: Optional[str] = None
    rep_fed_tax_id: Optional[str] = None
    rep_tax_payer_number: Optional[float] = None
    tax_email: Optional[str] = None
    tax_fax: Optional[str] = None
    tax_mail_address: Optional[str] = None
    call_to_check: Optional[str] = None
    rep_provided_spreadsheet: Optional[str] = None
    rep_provided_forms: Optional[str] = None
    cust_provided_spreadsheet: Optional[str] = None
    cust_provided_bill_copies: Optional[str] = None
    cust_provided_bank_stmts: Optional[str] = None
    rep_active: Optional[float] = None
    contact_info: Optional[Dict[str, Any]] = None
    performance_metrics: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None


class ProviderResponse(ProviderBase):
    id: int
    rep_id: Optional[int]
    rep_active: Optional[float]
    contact_info: Optional[Dict[str, Any]]
    performance_metrics: Optional[Dict[str, Any]]
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ProviderWithStats(ProviderResponse):
    account_count: int = 0
    commission_count: int = 0
    total_commission: float = 0.0