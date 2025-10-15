from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, tasks

app = FastAPI()

# ✅ Izinkan frontend React mengakses backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # frontend React (Vite)
        "http://127.0.0.1:5173",  # kadang React pakai IP ini
    ],
    allow_credentials=True,
    allow_methods=["*"],  # izinkan semua metode (GET, POST, PUT, DELETE)
    allow_headers=["*"],  # izinkan semua header
)

# Router
app.include_router(auth.router)
app.include_router(tasks.router)
