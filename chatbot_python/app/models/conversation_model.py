import uuid
from datetime import datetime
from sqlalchemy import Column, Text, DateTime, func
from sqlalchemy.types import UUID
from app.core.database import Base


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4())
    message = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.now())
