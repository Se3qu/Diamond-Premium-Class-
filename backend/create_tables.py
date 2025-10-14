from database import Base, engine
from models import Project

print("Tablolar oluşturuluyor...")
Base.metadata.create_all(bind=engine)
print("✅ Tamamlandı!")
