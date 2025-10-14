from database import Base, engine
from models import *

print("🧹 Eski tablolar siliniyor...")
Base.metadata.drop_all(bind=engine)
print("✅ Yeni tablolar oluşturuluyor...")
Base.metadata.create_all(bind=engine)
print("🎉 Veritabanı başarıyla sıfırlandı!")
