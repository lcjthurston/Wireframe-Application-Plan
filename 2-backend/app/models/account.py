from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Text
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime


class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)
    account_list_id = Column(String, unique=True, index=True)
    account_name = Column(String, nullable=False, index=True)
    manager_name = Column(String, index=True)
    management_company = Column(String, index=True)
    procurement_status = Column(String, index=True)
    contact_name = Column(String)
    email = Column(String)
    telephone = Column(String)
    fax = Column(String)
    billing_street = Column(Text)
    billing_city = Column(String)
    billing_state = Column(String)
    billing_zip = Column(String)
    legal_name = Column(String)
    fed_tax_id = Column(String)
    customer_type = Column(String)
    usage_kwh = Column(Float)
    load_profile = Column(String)
    max_kva = Column(Float)
    activity_date = Column(String)
    current_activity = Column(String)
    zone_account = Column(String)
    usage_date = Column(String)
    usage_tdsp = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    # Legacy fields for backward compatibility
    name = Column(String)  # Maps to account_name
    esiid = Column(String, index=True)
    last_usage_update = Column(DateTime)
    created_by = Column(Integer, ForeignKey("users.id"))
    manager_id = Column(Integer, ForeignKey("managers.id"))
    provider_id = Column(Integer, ForeignKey("providers.id"))

    # Relationships
    manager = relationship("Manager", back_populates="accounts")
    provider = relationship("Provider", back_populates="accounts")
    tasks = relationship("Task", back_populates="account")
    commissions = relationship("Commission", back_populates="account")
