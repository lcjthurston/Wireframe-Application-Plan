from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class ManagementCompany(Base):
    __tablename__ = "management_companies"

    id = Column(Integer, primary_key=True, index=True)
    
    # Core company information from MGMT COMPANIES.xlsx
    mgmt_co_id = Column(Integer, unique=True, index=True)  # Original MGMT_CO_ID from Excel
    mgmt_co_code = Column(String, unique=True, index=True)  # MGMT_CO field (short code)
    company_name = Column(String, nullable=False, index=True)  # MANAGEMENT CO field
    mgmt_status = Column(String)  # MGMT STATUS field
    
    # Contact information
    data_contact = Column(String)  # DATA CONTACT field
    
    # Office address information
    office_street = Column(String)  # OFFICE STREET field
    office_city_state_zip = Column(String)  # OFFICE CITY, STATE, ZIP field
    office_phone = Column(String)  # OFFICE TEL field
    office_fax = Column(String)  # OFFICE FAX field
    
    # Billing address information
    billing_street = Column(String)  # BILLING STREET field
    billing_city = Column(String)  # BILLING CITY field
    billing_state = Column(String)  # BILLING STATE field
    billing_zip = Column(String)  # BILLING ZIP field
    billing_phone = Column(String)  # BILLING TEL field
    billing_fax = Column(String)  # BILLING FAX field
    billing_email = Column(String)  # BILL EMAIL field
    
    # Additional fields
    follow_up = Column(DateTime)  # FOLLOW UP field
    priority = Column(Float)  # PRIORITY field
    
    # System fields
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    managers = relationship("Manager", back_populates="management_company_rel")
    accounts = relationship("Account", back_populates="management_company_rel")
    esiids = relationship("ESIID", back_populates="management_company")
