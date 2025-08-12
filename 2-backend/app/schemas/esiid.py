from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ESIIDBase(BaseModel):
    account_name: Optional[str] = None
    esi_id: Optional[str] = None
    service_address_1: Optional[str] = None
    service_address_2: Optional[str] = None
    service_address_3: Optional[str] = None
    description: Optional[str] = None
    note: Optional[str] = None
    status: Optional[float] = None
    rep: Optional[str] = None
    rep_2: Optional[str] = None
    rep_3: Optional[str] = None
    rep_4: Optional[str] = None
    old_acct: Optional[str] = None
    new_acct: Optional[str] = None
    rate_plan: Optional[str] = None
    kwh_mo: Optional[float] = None
    kwh_yr: Optional[float] = None
    load_profile: Optional[str] = None
    load: Optional[str] = None
    zone: Optional[str] = None
    total_bill: Optional[float] = None


class ESIIDCreate(ESIIDBase):
    esiid_id: Optional[int] = None
    # Include all the detailed billing fields for import
    bill_date: Optional[str] = None
    bill_date_2: Optional[datetime] = None
    bill_date_3: Optional[datetime] = None
    lights: Optional[float] = None
    mo_chg: Optional[float] = None
    mo_lt_chg: Optional[float] = None
    base_mo: Optional[float] = None
    kva: Optional[float] = None
    demand: Optional[float] = None
    demand_2: Optional[float] = None
    e_rate_1: Optional[float] = None
    e_rate_1_kwh: Optional[float] = None
    e_charge_1: Optional[float] = None
    e_rate_2: Optional[float] = None
    e_rate_2_kwh: Optional[int] = None
    e_charge_2: Optional[float] = None
    fuel_cost: Optional[float] = None
    tdsp_delivery: Optional[float] = None
    tdsp_meter_fee: Optional[float] = None
    tdsp: Optional[float] = None
    tax_tot: Optional[float] = None
    county_rate: Optional[float] = None
    city_rate: Optional[float] = None
    state_rate: Optional[float] = None


class ESIIDUpdate(BaseModel):
    account_name: Optional[str] = None
    esi_id: Optional[str] = None
    service_address_1: Optional[str] = None
    service_address_2: Optional[str] = None
    service_address_3: Optional[str] = None
    description: Optional[str] = None
    note: Optional[str] = None
    status: Optional[float] = None
    rep: Optional[str] = None
    kwh_mo: Optional[float] = None
    kwh_yr: Optional[float] = None
    load_profile: Optional[str] = None
    load: Optional[str] = None
    zone: Optional[str] = None
    total_bill: Optional[float] = None
    account_id: Optional[int] = None
    provider_id: Optional[int] = None
    management_company_id: Optional[int] = None
    is_active: Optional[bool] = None


class ESIIDResponse(ESIIDBase):
    id: int
    esiid_id: Optional[int]
    account_id: Optional[int]
    provider_id: Optional[int]
    management_company_id: Optional[int]
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class ESIIDWithDetails(ESIIDResponse):
    # Additional fields for detailed view
    bill_date: Optional[str]
    lights: Optional[float]
    mo_chg: Optional[float]
    base_mo: Optional[float]
    kva: Optional[float]
    demand: Optional[float]
    e_rate_1: Optional[float]
    e_charge_1: Optional[float]
    fuel_cost: Optional[float]
    tdsp_delivery: Optional[float]
    tdsp_meter_fee: Optional[float]
    tdsp: Optional[float]
    tax_tot: Optional[float]
    county_rate: Optional[float]
    city_rate: Optional[float]
    state_rate: Optional[float]


class ESIIDSummary(BaseModel):
    id: int
    esi_id: Optional[str]
    account_name: Optional[str]
    service_address_1: Optional[str]
    rep: Optional[str]
    kwh_mo: Optional[float]
    kwh_yr: Optional[float]
    total_bill: Optional[float]
    load_profile: Optional[str]
    zone: Optional[str]
    is_active: bool
