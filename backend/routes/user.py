from fastapi import APIRouter, Depends
from database import get_db


router = APIRouter(prefix="/users", tags=["users"])

@router.get("")
async def list_users(db=Depends(get_db)):
  pass

@router.get("/{id}")
async def get_user(id: int, db = Depends(get_db)):
  pass
