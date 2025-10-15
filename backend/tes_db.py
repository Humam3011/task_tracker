import psycopg2

conn = None  # tambahkan ini di awal

try:
    conn = psycopg2.connect(
        dbname="task_tracker",
        user="postgres",
        password="301103",  # ganti sesuai password pgAdmin kamu
        host="localhost",
        port="5432"
    )
    print("✅ Koneksi ke PostgreSQL berhasil!")
except Exception as e:
    print("❌ Gagal konek ke database:", e)
finally:
    if conn is not None:
        conn.close()
