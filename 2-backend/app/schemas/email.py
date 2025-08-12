from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime


class EmailDraftBase(BaseModel):
    subject: str
    content: str
    recipient: str
    sender_id: int
    status: str = "draft"


class EmailDraftCreate(EmailDraftBase):
    pass


class EmailDraftUpdate(BaseModel):
    subject: Optional[str] = None
    content: Optional[str] = None
    recipient: Optional[str] = None
    status: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    email_metadata: Optional[Dict[str, Any]] = None


class EmailDraftResponse(EmailDraftBase):
    id: int
    scheduled_at: Optional[datetime] = None
    sent_at: Optional[datetime] = None
    email_metadata: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True 