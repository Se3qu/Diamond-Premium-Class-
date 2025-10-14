from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from routers import projects, blocks, apartments, materials, work_items

# ---------------------------------------------------------------
# 🧱 Veritabanı tablolarını oluştur (Local test için)
# ---------------------------------------------------------------
Base.metadata.create_all(bind=engine)

# ---------------------------------------------------------------
# ⚙️ FastAPI Uygulaması
# ---------------------------------------------------------------
app = FastAPI(
    title="Construction Dashboard",
    description="AI destekli inşaat proje yönetim sistemi",
    version="2.0"
)

# ---------------------------------------------------------------
# 🌐 CORS (Frontend bağlantısı için)
# ---------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Gerekirse localhost:5173 olarak sınırlandırılabilir
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------
# 🔌 Router'ları bağla
# ---------------------------------------------------------------
app.include_router(projects.router)
app.include_router(blocks.router)
app.include_router(apartments.router)
app.include_router(materials.router)
app.include_router(work_items.router)  # ✅ Yeni eklendi: İş kalemleri (work_items)

# ---------------------------------------------------------------
# 🔍 Test endpoint
# ---------------------------------------------------------------
@app.get("/api/test", tags=["System"])
def test_connection():
    return {"status": "success", "message": "Frontend ile bağlantı başarılı!"}

# ---------------------------------------------------------------
# 🏠 Root endpoint
# ---------------------------------------------------------------
@app.get("/", tags=["System"])
def root():
    return {"message": "✅ Backend başarıyla çalışıyor!"}
