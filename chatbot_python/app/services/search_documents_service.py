from sqlalchemy.orm import Session
from sqlalchemy import text
from app.services.embedding_service import EmbeddingService


class Semantic_search_service:
    def __init__(self, db: Session):
        self.db = db
        self.embedder = EmbeddingService()

    def search_similar(self, query_text: str, top_k: int = 3, min_similarity: float = 0.7):
        query_vector = self.embedder.to_embedding(query_text)

        sql = text("""
            SELECT content, (1 - (embedding <=> CAST(:query_vector AS vector))) AS similarity
            FROM documents
            WHERE (1 - (embedding <=> CAST(:query_vector AS vector))) >= :min_similarity
            ORDER BY similarity DESC
            LIMIT :top_k;
        """)

        results = self.db.execute(
            sql, {
                "query_vector": query_vector,
                "min_similarity": min_similarity,
                "top_k": top_k
            }
        ).fetchall()

        return [row[0] for row in results]
