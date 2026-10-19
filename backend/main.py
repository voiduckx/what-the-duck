from contextlib import asynccontextmanager
from fastapi import FastAPI
from database import Base, engine
from routes.product import router as product_router
from routes.user import router as user_router



@asynccontextmanager
async def lifespan(app: FastAPI):
  # Run on startup - create tables if they don't exist
  async with engine.begin() as conn:
    await conn.run_sync(Base.metadata.create_all)
  yield
  
  await engine.dispose()


app = FastAPI(title="What The Duck", lifespan=lifespan)

@app.get("/")
def root():
  return { "status":200, "message": "Hello from backend"}


# include product router
app.include_router(product_router)

app.include_router(user_router)
