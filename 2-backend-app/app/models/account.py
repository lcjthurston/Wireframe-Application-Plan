from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    account_number = Column(String, unique=True, index=True, nullable=False)
    manager_id = Column(Integer, ForeignKey("managers.id"))
    provider_id = Column(Integer, ForeignKey("providers.id"))
    status = Column(String, default="active")  # active, inactive, pending
    usage_data = Column(JSON)  # Store usage data from Centerpoint
    pricing_data = Column(JSON)  # Store pricing information
    contract_data = Column(JSON)  # Store contract details
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    manager = relationship("Manager", back_populates="accounts")
    provider = relationship("Provider", back_populates="accounts")
    tasks = relationship("Task", back_populates="account")
    commissions = relationship("Commission", back_populates="account") 