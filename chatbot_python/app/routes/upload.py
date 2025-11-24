from fastapi import APIRouter, UploadFile, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.file_reader_service import FileReaderService
from app.services.splitter_service import SplitterService
from app.services.embedding_service import EmbeddingService
from app.services.document_service import DocumentService
import os
import uuid


from app.services.descriptor_service import Descriptor_Service

router = APIRouter(prefix="/files", tags=["Files"])


UPLOAD_DIR = "base"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/")
async def upload_pdf(file: UploadFile, db: Session = Depends(get_db)):
    file_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}_{file.filename}")

    with open(file_path, "wb") as f:
        f.write(await file.read())

        reader = FileReaderService()
        splitter = SplitterService()
        embedder = EmbeddingService()
        document_service = DocumentService(db)

        desc = Descriptor_Service()

        document = reader.read_pdf(file_path)

        chunks = splitter.split(document)
        title = desc.generate_title(chunks[:4])
        description = desc.generate_description(chunks[:4])

        for chunk in chunks:
            vector = embedder.to_embedding(chunk.page_content)

            document_service.save_chunk(
                document_id=file_id,
                page=chunk.metadata.get("page", 0),
                content=chunk.page_content,
                embedding=vector
            )

        document_service.save_docs(
            id=file_id, name=title, description=description)

        return {"message": "File processed and saved successfully!"}


@router.get("/")
async def list_documents():
    documents = []

    for filename in os.listdir(UPLOAD_DIR):
        file_path = os.path.join(UPLOAD_DIR, filename)

        if os.path.isfile(file_path):
            id, name = filename.split("_", 1)

            documents.append({
                "id": id,
                "filename": name
            })

    return documents


@router.delete("/{document_id}")
async def delete_document(document_id: uuid.UUID, db: Session = Depends(get_db)):
    document_service = DocumentService(db)

    for filename in os.listdir(UPLOAD_DIR):
        if filename.startswith(str(document_id) + "_"):
            file_path = os.path.join(UPLOAD_DIR, filename)

            if os.path.exists(file_path):
                os.remove(file_path)

            document_service.delete_doc(document_id)

            return {"message": f"Document {document_id} deleted successfully"}

    return {"error": f"Document {document_id} not found"}, 404
