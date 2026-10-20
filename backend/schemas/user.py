from datetime import datetime

from pydantic import BaseModel, EmailStr, Field, SecretStr, model_validator


class UserResponse(BaseModel):
  id: int
  email: str
  first_name: str | None
  last_name: str | None
  phone_number: str | None
  bio: str | None
  address: str | None
  city: str | None
  state: str | None
  zipcode: str | None
  
  created_at: datetime
  updated_at: datetime
  last_login: datetime | None

  model_config = {"from_attributes": True}
  
class UserCreate(BaseModel):
  email: EmailStr
  password: SecretStr = Field(min_length=8, max_length=72)
  password_confirmation: SecretStr
  
  @model_validator(mode="after")
  def password_match(self):
    if self.password.get_secret_value() != self.password_confirmation.get_secret_value():
      raise ValueError("Passwords do not match")

    return self

