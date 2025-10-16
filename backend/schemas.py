from pydantic import BaseModel
from typing import Optional, List , Dict , Any
from datetime import datetime, date

class UserCreate(BaseModel):
    username: str
    password: str
    role: str

class UserLogin(BaseModel):
    username: str
    password: str

class User(BaseModel):
    id: int
    username: str
    role: str

    class Config:
        orm_mode = True



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
    old_value: Optional[Dict[str, Any]] = None
    new_value: Optional[Dict[str, Any]] = None
    performed_by: Optional[str] = None

class TaskLogCreate(TaskLogBase):
    task_id: int

class TaskLogResponse(TaskLogBase):
    id: int
    task_id: int  # atau Optional[int] kalau kamu ingin toleran
    timestamp: datetime

    class Config:
        from_attributes = True



class TaskLogSchema(BaseModel):
    id: int
    task_id: int
    action: str
    old_value: Optional[dict]
    new_value: Optional[dict]
    performed_by: str     # ubah ke string
    timestamp: datetime

    class Config:
        from_attributes = True  # bukan form_attributes


