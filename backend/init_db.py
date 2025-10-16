from database import engine, Base
from models import Task, User, TaskLog  # Tambahkan semua model

print("🔄 Dropping and recreating tables...")
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)
print("✅ Tables recreated successfully!")