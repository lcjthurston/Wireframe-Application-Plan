from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    task_type = Column(String, nullable=False)  # provider_selection, super_flagged, email_draft, new_account
    priority = Column(String, default="medium")  # low, medium, high, urgent
    status = Column(String, default="pending")  # pending, in_progress, completed, cancelled
    assigned_to = Column(Integer, ForeignKey("users.id"))
    account_id = Column(Integer, ForeignKey("accounts.id"))
    due_date = Column(DateTime)
    completed_at = Column(DateTime)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    assigned_user = relationship("User")
    account = relationship("Account", back_populates="tasks") 