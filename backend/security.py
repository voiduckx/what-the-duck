import os

from fastapi import Depends, Response, Cookie, HTTPException, status
import jwt
from datetime import datetime, timedelta, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from models import User
from pwdlib import PasswordHash
from dotenv import load_dotenv

from database import get_db

# Read .env variables
load_dotenv()

# ENV helper
def _require_env(name: str) -> str:
  val = os.environ.get(name)
  if not val:
    raise RuntimeError(f"{name} environment variable is required")

  return val

SECRET_KEY: str = _require_env("SECRET_KEY")
ALGORITHM: str = _require_env("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES") or 30)
ACCESS_TOKEN_COOKIE = "access"

pwd_context = PasswordHash.recommended()


def hash_password(password: str) -> str:
  return pwd_context.hash(password=password)

def verify_password(plain: str, hashed: str) -> bool:
  return pwd_context.verify(password=plain, hash=hashed)


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
  now = datetime.now(timezone.utc)
  expire = now + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))

  to_encode = {
    **data,
    "iat": now,
    "exp": expire,
    "type": ACCESS_TOKEN_COOKIE
  }
  return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def set_auth_cookie(response: Response, token: str) -> None:
  response.set_cookie(
    key=ACCESS_TOKEN_COOKIE,
    value=token,
    httponly=True,
    secure=False,
    samesite="lax",
    max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60
  )

def clear_auth_cookie(response: Response) -> None:
  response.delete_cookie(
    key=ACCESS_TOKEN_COOKIE,
    httponly=True,
    secure=False,
    samesite="lax",
  )


async def get_current_user(
  access_token: str | None = Cookie(None, alias=ACCESS_TOKEN_COOKIE),
  db: AsyncSession = Depends(get_db)) -> User:
  credential_excpetion = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Not authenticated"
  )
  
  if not access_token:
    raise credential_excpetion
  
  try:
    payload = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
    user_id = payload.get("sub")
    if user_id is None:
      raise credential_excpetion
  except jwt.PyJWTError:
    raise credential_excpetion
  
  user = await db.get(User, int(user_id))
  if user is None:
    raise credential_excpetion

  return user