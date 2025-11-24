import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.chat_schema import ChatRequest, ChatResponse, Conversation
from app.services.chatbot_service import Chatbot_Service
from app.services.descriptor_service import Descriptor_Service
from app.services.conversation_service import Conversation_service
from app.services.chat_service import ChatService
from app.core.database import get_db

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("/", response_model=ChatResponse)
def chat(request: ChatRequest, db: Session = Depends(get_db)):
    conversation_id = request.conversation_id

    if conversation_id is None:
        desc_service = Descriptor_Service()
        conv_service = Conversation_service(db)

        conversation_id = uuid.uuid4()
        conversation_name = desc_service.generate_conversation_title(
            request.message)

        conv_service.save_conversation(
            id=conversation_id, name=conversation_name)

    bot = Chatbot_Service(db=db)

    bot_reply = bot.generate_response(
        message=request.message, conversation_id=conversation_id)

    response = ChatResponse(
        id=uuid.uuid4(),
        response=bot_reply,
        conversation_id=conversation_id)

    return response


@router.get("/{chat_id}")
def get_conversation(chat_id: uuid.UUID, db: Session = Depends(get_db)):
    chat_service = ChatService(db)
    chat = chat_service.get_message_by_conversation_id(chat_id)
    chat_response = [ChatResponse(
        response=c.message,
        id=c.id,
        conversation_id=c.conversation_id,
        role=c.role
    ) for c in chat]

    return chat_response


@router.get("/")
def get_all_conversations(db: Session = Depends(get_db)):
    conversation_service = Conversation_service(db)
    chats = conversation_service.get_all_conversations()

    conversations = [Conversation(
        id=c.id, name=c.name, createdAt=c.created_at) for c in chats]

    return conversations


@router.delete("/{chat_id}")
def delete_conversation(chat_id: uuid.UUID, db: Session = Depends(get_db)):
    conversation_service = Conversation_service(db)
    chat_service = ChatService(db)

    chat_service.delete_by_conversation_id(chat_id)
    conversation_service.delete(chat_id)

    return {"message": "successfully deleted"}
