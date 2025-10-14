from pydantic import BaseModel
from datetime import date
from typing import Optional, List


# --- Block Şeması ---
class Block(BaseModel):
    id: int
    name: str
    floor_count: Optional[int] = None
    status: Optional[str] = None

    class Config:
        from_attributes = True


# --- Apartment Şemaları ---
class ApartmentBase(BaseModel):
    number: str
    floor: Optional[int] = None
    area: Optional[float] = None
    status: Optional[str] = None


class ApartmentCreate(ApartmentBase):
    block_id: int  # ✅ yeni daire oluştururken bağlı blok belirtilmeli


class Apartment(ApartmentBase):
    id: int
    block_id: int

    class Config:
        from_attributes = True


# --- Material Şemaları ---
class MaterialBase(BaseModel):
    name: str
    quantity: Optional[float] = None
    unit: Optional[str] = None


class MaterialCreate(MaterialBase):
    block_id: int


class Material(MaterialBase):
    id: int
    block_id: int

    class Config:
        from_attributes = True


# --- Project Şemaları ---
class ProjectBase(BaseModel):
    name: str
    location: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    description: Optional[str] = None


class ProjectCreate(ProjectBase):
    code: Optional[str] = None  # manuel girilirse kabul eder


class Project(ProjectBase):
    id: int
    code: Optional[str] = None
    blocks: List[Block] = []

    class Config:
        from_attributes = True

from pydantic import BaseModel

class ApartmentBase(BaseModel):
    number: str
    floor: int
    area_m2: float
    status: str
    block_id: int

class ApartmentCreate(ApartmentBase):
    pass

class Apartment(ApartmentBase):
    id: int

    class Config:
        orm_mode = True
