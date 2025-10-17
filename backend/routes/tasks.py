from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from database import get_db
from models import Task, TaskLog
from schemas import TaskCreate, TaskUpdate, TaskResponse, TaskLogResponse, TaskLogSchema
from typing import List, Optional
from routes.auth import get_current_user
from datetime import datetime, date
from routes.logs import log_task
import models, schemas , database
import json

router = APIRouter(prefix="/tasks", tags=["Tasks"])


def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    return str(obj)

def safe_json(data: dict):
    try:
        return json.loads(json.dumps(data, default=serialize))
    except Exception as e:
        print("❌ JSON serialization error:", e)
        return {"error": "serialization failed"}

# ✅ Logging aktivitas
def log_task(
    db: Session,
    task_id: Optional[int],
    action: str,
    old_value: Optional[dict],
    new_value: Optional[dict],
    performed_by: str,
    user_id: Optional[int] = None
):
    # 🔍 Validasi awal
    if task_id is None:
        print("❌ Gagal mencatat log: task_id kosong")
        raise HTTPException(status_code=500, detail="task_id tidak boleh kosong saat mencatat log")

    # 📘 Debug awal
    print(f"📘 log_task dipanggil")
    print(f"🔹 task_id       = {task_id}")
    print(f"🔹 action        = {action}")
    print(f"🔹 performed_by  = {performed_by}")
    print(f"🔹 user_id       = {user_id}")
    print(f"🔹 old_value     = {old_value}")
    print(f"🔹 new_value     = {new_value}")

    try:
       
        serialized_old = safe_json(old_value) if old_value else None
        serialized_new = safe_json(new_value) if new_value else None

        print(f"📦 serialized_old_value = {serialized_old}")
        print(f"📦 serialized_new_value = {serialized_new}")

        
        log = TaskLog(
            task_id=task_id,
            action=action,
            old_value=serialized_old,
            new_value=serialized_new,
            performed_by=performed_by,
            user_id=user_id,
            timestamp=datetime.utcnow()
        )

        print(f"📝 Menyimpan log: {log}")
        db.add(log)
        db.commit()
        print("✅ Log berhasil disimpan")

    except Exception as e:
        db.rollback()
        print("❌ Gagal mencatat log:", e)
        raise HTTPException(status_code=500, detail="Gagal mencatat log aktivitas")


@router.get("/logs/orphan")
def get_orphan_logs(db: Session = Depends(get_db)):
    return db.query(TaskLog).filter(TaskLog.task_id == None).all()


# Create task
@router.post("/", response_model=TaskResponse)
def create_task(task: TaskCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_task = Task(**task.dict())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    print("🆕 Task dibuat dengan ID:", db_task.id)


    log_task(
        db,
        task_id=db_task.id,  
        action="create",
        old_value=None,
        new_value=task.dict(),
        performed_by=current_user.username,
        user_id=current_user.id
    )

    return db_task

# Task yang sedang aktif
@router.get("/", response_model=List[TaskResponse])
def get_active_tasks(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(Task).filter(Task.status.in_(["Belum Dimulai", "Sedang Dikerjakan", "Selesai"])).all()

# Mengambil task dari id
@router.get("/{task_id}", response_model=TaskResponse)
def get_task(task_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task tidak ditemukan")
    return task

# Edit task
@router.put("/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, updated_task: TaskUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task tidak ditemukan")

    old_data = {k: getattr(task, k) for k in updated_task.dict(exclude_unset=True).keys()}
    new_data = updated_task.dict(exclude_unset=True)

    for key, value in new_data.items():
        setattr(task, key, value)

    db.commit()
    db.refresh(task)

    # Catat perubahan status sebagai log khusus
    if "status" in new_data and old_data.get("status") != new_data["status"]:
        log_task(
            db,
            task.id,
            "status_change",
            old_value={"status": old_data.get("status")},
            new_value={"status": new_data["status"]},
            performed_by=current_user.username,
            user_id=current_user.id
        )

    # Catat update umum
    log_task(
        db,
        task.id,
        "update",
        old_value=old_data,
        new_value=new_data,
        performed_by=current_user.username,
        user_id=current_user.id
    )

    return task

# Hapus Task
@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    old_value = task.__dict__.copy()


    log_task(db, task_id=task.id, action="delete", performed_by=current_user.username, user_id=current_user.id, old_value=old_value, new_value=None)



    db.delete(task)
    db.commit()

    return {"message": "Task deleted successfully"}





# ✅ Ambil semua log
@router.get("/all/logs", response_model=List[TaskLogResponse])
def get_task_logs(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    logs = (
        db.query(TaskLog)
        .order_by(TaskLog.timestamp.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return logs


# ✅ Ambil riwayat log berdasarkan task_id
@router.get("/task/{task_id}/history", response_model=List[TaskLogSchema])
def get_task_history(
    task_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    logs = (
        db.query(TaskLog)
        .filter(TaskLog.task_id == task_id)
        .order_by(TaskLog.timestamp.desc())
        .all()
    )
    return logs
