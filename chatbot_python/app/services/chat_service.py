import uuid
from typing import Optional
from datetime import datetime
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.message_model import Message


class ChatService:
    def __init__(self, db: Session):
        self.db = db

    def save_message(self, role, message, conversation_id) -> Message:
        db_message = Message(
            id=uuid.uuid4(),
            role=role,
            message=message,
            conversation_id=conversation_id,
            created_at=datetime.now()
        )

        self.db.add(db_message)
        self.db.commit()
        self.db.refresh(db_message)

        return db_message

    def get_message_by_conversation_id(self, conversation_id, limit=10) -> list[Message]:
        if conversation_id is None:
            return []

        return (
            self.db.query(Message)
            .filter(Message.conversation_id == conversation_id)
            .order_by(Message.created_at.asc())
            .limit(limit)
            .all()
        )

    def delete_by_conversation_id(self, conversation_id: uuid.UUID):
        self.db.query(Message).filter(
            Message.conversation_id == conversation_id).delete()

        self.db.commit()
