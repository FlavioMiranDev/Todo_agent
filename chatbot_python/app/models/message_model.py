import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime
from sqlalchemy.types import UUID
from app.core.database import Base


class Message(Base):
    __tablename__ = "messages"

    id = Column(UUID(as_uuid=True), primary_key=True,
                default=uuid.uuid4(), nullable=False)
    conversation_id = Column(UUID(as_uuid=True), nullable=False)
    role = Column(String, nullable=False)
    message = Column(Text, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.now())
