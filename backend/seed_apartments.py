from database import SessionLocal
import models

# 🔹 Veritabanı oturumu başlat
db = SessionLocal()

# 🔹 Blokları getir
blocks = db.query(models.Block).all()

if not blocks:
    print("❌ Önce bloklar eklenmeli!")
else:
    total = 0
    for block in blocks:
        for floor in range(1, (block.floor_count or 9) + 1):  # Kat sayısı yoksa 9 varsay
            for number in range(1, 5):  # Her katta 4 daire
                apartment = models.Apartment(
                    block_id=block.id,
                    floor=floor,
                    number=number,
                    area_m2=75 + (number * 5),  # örnek: 80, 85, 90, 95 m²
                    status="Boş"  # varsayılan durum
                )
                db.add(apartment)
                total += 1

    db.commit()
    print(f"✅ {total} daire başarıyla eklendi!")

db.close()
