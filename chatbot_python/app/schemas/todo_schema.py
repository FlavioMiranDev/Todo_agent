from uuid import UUID
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class TodoResponse(BaseModel):
    id: UUID
    title: str
    category: Optional[str] = None
    description: Optional[str] = None
    date: Optional[datetime] = None
    completed: bool
    created_at: datetime


class TodoCreate(BaseModel):
    title: str
    category: str
    description: str
    date: Optional[datetime] = None


class TodoUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    date: Optional[datetime] = None
