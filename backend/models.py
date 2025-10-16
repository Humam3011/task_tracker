from sqlalchemy import Column, Integer, String, Date, Boolean, JSON , DateTime, Enum, ForeignKey, func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime
from database import Base

import enum
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False)  # 'PM' atau 'Karyawan'

class TaskStatus(str, enum.Enum):
    belum_dimulai = "Belum Dimulai"
    sedang_dikerjakan = "Sedang Dikerjakan"
    selesai = "Selesai"

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    description = Column(String)
    assignee = Column(String(100))
    status = Column(Enum(TaskStatus), default=TaskStatus.belum_dimulai)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    start_date = Column(Date)
    end_date = Column(Date)
    is_completed = Column(Boolean, default=False)

    logs = relationship("TaskLog", back_populates="task", cascade="all, delete-orphan")

class TaskLog(Base):
    __tablename__ = "task_logs"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=False)
    action = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"))
    old_value = Column(JSON, nullable=True)
    new_value = Column(JSON, nullable=True)
    performed_by = Column(String, nullable=False)

    task = relationship("Task", back_populates="logs")




