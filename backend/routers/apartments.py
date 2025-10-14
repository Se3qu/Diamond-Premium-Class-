from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
import models, schemas

router = APIRouter(prefix="/apartments", tags=["Apartments"])

# 🔹 Veritabanı bağlantısı
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 🔹 Yeni daire oluşturma
@router.post("/", response_model=schemas.Apartment)
def create_apartment(apartment: schemas.ApartmentCreate, db: Session = Depends(get_db)):
    db_apartment = models.Apartment(**apartment.dict())
    db.add(db_apartment)
    db.commit()
    db.refresh(db_apartment)
    return db_apartment

# 🔹 Tüm daireleri getir
@router.get("/", response_model=list[schemas.Apartment])
def get_apartments(db: Session = Depends(get_db)):
    return db.query(models.Apartment).all()

# 🔹 Daire durumunu güncelle (Boş → Rezerve → Satıldı → Boş)
@router.patch("/{apartment_id}/status", response_model=schemas.Apartment)
def update_apartment_status(apartment_id: int, db: Session = Depends(get_db)):
    apartment = db.query(models.Apartment).filter(models.Apartment.id == apartment_id).first()
    if not apartment:
        raise HTTPException(status_code=404, detail="Apartment not found")

    next_status = {"Boş": "Rezerve", "Rezerve": "Satıldı", "Satıldı": "Boş"}
    apartment.status = next_status.get(apartment.status, "Boş")

    db.commit()
    db.refresh(apartment)
    return apartment

# 🔹 Daire bilgilerini güncelle
@router.patch("/{apartment_id}", response_model=schemas.Apartment)
def update_apartment(apartment_id: int, updated_data: schemas.ApartmentCreate, db: Session = Depends(get_db)):
    apartment = db.query(models.Apartment).filter(models.Apartment.id == apartment_id).first()
    if not apartment:
        raise HTTPException(status_code=404, detail="Apartment not found")

    # Gelen verilerle alanları güncelle
    for key, value in updated_data.dict().items():
        setattr(apartment, key, value)

    db.commit()
    db.refresh(apartment)
    return apartment
