from langchain.tools import tool
from app.core.database import get_db
from app.services.search_documents_service import Semantic_search_service


@tool
def semantic_search_tool(query: str) -> str:
    """Busca informações no banco de dados usando busca semântica baseada no conteúdo da pergunta."""
    db = next(get_db())

    search_service = Semantic_search_service(db)

    results = search_service.search_similar(
        query_text=query, top_k=3, min_similarity=0.7)

    return "\n\n".join([f"Resultado {i+1}: {result}" for i, result in enumerate(results)])
