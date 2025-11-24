from sqlalchemy.orm import Session
from app.models.document_chunk import DocumentChunk
from app.models.document_name import DocumentName
import uuid
from datetime import datetime


class DocumentService:
    def __init__(self, db: Session):
        self.db = db

    def save_chunk(self, document_id, page, content, embedding):
        chunk = DocumentChunk(
            id=uuid.uuid4(),
            document_id=document_id,
            page=page,
            chunk_index=0,
            content=content,
            embedding=embedding,
            created_at=datetime.now()
        )
        self.db.add(chunk)
        self.db.commit()

    def save_docs(self, id, name, description):
        doc = DocumentName(id=id, name=name, description=description)

        self.db.add(doc)
        self.db.commit()

    def get_titles(self):
        names = self.db.query(DocumentName.name).all()
        return [name[0] for name in names]

    def delete_doc(self, document_id: uuid.UUID):
        doc = self.db.query(DocumentName).filter(
            DocumentName.id == document_id).first()

        self.db.delete(doc)
        self.db.commit()

        self.db.query(DocumentChunk).filter(
            DocumentChunk.document_id == document_id).delete()
        self.db.commit()
