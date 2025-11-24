import uuid
from datetime import datetime
from pgvector.sqlalchemy import Vector
from sqlalchemy import Column, String, Text, DateTime, Boolean
from sqlalchemy.types import UUID
from app.core.database import Base


class Todo(Base):
    __tablename__ = "todos"

    id = Column(UUID(as_uuid=True), primary_key=True,
                default=uuid.uuid4, nullable=False)
    title = Column(String(200), nullable=False)
    category = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    date = Column(DateTime, nullable=True)
    embedding = Column(Vector(768), nullable=False)
    completed = Column(Boolean, default=False)
    created_at = Column(DateTime, nullable=False, default=datetime.now)
