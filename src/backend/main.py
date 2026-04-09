from contextlib import asynccontextmanager
from fastapi import FastAPI

from . import models
from .database import Base, engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(lifespan=lifespan)

@app.get("/")
def read_root():
    return {"message": "Backend radi"}