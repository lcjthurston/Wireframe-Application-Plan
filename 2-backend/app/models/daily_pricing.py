from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey, Index
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class DailyPricing(Base):
    __tablename__ = "daily_pricing"

    id = Column(Integer, primary_key=True, index=True)
    
    # Core pricing information
    pricing_id = Column(Integer, unique=True, index=True)  # ID from Excel
    price_date = Column(DateTime, index=True)  # Price_Date field (when price was set)
    effective_date = Column(DateTime, index=True)  # Date field (when price is effective)
    
    # Geographic and market information
    zone = Column(String, index=True)  # Zone field (COAST, NORTH, SOUTH, WEST, TNMP)
    load_profile = Column(String, index=True)  # Load field (LOW, HIGH, etc.)
    
    # Provider information
    rep = Column(String, index=True)  # REP1 field (energy provider)
    
    # Contract terms
    term_months = Column(Float)  # Term field (contract length in months)
    min_mwh = Column(Float)  # Min_MWh field (minimum usage requirement)
    max_mwh = Column(Float)  # Max_MWh field (maximum usage limit)
    max_meters = Column(Float)  # Max_Meters field (maximum number of meters)
    
    # Pricing rates (in $/MWh or similar units)
    daily_no_ruc = Column(Float, index=True)  # Daily_No_Ruc field (base daily rate without RUC)
    ruc_nodal = Column(Float)  # RUC_Nodal field (Reliability Unit Commitment nodal rate)
    daily_rate = Column(Float, index=True)  # Daily field (final daily rate)
    
    # Discounts and fees
    commercial_discount = Column(Float)  # Com_Disc field (commercial discount)
    hoa_discount = Column(Float)  # HOA_Disc field (HOA/residential discount)
    broker_fee = Column(Float)  # Broker_Fee field (broker commission)
    meter_fee = Column(Float)  # Meter_Fee field (per-meter fee)
    
    # Relationships
    provider_id = Column(Integer, ForeignKey("providers.id"))  # Link to Provider
    
    # System fields
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    provider = relationship("Provider", back_populates="daily_pricing")

    # Indexes for performance
    __table_args__ = (
        Index('idx_pricing_date_zone', 'effective_date', 'zone'),
        Index('idx_pricing_rep_zone', 'rep', 'zone'),
        Index('idx_pricing_date_rep', 'effective_date', 'rep'),
        Index('idx_pricing_rate_zone', 'daily_rate', 'zone'),
    )
