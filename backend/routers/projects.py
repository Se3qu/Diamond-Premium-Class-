from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter(prefix="/projects", tags=["Projects"])

# ✅ Yeni proje oluştur
@router.post("/", response_model=schemas.Project)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db)):
    # code gönderildiyse onu kullan, yoksa otomatik 3 harf
    code = project.code if project.code else (project.name[:3].upper() if project.name else None)

    # code benzersiz mi?
    if code:
        exists = db.query(models.Project).filter(models.Project.code == code).first()
        if exists:
            raise HTTPException(status_code=400, detail=f"Project code already exists: {code}")

    db_project = models.Project(
        name=project.name,
        code=code,
        location=project.location,
        start_date=project.start_date,
        end_date=project.end_date,
        description=project.description
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

# ✅ Tüm projeler
@router.get("/", response_model=list[schemas.Project])
def get_projects(db: Session = Depends(get_db)):
    return db.query(models.Project).all()

# ✅ ID ile tek proje
@router.get("/{project_id}", response_model=schemas.Project)
def get_project_by_id(project_id: int, db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

# ✅ KOD ile tek proje
@router.get("/code/{project_code}", response_model=schemas.Project)
def get_project_by_code(project_code: str, db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.code == project_code).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project
