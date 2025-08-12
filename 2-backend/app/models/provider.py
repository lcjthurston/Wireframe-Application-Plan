from sqlalchemy import Column, Integer, String, Boolean, DateTime, JSON, Text, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class Provider(Base):
    __tablename__ = "providers"

    id = Column(Integer, primary_key=True, index=True)

    # Core provider information from REP.xlsx
    rep_id = Column(Integer, unique=True, index=True)  # Original REP_ID from Excel
    name = Column(String, nullable=False, index=True)  # REP field
    type = Column(String, default="electricity")  # electricity, gas, water, etc.

    # Address information
    street_address = Column(String)  # STREET ADDRESS field
    city_state_zip = Column(String)  # CITY ST ZIP field

    # Contact information
    rep_phone = Column(String)  # REP_PHONE field
    rep_contact = Column(String)  # REP_CONTACT field
    rep_email = Column(String)  # REP_EMAIL field

    # Business information
    rep_note = Column(Text)  # REP_NOTE field
    rep_payment_terms = Column(String)  # REP_PYMT_TERMS field
    rep_agreement_date = Column(String)  # REP_AGMT_DATE field (keeping as string due to format variety)
    refund_type = Column(String)  # REFUND_TYPE field

    # Tax information
    rep_fed_tax_id = Column(String)  # REP_FED_TAX_ID field
    rep_tax_payer_number = Column(Float)  # REP_TAX_PAYER_NUMBER field
    tax_email = Column(String)  # TAX_EMAIL field
    tax_fax = Column(String)  # TAX_FAX field
    tax_mail_address = Column(String)  # TAX_MAIL _ADDRESS field

    # Process tracking
    call_to_check = Column(String)  # CALL_TO_CHECK field
    rep_provided_spreadsheet = Column(String)  # REP_PROVIDED_SPREADSHEET field
    rep_provided_forms = Column(String)  # REP_PROVIDED_FORMS field
    cust_provided_spreadsheet = Column(String)  # CUST_PROVIDED_SPREADSHEET field
    cust_provided_bill_copies = Column(String)  # CUST_PROVIDED_BILL_COPIES field
    cust_provided_bank_stmts = Column(String)  # CUST_PROVIDED_BANK_STMTS field

    # Legacy fields (for backward compatibility)
    contact_info = Column(JSON)  # Store additional contact information
    performance_metrics = Column(JSON)  # Store performance data

    # System fields
    rep_active = Column(Float)  # REP_ACTIVE field from Excel
    is_active = Column(Boolean, default=True)  # System active flag
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    accounts = relationship("Account", back_populates="provider")
    commissions = relationship("Commission", back_populates="provider")
    esiids = relationship("ESIID", back_populates="provider")
    daily_pricing = relationship("DailyPricing", back_populates="provider")