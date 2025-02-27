from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    duration: Optional[int] = None  # in minutes
    is_completed: bool = False
    priority: int = Field(default=1, ge=1, le=5)  # Priority from 1 to 5

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: str
    created_at: datetime
    
    class Config:
        orm_mode = True 