from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    task_type: str
    priority: str = "medium"
    status: str = "pending"
    assigned_to: Optional[int] = None
    account_id: Optional[int] = None
    due_date: Optional[datetime] = None


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    task_type: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    assigned_to: Optional[int] = None
    account_id: Optional[int] = None
    due_date: Optional[datetime] = None
    completed_at: Optional[datetime] = None


class TaskResponse(TaskBase):
    id: int
    completed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True 