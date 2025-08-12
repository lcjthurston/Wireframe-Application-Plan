from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class Manager(Base):
    __tablename__ = "managers"

    id = Column(Integer, primary_key=True, index=True)
    # Core manager information from MANAGER LIST.xlsx
    mgr_id = Column(Integer, unique=True, index=True)  # Original MGR_ID from Excel
    name = Column(String, nullable=False)  # MANAGER field
    mgr_status = Column(String)  # MGR_STATUS field
    mgr_class = Column(String)  # MGR_CLASS field

    # Company and office information
    management_company = Column(String)  # MGMT CO field (kept for backward compatibility)
    management_company_id = Column(Integer, ForeignKey("management_companies.id"))  # FK to ManagementCompany
    office = Column(String)  # OFFICE field
    office_city = Column(String)  # OFFICE_CITY field
    supervisor = Column(String)  # SUPERVISOR field
    admin_assistant = Column(String)  # ADM_ASST field

    # Contact information
    email = Column(String, index=True)  # EMAIL field (not unique since many are null)
    assistant_email = Column(String)  # ASST_EMAIL field
    phone = Column(String)  # PHONE field
    cell = Column(String)  # CELL field
    fax = Column(String)  # FAX field

    # Additional fields
    mgr_note = Column(Text)  # MGR NOTE field
    last_update = Column(String)  # UDPATE field (keeping as string since format varies)

    # System fields
    is_active = Column(Boolean, default=True)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    management_company_rel = relationship("ManagementCompany", back_populates="managers")
    accounts = relationship("Account", back_populates="manager")
    commissions = relationship("Commission", back_populates="manager")
