from uuid import UUID
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ChatMessage(BaseModel):
    role: str
    content: str
    timestamp: datetime


class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[UUID] = None


class ChatResponse(BaseModel):
    response: str
    id: UUID
    conversation_id: UUID
    role: Optional[str] = None


class Conversation(BaseModel):
    id: UUID
    name: str
    createdAt: datetime
