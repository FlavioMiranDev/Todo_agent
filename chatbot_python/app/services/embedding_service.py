from langchain_google_genai.embeddings import GoogleGenerativeAIEmbeddings
import os


class EmbeddingService:
    def __init__(self):
        self.embedder = GoogleGenerativeAIEmbeddings(
            model="models/embedding-004",
            google_api_key=os.getenv("GEMINI_API_KEY")
        )

    def to_embedding(self, text: str):
        return self.embedder.embed_query(text)

    def to_list_embeddings(self, texts: list[str]):
        return self.embedder.embed_documents(texts)
