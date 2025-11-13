from uuid import UUID
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class Message(BaseModel):
    id: UUID
    conversation_id = UUID
    role: str
    message = str
    created_at = datetime
