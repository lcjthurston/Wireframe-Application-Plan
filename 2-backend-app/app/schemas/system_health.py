from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime


class SystemHealthBase(BaseModel):
    service_name: str
    status: str
    last_run: datetime
    error_message: Optional[str] = None
    performance_metrics: Optional[Dict[str, Any]] = None


class SystemHealthCreate(SystemHealthBase):
    pass


class SystemHealthResponse(SystemHealthBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True 