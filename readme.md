# 📋 Task Tracker Web App

Task Tracker adalah aplikasi manajemen tugas berbasis web yang dirancang untuk membantu pengguna mengatur, melacak, dan menyelesaikan tugas harian secara efisien. Dibangun dengan arsitektur modern menggunakan **React.js** di frontend dan **FastAPI** di backend, serta **PostgreSQL** sebagai basis data utama.

## 🚀 Fitur Utama

- ✅ Tambah, edit, dan hapus tugas
- 📌 Tandai tugas sebagai selesai
- 🔍 Filter tugas berdasarkan status
- 🔐 Autentikasi pengguna (Login & Register)
- 📊 Dashboard tugas dan riwayat aktivitas
- 🔄 Sinkronisasi data antara frontend dan backend

## 🛠️ Teknologi yang Digunakan

| Layer      | Teknologi                          |
|------------|------------------------------------|
| Frontend   | React.js, Vite, Bootstrap, CSS3    |
| Backend    | FastAPI (Python), Alembic          |
| Database   | PostgreSQL                         |
| API Docs   | Swagger UI (otomatis dari FastAPI) |


## ⚙️ Instalasi & Menjalankan Proyek

https://github.com/Humam3011/task_tracker.git

### 1. Backend dan Frontend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn main:app --reload


### Frontend

cd frontend
npm install
npm run dev

 
