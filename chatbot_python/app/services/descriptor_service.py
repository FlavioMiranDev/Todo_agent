import os
from langchain_google_genai import ChatGoogleGenerativeAI


class Descriptor_Service:
    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            google_api_key=os.getenv("GEMINI_API_KEY"),
            convert_system_message_to_human=True)

    def _extract_text(self, texts):
        extracted_texts = []
        for text in texts:
            if hasattr(text, 'page_content'):
                extracted_texts.append(text.page_content)
            else:
                extracted_texts.append(str(text))
        return "\n\n".join(extracted_texts)

    def generate_title(self, texts):
        chunks = self._extract_text(texts)

        prompt = f"""
Baseado nos chunks iniciais do documento, você precisa elaborar um titulo com no máximo 200 letras para ele. Responda somente com 1 titulos e nada mais
chunks:
{chunks}"""

        title = self.llm.invoke(prompt)

        return title.content

    def generate_description(self, texts):
        chunks = self._extract_text(texts)

        prompt = f"""
Baseado nos chunks iniciais do documento, você precisa elaborar uma descrição com no máximo 300 letras para ele. Responda com somente 1 descrição e nada mais
chunks:
{chunks}"""

        description = self.llm.invoke(prompt)

        return description.content

    def generate_conversation_title(self, text):
        

        prompt = f"""Baseado nessa pergunta do usuário, dê um titulo para a conversa que seja auto explicativo. Responda somente com o titulo da conversa e no máximo 50 caracteres. Pergunta do usuário: "{text}"."""

        title = self.llm.invoke(prompt)

        return title.content