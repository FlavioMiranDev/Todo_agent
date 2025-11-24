import os
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from langchain.agents import AgentType, initialize_agent
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import HumanMessage, AIMessage, SystemMessage
from langchain.tools import Tool
from app.services.chat_service import ChatService
from app.tools.search_tool import semantic_search_tool
from app.tools.todo_tool import create_todo_tool, delete_todo_tool, semantic_search_todo_tool, update_todo_tool, query_todos_tool
from app.tools.datetime_tool import get_current_datetime_tool
from app.services.document_service import DocumentService

load_dotenv()


class Chatbot_Service:

    def __init__(self, db: Session):
        self.db = db
        self.chat_service = ChatService(db)
        self.document_service = DocumentService(db)

        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            google_api_key=os.getenv("GEMINI_API_KEY"),
            convert_system_message_to_human=True
        )

    def generate_response(self, message: str, conversation_id) -> str:
        history = self.chat_service.get_message_by_conversation_id(
            conversation_id)

        titles = self.document_service.get_titles()
        docs = "\n".join([name for name in titles])

        print(history)

        prompt = "Você é um assistente virtual que sempre responderá o usuário com no máximo 1500 caracteres. Você tem acesso a Tools, incluindo uma ferramenta que você monta um QUERY para buscar no banco de dador as todos, e outra de busca semântica para encontrar tarefas, fora essas, você tem acesso a mais ferramentas" \
            "USE A BUSCA SEMÂNTICA DOS TODOS SOMENTE QUANDO O USUÁRIO FALAR A DESCRIÇÃO DA TAREFA, QUANDO ELE PERGUNTAR SOBRE QUANTIDADE DE TAREFAS OU PEDIR PARA AVALIAR AS TAREFAS VOCÊ DEVE USAR A BUSCA POR QUERY." \
            "RESPONDA O USUÁRIO SEMPRE EM PORTUGUÊS" \
            "INSTRUÇÕES IMPORTANTES PARA EDIÇÃO E EXCLUSÃO DE TAREFAS:" \
            "1. Quando o usuário solicitar editar, atualizar ou modificar uma tarefa, PRIMEIRO use a ferramenta de busca semântica para encontrar a tarefa específica" \
            "2. Quando o usuário solicitar deletar, excluir ou remover uma tarefa, PRIMEIRO use a ferramenta de busca semântica para encontrar a tarefa específica" \
            "3. Obtenha o ID da tarefa a partir dos resultados da busca" \
            "4. Use o ID encontrado para fazer a edição com a ferramenta de atualização OU a exclusão com a ferramenta de deletar" \
            "5. Após deletar uma tarefa, SEMPRE informe ao usuário que a tarefa foi deletada com sucesso" \
            "6. Nunca tente editar ou deletar uma tarefa sem antes buscar e confirmar o ID correto" \
            "7. Em caso de não ter ficado claro qual ter que editar ou deletar, pergunte ao usuário antes de deletar" \
            "SEQUÊNCIA CORRETA: Buscar → Obter ID → Editar/Deletar → Confirmar" \
            f"{docs}" \
            "Se caso as tools não tiverem dados necessários para responder, responda com base no seu próprio conhecimento. Nunca responda que não tem os dados para responder"

        messages = [SystemMessage(content=prompt)]

        for msg in history:
            messages.append(HumanMessage(content=msg.message)
                            if msg.role == "user" else AIMessage(content=msg.message))

        messages.append(HumanMessage(content=message))

        desc = f"""Função para pegar trechos de arquivos importantes para sobre os assuntos {docs}"""

        tools = [
            Tool(
                name="Busca semânticamente os resultados mais próximos sobre os assuntos",
                func=semantic_search_tool,
                description=desc
            ),
            Tool(
                name="Criador de um Todo",
                func=create_todo_tool,
                description="""Cria uma nova tarefa no sistema de Todos.

USE QUANDO: O usuário solicitar criar, adicionar, registrar ou incluir uma nova tarefa.

FORMATO DE ENTRADA: String no formato "title: valor, descript: valor, category: valor, date: valor"
EXEMPLOS:
• "title: Reunião, descript: Reunião semanal, category: trabalho, date: 2024-11-25 14:30:00"
• "title: Academia, descript: Treino muscular, category: pessoal, date: 2024-11-19 18:00:00"

CAMPOS OBRIGATÓRIOS:
- title: Título breve da tarefa
- descript: Descrição detalhada  
- category: Categoria (trabalho, pessoal, estudos, etc.)
- date: Data no formato YYYY-MM-DD HH:MM:SS

RETORNO: Confirmação com detalhes da tarefa criada."""
            ),
            Tool(
                name="Removedor de Todo",
                func=delete_todo_tool,
                description="Remove permanentemente uma tarefa específica da lista. Use esta ferramenta quando o usuário quiser excluir uma tarefa existente. É necessário fornecer o ID único da tarefa a ser deletada. Retorna confirmação da exclusão."
            ),
            Tool(
                name="Busca Semântica de Todos",
                func=semantic_search_todo_tool,
                description="""Busca tarefas por significado e contexto, não apenas por palavras exatas.

USE QUANDO: O usuário quiser encontrar tarefas relacionadas a um tema, conceito ou assunto específico.

PARÂMETRO:
- query (string): Texto descrevendo o que buscar (ex: "preparação para apresentações", "tarefas de saúde", "compromissos profissionais")

EXEMPLOS:
• "reuniões e encontros importantes"
• "tarefas relacionadas a estudos universitários" 
• "atividades físicas e exercícios"
• "compras e supermercado"

RETORNO: String formatada com até 5 tarefas mais relevantes, incluindo título, descrição, categoria, data e status."""
            ),
            Tool(
                name="Obter_Data_Hora_Atual",
                func=get_current_datetime_tool,
                description="Retorna a data e hora atual do sistema. Nao requer parametros. Use para saber a data/hora corrente."
            ),
            Tool(
                name="Editar_Tarefa",
                func=update_todo_tool,
                description="""Edita uma tarefa existente com base no ID e propriedades a serem modificadas.

USE QUANDO: O usuário quiser modificar uma tarefa existente.

FORMATO: "id: [UUID], propriedade1: valor1, propriedade2: valor2"

PROPRIEDADES DISPONÍVEIS:
- title: Novo título da tarefa
- description: Nova descrição
- category: Nova categoria
- date: Nova data no formato YYYY-MM-DD HH:MM:SS
- completed: true/false para marcar como concluída ou pendente

EXEMPLOS:
• "id: 123e4567-e89b-12d3-a456-426614174000, title: Novo título, description: Nova descrição"
• "id: 123e4567-e89b-12d3-a456-426614174000, completed: true"
• "id: 123e4567-e89b-12d3-a456-426614174000, category: trabalho, date: 2024-12-01 14:00:00"

RETORNO: Confirmação da atualização com as propriedades modificadas."""
            ),
            Tool(
                name="Query_Personalizada_Todos",
                func=query_todos_tool,
                description="""Executa queries SQL personalizadas na tabela de todos.

USE QUANDO: Precisa de consultas específicas, filtros complexos ou dados customizados.

PARÂMETRO: query (string) - Query SQL SELECT válida (ex: "SELECT title, category FROM todos WHERE completed = false")

RESTRIÇÕES:
- Apenas queries SELECT são permitidas
- Deve referenciar a tabela 'todos'
- Não permite INSERT, UPDATE, DELETE, DROP, etc.

EXEMPLOS:
• "SELECT title, category FROM todos WHERE completed = false"
• "SELECT * FROM todos WHERE category = 'trabalho' ORDER BY created_at DESC"
• "SELECT COUNT(*) as total FROM todos"

RETORNO: Resultados formatados da query ou mensagem de erro."""
            )
        ]

        agent = initialize_agent(
            tools=tools,
            llm=self.llm,
            agent=AgentType.STRUCTURED_CHAT_ZERO_SHOT_REACT_DESCRIPTION,
            verbose=True,
            handle_parsing_errors=True)

        response = agent.invoke(messages)

        print(response['output'])

        self.chat_service.save_message(
            role="user", message=message, conversation_id=conversation_id)
        self.chat_service.save_message(
            role="assistant", message=response['output'], conversation_id=conversation_id)

        return response["output"]
