from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from sqlalchemy.orm import Session
from utils.security import hash_password, verify_password
from database import get_db
import models
import jwt

router = APIRouter(prefix="/auth", tags=["Auth"])

SECRET_KEY = "your-secret-key"  # Ganti dengan secret yang aman
security = HTTPBearer()


# --- Request Models ---
class UserCreate(BaseModel):
    username: str
    password: str
    role: str

class UserLogin(BaseModel):
    username: str
    password: str

# --- Register ---
@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    if user.role not in ["PM", "Karyawan"]:
        raise HTTPException(status_code=400, detail="Role tidak valid")

    if len(user.password.encode("utf-8")) > 72:
        raise HTTPException(status_code=400, detail="Password terlalu panjang (maksimal 72 karakter)")

    existing = db.query(models.User).filter(models.User.username == user.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username sudah digunakan")

    new_user = models.User(
        username=user.username,
        hashed_password=hash_password(user.password),
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "Registrasi berhasil"}

# --- Login ---
@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Username atau password salah")

    token = jwt.encode({"sub": db_user.username}, SECRET_KEY, algorithm="HS256")
    return {"access_token": token, "role": db_user.role}

# --- Get Current User ---
def get_current_user(
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials  # ⬅️ Ambil token dari objek

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        username = payload.get("sub")
        if not username:
            raise HTTPException(status_code=401, detail="Token tidak valid")

        user = db.query(models.User).filter(models.User.username == username).first()
        if not user:
            raise HTTPException(status_code=401, detail="User tidak ditemukan")

        return user

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token sudah kadaluarsa")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token tidak valid")


# --- Role-Based Access ---
def require_pm(user=Depends(get_current_user)):
    if user.role != "PM":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Hanya PM yang boleh mengakses fitur ini"
        )
    return user

# --- Get User Info ---
@router.get("/me")
def get_me(user=Depends(get_current_user)):
    return {
        "username": user.username,
        "role": user.role
    }