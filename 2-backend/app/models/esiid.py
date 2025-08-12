from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Float, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class ESIID(Base):
    __tablename__ = "esiids"

    id = Column(Integer, primary_key=True, index=True)
    
    # Core ESIID information
    esiid_id = Column(Integer, unique=True, index=True)  # ESIID_ID from Excel
    account_name = Column(String, index=True)  # Account_Name field
    esi_id = Column(String, index=True)  # ESI_ID field (the actual ESIID)
    
    # Service address information
    service_address_1 = Column(String)  # SERVICE ADDRESS 1
    service_address_2 = Column(String)  # SERVICE ADDRESS 2
    service_address_3 = Column(String)  # SERVICE ADDRESS 3
    description = Column(Text)  # Description field
    note = Column(Text)  # NOTE field
    status = Column(Float)  # STATUS field
    
    # REP assignments (multiple REPs possible)
    rep = Column(String, index=True)  # REP field
    rep_2 = Column(String)  # REP 2 field
    rep_3 = Column(String)  # REP 3 field
    rep_4 = Column(String)  # REP 4 field
    
    # Account tracking
    old_acct = Column(String)  # OLD_ACCT field
    new_acct = Column(String)  # NEW_ACCT field
    rate_plan = Column(String)  # RATE PLAN field
    esiid_2 = Column(String)  # ESIID 2 field
    
    # Billing dates
    bill_date = Column(String)  # BILL DATE field (keeping as string due to format variety)
    bill_date_2 = Column(DateTime)  # BILL DATE 2 field
    bill_date_3 = Column(DateTime)  # BILL DATE 3 field
    
    # Usage and load information
    lights = Column(Float)  # LIGHTS field
    mo_chg = Column(Float)  # MO CHG field
    mo_lt_chg = Column(Float)  # MO LT CHG field
    base_mo = Column(Float)  # BASE MO field
    kwh_mo = Column(Float, index=True)  # kWh Mo field (monthly usage)
    kwh_yr = Column(Float, index=True)  # kWh Yr field (yearly usage)
    kva = Column(Float)  # KVA field
    load_profile = Column(String)  # Load Profile field
    load = Column(String)  # LOAD field
    zone = Column(String)  # ZONE field
    demand = Column(Float)  # DEMAND field
    demand_2 = Column(Float)  # DEMAND 2 field
    
    # Energy rates and charges
    e_rate_1 = Column(Float)  # E RATE 1 field
    e_rate_1_kwh = Column(Float)  # E RATE 1 KWH field
    e_charge_1 = Column(Float)  # E CHARGE 1 field
    e_rate_2 = Column(Float)  # E RATE 2 field
    e_rate_2_kwh = Column(Integer)  # E RATE 2 KWH field
    e_charge_2 = Column(Float)  # E CHARGE 2 field
    
    # Fuel costs
    old_fuel_cost_r = Column(Float)  # OLD FUEL COST R field
    fuel_cost = Column(Float)  # FUEL COST field
    fuel_f_rate = Column(Float)  # FUEL F RATE field
    fuel_factor = Column(Float)  # FUEL FACTOR field
    
    # Other charges
    other_1 = Column(Float)  # OTHER 1 field
    other_2 = Column(Float)  # OTHER 2 field
    e_chg_tot = Column(Float)  # E CHG TOT field
    avg_e_kwh = Column(Float)  # AVG E KWH field
    
    # TDSP (Transmission and Distribution Service Provider) charges
    tdsp_delivery = Column(Float)  # TDSP DELIVERY field
    tdsp_meter_fee = Column(Float)  # TDSP METER FEE field
    tdsp_on_bill = Column(Float)  # TDSP ON BILL field
    tdsp = Column(Float)  # TDSP field
    e_tdsp_tot = Column(Float)  # E + TDSP TOT field
    avg_etdsp_kwh = Column(Float)  # AVG ETDSP KWH field
    
    # Tax information (current period)
    tax_cnty = Column(Float)  # TAX CNTY field
    tax_city = Column(Float)  # TAX CITY field
    tax_spec = Column(Float)  # TAX SPEC field
    tax_st = Column(Float)  # TAX ST field
    tax_grt = Column(Float)  # TAX GRT field
    tax_puc = Column(Float)  # TAX PUC field
    tax_tot = Column(Float)  # TAX TOT field
    
    # Tax information (period 2)
    tax2_cnty = Column(Float)  # TAX2 CNTY field
    tax2_city = Column(Float)  # TAX2 CITY field
    tax2_spec = Column(Float)  # TAX2 SPEC field
    tax2_st = Column(Float)  # TAX2 ST field
    tax2_grt = Column(Float)  # TAX2 GRT field
    tax2_puc = Column(Float)  # TAX2 PUC field
    tax2_tot = Column(Float)  # TAX2 TOT field
    
    # Recovery and rates
    est_recovery = Column(Float)  # EST_RECOVERY field
    county_rate = Column(Float)  # COUNTY RATE field
    city_rate = Column(Float)  # CITY RATE field
    spec_rate = Column(Float)  # SPEC RATE field
    state_rate = Column(Float)  # STATE RATE field
    grt_rate = Column(Float)  # GRT RATE field
    puc_rate = Column(Float)  # PUC RATE field
    
    # Total billing
    total_bill = Column(Float, index=True)  # TOTAL BILL field
    
    # Foreign key relationships
    account_id = Column(Integer, ForeignKey("accounts.id"))  # Link to Account
    provider_id = Column(Integer, ForeignKey("providers.id"))  # Link to Provider (REP)
    management_company_id = Column(Integer, ForeignKey("management_companies.id"))  # Link to ManagementCompany
    
    # System fields
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    account = relationship("Account", back_populates="esiids")
    provider = relationship("Provider", back_populates="esiids")
    management_company = relationship("ManagementCompany", back_populates="esiids")
