from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime


class Account(Base):
    __tablename__ = "accounts"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    esiid = Column(String, unique=True, index=True)
    usage_kwh = Column(Float, default=0)
    last_usage_update = Column(DateTime)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    manager = relationship("Manager", back_populates="accounts")
    provider = relationship("Provider", back_populates="accounts")
    tasks = relationship("Task", back_populates="account")
    commissions = relationship("Commission", back_populates="account") 
