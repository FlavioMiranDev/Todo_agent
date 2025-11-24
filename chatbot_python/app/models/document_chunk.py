import uuid
from datetime import datetime
from sqlalchemy import Column, Integer, Text, DateTime
from sqlalchemy.types import UUID
from pgvector.sqlalchemy import Vector
from app.core.database import Base


class DocumentChunk(Base):
    __tablename__ = "documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_id = Column(UUID(as_uuid=True), nullable=False)
    page = Column(Integer, nullable=True)
    chunk_index = Column(Integer, nullable=True)
    content = Column(Text, nullable=False)
    embedding = Column(Vector(768), nullable=False)
    created_at = Column(DateTime, default=datetime.now)
