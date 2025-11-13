import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.chat_schema import ChatRequest, ChatResponse
from app.services.chatbot_service import Chatbot_Service
from app.core.database import get_db

router = APIRouter(prefix="/chat", tags=["Chatbot"])


@router.post("/", response_model=ChatResponse)
def chat(request: ChatRequest, db: Session = Depends(get_db)):
    bot = Chatbot_Service(db=db)

    bot_reply = bot.generate_response(
        message=request.message, conversation_id=request.conversation_id)

    response = ChatResponse(response=bot_reply, message_id=uuid.uuid4())

    return response
