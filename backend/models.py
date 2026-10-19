from datetime import datetime

from database import Base
from sqlalchemy import Numeric, String, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column


class User(Base):
  __tablename__ = "users"

  id: Mapped[int] = mapped_column(primary_key=True)
  email: Mapped[str] = mapped_column(String(100), unique=True)
  password: Mapped[str] = mapped_column(String(255))
  first_name: Mapped[str] = mapped_column(String(100))
  last_name: Mapped[str] = mapped_column(String(100))
  phone_number: Mapped[str] = mapped_column(String(20), unique=True)
  bio: Mapped[str] = mapped_column(String(255))
  address: Mapped[str] = mapped_column(String(255))
  city: Mapped[str] = mapped_column(String(100))
  state: Mapped[str] = mapped_column(String(100))
  zipcode: Mapped[str] = mapped_column(String(20))
  role: Mapped[str] = mapped_column(
    String(20),
    default="user",
    server_default="user"
  )
  
  created_at: Mapped[datetime] = mapped_column(
    DateTime(timezone=True),
    server_default=func.now(),
    onupdate=func.now()
  )
  
  updated_at: Mapped[datetime] = mapped_column(
    DateTime(timezone=True),
    server_default=func.now(),
    onupdate=func.now()
  )
  
  last_login: Mapped[datetime | None] = mapped_column(
    DateTime(timezone=True),
    nullable=True
  )
  

class Product(Base):
  __tablename__ = "products"
  
  id: Mapped[int] = mapped_column(primary_key=True)
  title: Mapped[str] = mapped_column(String(255), unique=True)
  price: Mapped[float] = mapped_column(Numeric(10, 2))
  image: Mapped[str] = mapped_column()
  description: Mapped[str] = mapped_column(String(255))
  category: Mapped[str] = mapped_column(String(255))
  
  created_at: Mapped[datetime] = mapped_column(
      DateTime(timezone=True),
      server_default=func.now(),
      onupdate=func.now()
    )
    
  updated_at: Mapped[datetime] = mapped_column(
    DateTime(timezone=True),
    server_default=func.now(),
    onupdate=func.now()
  )
