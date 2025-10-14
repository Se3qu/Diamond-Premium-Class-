from database import SessionLocal
import models

db = SessionLocal()

project = db.query(models.Project).filter(models.Project.code == "DIA").first()


if not project:
    print("❌ Önce proje eklenmeli!")
else:
    blocks = [
        models.Block(name="A", floor_count=9, status="In Progress", project_id=project.id),
        models.Block(name="B", floor_count=9, status="Planned", project_id=project.id),
        models.Block(name="C", floor_count=9, status="Not Started", project_id=project.id),
        models.Block(name="D", floor_count=9, status="Not Started", project_id=project.id),
    ]
    db.add_all(blocks)
    db.commit()
    print("✅ 4 blok başarıyla eklendi!")
