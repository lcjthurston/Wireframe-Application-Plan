from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Numeric, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class Commission(Base):
    __tablename__ = "commissions"

    id = Column(Integer, primary_key=True, index=True)
    manager_id = Column(Integer, ForeignKey("managers.id"), nullable=False)
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    commission_type = Column(String, nullable=False)  # new_account, renewal, upsell
    status = Column(String, default="pending")  # pending, approved, paid, cancelled
    payment_date = Column(DateTime)
    notes = Column(String)
    metadata = Column(JSON)  # Additional commission data
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    manager = relationship("Manager", back_populates="commissions")
    account = relationship("Account", back_populates="commissions") 