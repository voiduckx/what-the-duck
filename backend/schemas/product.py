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
  