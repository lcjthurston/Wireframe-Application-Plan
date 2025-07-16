from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class EmailDraft(Base):
    __tablename__ = "email_drafts"

    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    recipient = Column(String, nullable=False)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String, default="draft")  # draft, scheduled, sent, failed
    scheduled_at = Column(DateTime)
    sent_at = Column(DateTime)
    email_metadata = Column(JSON)  # Additional email data
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    sender = relationship("User") 