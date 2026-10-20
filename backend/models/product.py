from datetime import datetime

from database import Base
from sqlalchemy import Numeric, String, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column

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
