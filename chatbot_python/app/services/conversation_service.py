import uuid
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.conversation_model import Conversation


class Conversation_service:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, conversation_id: uuid.UUID):
        conversation = self.db.query(Conversation).filter(
            Conversation.id == conversation_id).first()

        return conversation

    def save_conversation(self, id, name: str):
        db_conversation = Conversation(
            id=id,
            name=name,
            created_at=datetime.now()
        )

        self.db.add(db_conversation)
        self.db.commit()
        self.db.refresh(db_conversation)

        return db_conversation

    def get_all_conversations(self):
        return self.db.query(Conversation).all()

    def delete(self, conversation_id: uuid.UUID):
        conversation = self.get_by_id(conversation_id)

        self.db.delete(conversation)
        self.db.commit()
