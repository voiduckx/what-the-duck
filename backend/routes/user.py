from fastapi import APIRouter, Depends
from sqlalchemy import select
from schemas.user import UserResponse
from database import get_db
from user import User


router = APIRouter(prefix="/users", tags=["users"])

@router.get("", response_model=list[UserResponse])
async def list_users(db=Depends(get_db)):
  result = await db.execute(select(User))
  users = result.scalars().all()
  
  return users
  
@router.get("/{id}")
async def get_user(id: int, db = Depends(get_db)):
  pass
