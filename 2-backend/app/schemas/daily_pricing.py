from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class DailyPricingBase(BaseModel):
    zone: Optional[str] = None
    load_profile: Optional[str] = None
    rep: Optional[str] = None
    term_months: Optional[float] = None
    min_mwh: Optional[float] = None
    max_mwh: Optional[float] = None
    max_meters: Optional[float] = None
    daily_no_ruc: Optional[float] = None
    ruc_nodal: Optional[float] = None
    daily_rate: Optional[float] = None
    commercial_discount: Optional[float] = None
    hoa_discount: Optional[float] = None
    broker_fee: Optional[float] = None
    meter_fee: Optional[float] = None


class DailyPricingCreate(DailyPricingBase):
    pricing_id: Optional[int] = None
    price_date: Optional[datetime] = None
    effective_date: Optional[datetime] = None
    provider_id: Optional[int] = None


class DailyPricingUpdate(BaseModel):
    zone: Optional[str] = None
    load_profile: Optional[str] = None
    rep: Optional[str] = None
    term_months: Optional[float] = None
    min_mwh: Optional[float] = None
    max_mwh: Optional[float] = None
    max_meters: Optional[float] = None
    daily_no_ruc: Optional[float] = None
    ruc_nodal: Optional[float] = None
    daily_rate: Optional[float] = None
    commercial_discount: Optional[float] = None
    hoa_discount: Optional[float] = None
    broker_fee: Optional[float] = None
    meter_fee: Optional[float] = None
    price_date: Optional[datetime] = None
    effective_date: Optional[datetime] = None
    provider_id: Optional[int] = None
    is_active: Optional[bool] = None


class DailyPricingResponse(DailyPricingBase):
    id: int
    pricing_id: Optional[int]
    price_date: Optional[datetime]
    effective_date: Optional[datetime]
    provider_id: Optional[int]
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class DailyPricingSummary(BaseModel):
    id: int
    effective_date: Optional[datetime]
    zone: Optional[str]
    rep: Optional[str]
    load_profile: Optional[str]
    daily_rate: Optional[float]
    term_months: Optional[float]
    is_active: bool


class PricingStats(BaseModel):
    total_pricing_records: int
    unique_zones: int
    unique_reps: int
    date_range_start: Optional[datetime]
    date_range_end: Optional[datetime]
    avg_daily_rate: float
    min_daily_rate: float
    max_daily_rate: float


class ZonePricingComparison(BaseModel):
    zone: str
    avg_rate: float
    min_rate: float
    max_rate: float
    record_count: int


class RepPricingAnalysis(BaseModel):
    rep: str
    avg_rate: float
    min_rate: float
    max_rate: float
    record_count: int
    zones_served: int
