from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    assignee: Optional[str] = None
    status: Optional[str] = "Belum Dimulai"
    start_date: Optional[date] = None
    is_completed: bool = False
    end_date: Optional[date] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(TaskBase):
    pass

class TaskResponse(TaskBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class TaskLogBase(BaseModel):
    action: str

class TaskLogCreate(TaskLogBase):
    task_id: int

class TaskLogResponse(TaskLogBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True
