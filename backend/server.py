from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Space Models
class SpaceCreate(BaseModel):
    title: str
    description: str = ""
    tags: List[str] = []
    privacy: str = "public"
    quality_threshold: int = 50
    scheduled_time: Optional[str] = None
    is_live: bool = False
    cover_image_url: Optional[str] = None

class Space(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str = ""
    host_id: str
    tags: List[str] = []
    privacy: str = "public"
    quality_threshold: int = 50
    scheduled_time: Optional[str] = None
    is_live: bool = False
    cover_image_url: Optional[str] = None
    participant_count: int = 0
    listener_count: int = 0
    duration: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Space endpoints
@api_router.post("/spaces", response_model=Space)
async def create_space(space_data: SpaceCreate, host_id: str):
    space_dict = space_data.dict()
    space_dict["host_id"] = host_id
    space_obj = Space(**space_dict)
    await db.spaces.insert_one(space_obj.dict())
    return space_obj

@api_router.get("/spaces", response_model=List[Space])
async def get_spaces():
    spaces = await db.spaces.find().to_list(length=100)
    return spaces

@api_router.get("/spaces/{space_id}", response_model=Space)
async def get_space(space_id: str):
    space = await db.spaces.find_one({"id": space_id})
    if not space:
        raise HTTPException(status_code=404, detail="Space not found")
    return space

@api_router.put("/spaces/{space_id}", response_model=Space)
async def update_space(space_id: str, space_data: SpaceCreate, host_id: str):
    space_dict = space_data.dict()
    space_dict["updated_at"] = datetime.utcnow()
    
    result = await db.spaces.update_one(
        {"id": space_id, "host_id": host_id},
        {"$set": space_dict}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Space not found or unauthorized")
    
    updated_space = await db.spaces.find_one({"id": space_id})
    return updated_space

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
