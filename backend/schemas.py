from datetime import datetime
from pydantic import BaseModel, Field


class ProductCreate(BaseModel):
  title: str = Field(min_length=1, max_length=255)
  price: float = Field(gt=0)
  image: str = Field(min_length=1, max_length=255)
  description: str | None = Field(default=None, max_length=500)
  category: str = Field(min_length=1, max_length=255)


class ProductResponse(BaseModel):
  id: int
  title: str
  price: float
  image: str
  description: str
  category: str
  
  model_config = {"from_attributes": True}


class UserResponse(BaseModel):
  id: int
  email: str
  first_name: str
  last_name: str
  phone_number: str
  bio: str
  address: str
  city: str
  state: str
  zipcode: str
  
  created_at: datetime
  updated_at: datetime
  last_login: datetime

  model_config = {"from_attributes": True}
  