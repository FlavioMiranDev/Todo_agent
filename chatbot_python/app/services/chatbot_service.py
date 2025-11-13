import os
import uuid
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import HumanMessage
from app.services.chat_service import ChatService

load_dotenv()


class Chatbot_Service:

    def __init__(self, db: Session):
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            google_api_key=os.getenv("GEMINI_API_KEY")
        )
        self.db = db
        self.chat_service = ChatService(db=db)

    def generate_response(self, message: str, conversation_id=None) -> str:
        if conversation_id is None:
            conversation_id = uuid.uuid4()

        history = self.chat_service.get_message_by_conversation_id(
            conversation_id=conversation_id)

        formatted_history = "\n".join(
            [f"{msg.role}: {msg.message}" for msg in history])

        user_message = message

        prompt = f"""
        Você é um assistente virtual que sempre responderá o usuário com no máximo 1000 caracteres
        histórico de conversa:
        {formatted_history}
        pergunta atual:
        {user_message}
        """

        response = self.llm.invoke(prompt)

        self.chat_service.save_message(
            role="user", message=message, conversation_id=conversation_id)
        self.chat_service.save_message(
            role="assistant", message=response.content, conversation_id=conversation_id
        )

        return response.content
