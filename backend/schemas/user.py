from datetime import datetime

from pydantic import BaseModel


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