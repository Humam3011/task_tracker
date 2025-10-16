from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import TaskLog
from typing import List

from schemas import TaskLogCreate, TaskLogResponse
from routes.auth import get_current_user  # Untuk autentikasi

router = APIRouter(prefix="/logs", tags=["logs"])

@router.post("/", response_model=TaskLogResponse)
def create_log(log: TaskLogCreate, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    new_log = TaskLog(
        task_id=log.task_id,
        action=log.action,
        performed_by=current_user,  # Dari autentikasi
        old_value=log.old_value,
        new_value=log.new_value
    )
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return new_log

@router.get("/task/{task_id}", response_model=List[TaskLogResponse])
def get_logs_for_task(task_id: int, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    logs = db.query(TaskLog).filter(TaskLog.task_id == task_id).order_by(TaskLog.timestamp.desc()).all()
    if not logs:
        raise HTTPException(status_code=404, detail="No logs found for this task")
    return logs

def log_task(db: Session, task_id: int, action: str, performed_by: str, user_id: int, old_value=None, new_value=None):
    serialized_old_value = serialize_task(old_value) if old_value else None
    serialized_new_value = serialize_task(new_value) if new_value else None

    log = models.TaskLog(
        task_id=task_id,
        action=action,
        performed_by=performed_by,
        user_id=user_id,
        old_value=serialized_old_value,
        new_value=serialized_new_value
    )

    db.add(log)
    db.commit()
    db.refresh(log)
    return log
