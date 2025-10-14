from fastapi import APIRouter
from database import supabase

router = APIRouter(prefix="/work_items", tags=["Work Items"])

@router.get("/")
def get_all_work_items():
    result = supabase.table("work_items").select("*").execute()
    return result.data
