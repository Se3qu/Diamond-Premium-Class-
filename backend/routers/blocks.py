from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models

router = APIRouter(prefix="/blocks", tags=["Blocks"])

# ✅ Belirli bir projeye ait blokları getir
@router.get("/project/{project_code}")
def get_blocks_by_project(project_code: str, db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.code == project_code).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    blocks = db.query(models.Block).filter(models.Block.project_id == project.id).all()
    return [
        {"id": b.id, "name": b.name, "floor_count": b.floor_count, "status": b.status}
        for b in blocks
    ]


# ✅ Belirli bir bloğa ait daireleri getir
@router.get("/{block_id}/apartments")
def get_apartments_by_block(block_id: int, db: Session = Depends(get_db)):
    block = db.query(models.Block).filter(models.Block.id == block_id).first()
    if not block:
        raise HTTPException(status_code=404, detail="Block not found")

    apartments = db.query(models.Apartment).filter(models.Apartment.block_id == block_id).all()
    return [
        {"id": a.id, "number": a.number, "floor": a.floor, "area_m2": a.area_m2, "status": a.status}
        for a in apartments
    ]


# ✅ YENİ: Blok ilerleme bilgisi (Boş, Rezerve, Satıldı sayıları)
@router.get("/progress")
def get_block_progress(db: Session = Depends(get_db)):
    """
    Her blok için toplam daire sayısı, duruma göre dağılım
    (Boş / Rezerve / Satıldı) ve doluluk yüzdesini döndürür.
    """
    blocks = db.query(models.Block).all()
    progress_data = []

    for block in blocks:
        apartments = db.query(models.Apartment).filter(models.Apartment.block_id == block.id).all()
        total = len(apartments)
        empty = len([a for a in apartments if a.status == "Boş"])
        reserved = len([a for a in apartments if a.status == "Rezerve"])
        sold = len([a for a in apartments if a.status == "Satıldı"])

        progress = {
            "block_id": block.id,
            "block_name": block.name,
            "total": total,
            "boş": empty,
            "rezerve": reserved,
            "satıldı": sold,
            "doluluk_yüzdesi": round(((reserved + sold) / total) * 100, 2) if total > 0 else 0
        }
        progress_data.append(progress)

    return progress_data
