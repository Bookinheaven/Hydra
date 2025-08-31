from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.routers import generate
from app.core import config
from app.utils.logger import logger

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Application startup...")
    yield
    logger.info("Application Stopped...")
    
app = FastAPI(lifespan=lifespan, title="Typing AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

app.include_router(generate.router, prefix=config.API_PREFIX)


@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Welcome to the Typing AI API"}