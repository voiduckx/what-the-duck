from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from asyncpg.exceptions import UniqueViolationError
from security import hash_password
from schemas.user import UserLogin, UserResponse, UserCreate
from database import get_db
from models import User


router = APIRouter(prefix="/users", tags=["users"])

@router.get("", response_model=list[UserResponse])
async def list_users(db=Depends(get_db)):
  result = await db.execute(select(User))
  users = result.scalars().all()
  
  return users

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(payload: UserCreate, db: AsyncSession=Depends(get_db)):
  # Create user
  user = User(
    email=payload.email,
    password=hash_password(payload.password.get_secret_value()),
    role="user"
  )
  
  # register object to session - SYNC - No postgres talking
  db.add(user)
  
  try:
    # create the row - ASYNC - add to postgres permanently
    await db.commit()
  except IntegrityError as e:
    await db.rollback()

    # 23505 is postgres status code for unique_violation
    if getattr(e.orig, "sqlstate", None) == "23505":
      raise HTTPException(409, "Email already registered")
    raise
  
  await db.refresh(user)

  return user

@router.post("/login", status_code=status.HTTP_200_OK)
async def login_user(payload: UserLogin, db: AsyncSession=Depends(get_db)):
  return {"status":200, "message": "you are logged in"}
  
  
@router.get("/{id}")
async def get_user(id: int, db = Depends(get_db)):
  pass
