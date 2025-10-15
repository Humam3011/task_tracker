from sqlalchemy import Column, Integer, String, Date, Boolean,  DateTime, Enum, ForeignKey, func
from sqlalchemy.orm import relationship
from database import Base

import enum

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

    logs = relationship("TaskLog", back_populates="task", cascade="all, delete")

class TaskLog(Base):
    __tablename__ = "task_logs"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id"))
    action = Column(String(255))
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    task = relationship("Task", back_populates="logs")
