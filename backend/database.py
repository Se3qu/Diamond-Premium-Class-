import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from supabase import create_client, Client

# .env dosyasını yükle
load_dotenv()

# -------------------------------------------------------------
# 🧱 LOCAL DATABASE (PostgreSQL - development mode)
# -------------------------------------------------------------
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg2://postgres:kusto123@localhost:5432/project_db")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """FastAPI'de bağımlılık olarak kullanılacak veritabanı oturumu."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -------------------------------------------------------------
# ☁️ SUPABASE (Cloud - production mode)
# -------------------------------------------------------------
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client | None = None

if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("✅ Supabase connection initialized successfully.")
    except Exception as e:
        print("⚠️ Supabase connection failed:", e)
else:
    print("ℹ️ Supabase environment variables not found (.env missing SUPABASE_URL / SUPABASE_KEY).")

# -------------------------------------------------------------
# 🔍 Bağlantı durumunu kontrol et
# -------------------------------------------------------------
if engine:
    print("✅ Local PostgreSQL engine ready at:", DATABASE_URL)
