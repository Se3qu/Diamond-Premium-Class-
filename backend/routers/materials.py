from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter()

# 🧱 Yeni malzeme ekleme
@router.post("/materials/", response_model=schemas.Material, tags=["Materials"])
def create_material(material: schemas.MaterialCreate, db: Session = Depends(get_db)):
    # Blok kontrolü
    block = db.query(models.Block).filter(models.Block.id == material.block_id).first()
    if not block:
        raise HTTPException(status_code=404, detail="Blok bulunamadı.")

    db_material = models.Material(
        name=material.name,
        quantity=material.quantity,
        unit_price=material.unit_price,
        total_cost=material.quantity * material.unit_price,
        date=material.date,
        record_type=material.record_type,
        block_id=material.block_id,
    )

    db.add(db_material)
    db.commit()
    db.refresh(db_material)
    return db_material


# 📋 Belirli bir bloktaki tüm malzemeleri listele
@router.get("/materials/{block_id}", response_model=list[schemas.Material], tags=["Materials"])
def get_materials(block_id: int, db: Session = Depends(get_db)):
    return db.query(models.Material).filter(models.Material.block_id == block_id).all()
