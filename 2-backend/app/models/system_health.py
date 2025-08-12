from sqlalchemy import Column, Integer, String, DateTime, Text, JSON
from sqlalchemy.sql import func
from app.database import Base


class SystemHealth(Base):
    __tablename__ = "system_health"

    id = Column(Integer, primary_key=True, index=True)
    service_name = Column(String, nullable=False)
    status = Column(String, nullable=False)  # OK, ERROR, WARNING
    last_run = Column(DateTime, nullable=False)
    error_message = Column(Text)
    performance_metrics = Column(JSON)  # Store performance data
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now()) 