from sqlalchemy import Column, Integer, String, Date, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

# --- Proje Tablosu ---
class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(20), unique=True, nullable=True)  # ✅ Proje kodu eklendi (örnek: DPL2025)
    name = Column(String, nullable=False)
    location = Column(String)
    start_date = Column(Date)
    end_date = Column(Date)
    description = Column(String)

    # Bir projede birden fazla blok olabilir
    blocks = relationship("Block", back_populates="project")


# --- Blok Tablosu ---
class Block(Base):
    __tablename__ = "blocks"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    floor_count = Column(Integer)
    status = Column(String)

    project_id = Column(Integer, ForeignKey("projects.id"))
    project = relationship("Project", back_populates="blocks")

    # Her blokta birden fazla daire olabilir
    apartments = relationship("Apartment", back_populates="block")

    # 🧱 Her blokta birden fazla malzeme olabilir
    materials = relationship("Material", back_populates="block", cascade="all, delete-orphan")


# --- Daire Tablosu ---
class Apartment(Base):
    __tablename__ = "apartments"

    id = Column(Integer, primary_key=True, index=True)
    number = Column(String)
    floor = Column(Integer)
    area_m2 = Column(Integer)
    status = Column(String)

    block_id = Column(Integer, ForeignKey("blocks.id"))
    block = relationship("Block", back_populates="apartments")


# --- Malzeme Tablosu ---
class Material(Base):
    __tablename__ = "materials"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    quantity = Column(Float, nullable=False)
    unit_price = Column(Float, nullable=False)
    total_cost = Column(Float, nullable=False)
    date = Column(Date, nullable=False)
    record_type = Column(String, nullable=False)  # teslimat, kullanım, iade vb.
    block_id = Column(Integer, ForeignKey("blocks.id"), nullable=False)

    block = relationship("Block", back_populates="materials")
