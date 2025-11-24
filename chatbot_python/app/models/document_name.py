import uuid
from sqlalchemy import Column, String, Text
from sqlalchemy.types import UUID
from app.core.database import Base


class DocumentName(Base):
    __tablename__ = "document_name"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
