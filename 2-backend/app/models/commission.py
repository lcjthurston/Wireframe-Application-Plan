from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Numeric, JSON, Boolean, Float, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class Commission(Base):
    __tablename__ = "commissions"

    id = Column(Integer, primary_key=True, index=True)

    # Core commission information
    commission_sched_id = Column(Integer, unique=True, index=True)  # COMM_SCHED_ID from Excel
    account_name = Column(String, index=True)  # Acct_Name field
    k_rep = Column(String, index=True)  # K_REP field (provider)

    # Commission type (received vs scheduled)
    commission_type = Column(String, nullable=False, index=True)  # 'received' or 'scheduled'

    # For RECEIVED commissions
    actual_payment_amount = Column(Numeric(12, 2))  # Act_PYMT_Amt field
    actual_payment_received = Column(Numeric(12, 2))  # Act_PYMT_Recvd field
    actual_payment_date = Column(DateTime)  # Act_PYMT_Date field
    actual_mils = Column(Float)  # Act_Mils field
    payment_type = Column(String)  # Pymt_Type field

    # For SCHEDULED commissions
    contract_date = Column(DateTime)  # Con_Date field
    start_date = Column(DateTime)  # Start field
    end_date = Column(DateTime)  # End field
    is_active = Column(Boolean, default=True)  # Active field
    is_currently_active = Column(Boolean)  # CActive field
    annual_amount = Column(String)  # Annual field
    contracted_amount = Column(String)  # Contracted field

    # Monthly commission amounts (storing as JSON for flexibility)
    monthly_scheduled = Column(JSON)  # All the monthly columns (Jan 25, Feb 25, etc.)
    monthly_received = Column(JSON)  # All the monthly R columns (Jan 25 R, Feb 25 R, etc.)

    # Legacy fields for backward compatibility
    manager_id = Column(Integer, ForeignKey("managers.id"))
    account_id = Column(Integer, ForeignKey("accounts.id"))
    provider_id = Column(Integer, ForeignKey("providers.id"))  # Link to provider
    amount = Column(Numeric(10, 2))  # Legacy amount field
    status = Column(String, default="pending")  # pending, approved, paid, cancelled
    payment_date = Column(DateTime)  # Legacy payment date
    notes = Column(Text)
    commission_metadata = Column(JSON)  # Additional commission data

    # System fields
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    manager = relationship("Manager", back_populates="commissions")
    account = relationship("Account", back_populates="commissions")
    provider = relationship("Provider", back_populates="commissions")