from fastapi import Depends, APIRouter, HTTPException, status
from schemas import ProductCreate, ProductResponse
from database import get_db
from models import Product

from sqlalchemy import select, delete
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession


router = APIRouter(prefix="/products", tags=["products"])

# Get all products
@router.get("", response_model=list[ProductResponse])
async def get_products(db: AsyncSession = Depends(get_db)):
  result = await db.execute(select(Product))
  products = result.scalars().all()
  return products

# Get product by ID
@router.get("/{id}", response_model=ProductResponse)
async def get_product_id(id: int, db: AsyncSession = Depends(get_db)):
  result = await db.execute(select(Product).where(Product.id == id))
  product = result.scalar_one_or_none()

  if product is None:
    raise HTTPException(status_code=404, detail="Product not found")

  return product

# Add a product
@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(payload: ProductCreate, db: AsyncSession = Depends(get_db)):
  # create product
  product = Product(**payload.model_dump())
  db.add(product)
  
  try:
    await db.commit()
  except IntegrityError as e:
    # rollback on error
    await db.rollback()

    raise HTTPException(
      status_code=status.HTTP_409_CONFLICT,
      detail=f"Product with that title already exists. {e.orig}"
    )
  await db.refresh(product)
  return product


# Delete a product by ID
@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(id: int, db: AsyncSession = Depends(get_db)):
  result = await db.execute(delete(Product).where(Product.id == id))

  # if no rows get affected(No product found)
  if result.rowcount == 0:  #type:ignore
    raise HTTPException(
      status_code=404,
      detail="Product not found"
    )
    
  await db.commit()

  return None

# Used ProductCreate schema because of similarity
@router.put("/{id}", status_code=status.HTTP_200_OK)
async def update_product(id: int, payload: ProductCreate, db: AsyncSession = Depends(get_db)):
  product = await db.get(Product, id)
  
  if product is None:
    raise HTTPException(
          status_code=404,
          detail="Product not found"
        )
  
  for field, value in payload.model_dump().items():
    print(field, value, product)
    setattr(product, field, value)
  
  await db.commit()

  return {"status": 200, "message": "Product updated successfully"}