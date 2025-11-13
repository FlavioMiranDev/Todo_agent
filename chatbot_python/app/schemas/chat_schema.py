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
    conversation_id: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    message_id: UUID


class Conversation(BaseModel):
    id: str
    messages: List[ChatMessage]
    createdAt: datetime
