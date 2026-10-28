from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from security import clear_auth_cookie, create_access_token, get_current_user, hash_password, set_auth_cookie, verify_password
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
async def create_user(payload: UserCreate, response: Response, db: AsyncSession=Depends(get_db)):
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
  
  # Login user after registraion
  token = create_access_token({"sub": str(user.id)})
  set_auth_cookie(response, token)

  return user


# Login user
@router.post("/login", status_code=status.HTTP_200_OK)
async def login_user(payload: UserLogin, response: Response, db: AsyncSession=Depends(get_db)):
  # Get user from DB
  user = await db.scalar(select(User).where(User.email == payload.email))

  if not user:
    raise HTTPException(401, "Invalid email")

  if not verify_password(payload.password.get_secret_value(), user.password):
    raise HTTPException(401, "Password is not correct")
  
  # Login user with cookie
  token = create_access_token({"sub": user.id})
  set_auth_cookie(response, token)

  return {"message": "Login successful"}
  

# Logout user
@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout_user(response: Response):
  clear_auth_cookie(response)
  return None

# return current user
@router.get("/me", response_model=UserResponse)
async def read_me(current_user: User = Depends(get_current_user)):
  return current_user

  
@router.get("/{id}")
async def get_user(id: int, db = Depends(get_db)):
  pass
