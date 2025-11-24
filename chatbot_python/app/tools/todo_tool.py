import json
import uuid
from datetime import datetime
from langchain.tools import tool
from app.core.database import get_db
from app.services.todo_service import Todo_service
from sqlalchemy import text


@tool
def create_todo_tool(action_input: str) -> str:
    """
    Cria uma nova tarefa (Todo) no sistema.

    Use esta ferramenta quando o usuário precisar adicionar uma nova tarefa.

    Args:
        action_input (str): String com os parâmetros no formato: 
                          "title: valor, descript: valor, category: valor, date: valor"
                          ou JSON: '{"title": "valor", "descript": "valor", "category": "valor", "date": "valor"}'

    Returns:
        str: Mensagem de confirmação com os detalhes da tarefa criada
    """

    db = next(get_db())
    todo_service = Todo_service(db)

    try:
        if action_input.strip().startswith('{'):
            data = json.loads(action_input)
        else:
            data = {}
            parts = action_input.split(',')
            for part in parts:
                if ':' in part:
                    key, value = part.split(':', 1)
                    key = key.strip().strip('"').strip("'")
                    value = value.strip().strip('"').strip("'")
                    data[key] = value

        title = data.get('title')
        descript = data.get('descript')
        category = data.get('category')
        date_str = data.get('date')

        if not all([title, descript, category, date_str]):
            return "Erro: Faltam parâmetros. São necessários: title, descript, category, date"

        try:
            date = datetime.strptime(date_str, '%Y-%m-%d %H:%M:%S')
        except ValueError:
            return "Erro: Formato de data inválido. Use 'YYYY-MM-DD HH:MM:SS'"

        todo = todo_service.new(title, descript, category, date)
        return f"Tarefa criada: {todo.title}, descrição: {todo.description}, categoria: {todo.category}, data: {todo.date}"

    except Exception as e:
        return f"Erro ao processar os dados: {str(e)}. Formato esperado: 'title: valor, descript: valor, category: valor, date: valor'"


@tool
def delete_todo_tool(todo_id: uuid.UUID):
    """
    Deleta uma tarefa específica pelo seu ID único.

    Use esta ferramenta quando o usuário quiser remover uma tarefa do sistema.
    Esta ação é permanente e não pode ser desfeita.

    Args:
        todo_id (uuid.UUID): O identificador único da tarefa a ser deletada

    Returns:
        str: Mensagem de confirmação indicando a exclusão bem-sucedida

    Example:
        delete_todo_tool("123e4567-e89b-12d3-a456-426614174000")
    """

    db = next(get_db())
    todo_service = Todo_service(db)
    todo_service.delete(todo_id)


@tool
def semantic_search_todo_tool(query: str) -> str:
    """
    Busca tarefas de forma semântica usando similaridade de significado.

    Use esta ferramenta quando o usuário quiser encontrar tarefas relacionadas a um conceito,
    assunto ou tema específico, mesmo que as palavras exatas não coincidam.

    Args:
        query (str): Texto de busca para encontrar tarefas semanticamente similares
                   (ex: "reuniões importantes", "tarefas de estudo", "compras do mês")

    Returns:
        str: String única formatada com os resultados mais relevantes encontrados
    """
    db = next(get_db())
    todo_service = Todo_service(db)

    try:
        results = todo_service.semantic_search(query, limit=5)

        if not results:
            return "Nenhuma tarefa encontrada para esta busca."

        response = ["**Resultados da Busca Semântica:**"]

        for i, todo in enumerate(results, 1):
            status = "Concluída" if todo.completed else "Pendente"
            date_str = todo.date.strftime(
                "%d/%m/%Y %H:%M") if todo.date else "Sem data definida"

            response.append(
                f"{i}. **{todo.title}**\n"
                f"   {todo.description}\n"
                f"   {todo.category}\n"
                f"   {date_str}\n"
                f"   {status}\n"
                f"   ID: {todo.id}"
            )

        return "\n\n".join(response)

    except Exception as e:
        return f"Erro na busca semântica: {str(e)}"


@tool
def update_todo_tool(update_string: str) -> str:
    """
    Edita uma tarefa existente com base no ID e propriedades fornecidas.

    Use esta ferramenta quando o usuário quiser modificar uma tarefa existente.

    Args:
        update_string (str): String no formato "id: [UUID], propriedade1: valor1, propriedade2: valor2"
                           Propriedades disponíveis: title, description, category, date, completed

    Returns:
        str: Mensagem de confirmação da atualização ou erro
    """
    db = next(get_db())
    todo_service = Todo_service(db)

    try:
        data = {}
        parts = update_string.split(',')

        for part in parts:
            if ':' in part:
                key, value = part.split(':', 1)
                key = key.strip().lower()
                value = value.strip()

                if key == 'id':
                    data['todo_id'] = uuid.UUID(value)
                elif key in ['title', 'description', 'category']:
                    data[key] = value
                elif key == 'date':
                    data['date'] = datetime.strptime(
                        value, '%Y-%m-%d %H:%M:%S')
                elif key == 'completed':
                    data['completed'] = value.lower() in ['true', 'sim',
                                                          'yes', 'verdadeiro', '1']

        if 'todo_id' not in data:
            return "Erro: ID da tarefa é obrigatório. Formato: 'id: [UUID], propriedade: valor'"

        todo = todo_service.get_by_id(data['todo_id'])
        if not todo:
            return f"Erro: Tarefa com ID {data['todo_id']} não encontrada"

        update_data = {}
        if 'title' in data:
            update_data['title'] = data['title']
        if 'description' in data:
            update_data['description'] = data['description']
        if 'category' in data:
            update_data['category'] = data['category']
        if 'date' in data:
            update_data['date'] = data['date']

        if update_data:
            todo_service.update(
                todo_id=data['todo_id'],
                title=update_data.get('title'),
                description=update_data.get('description'),
                category=update_data.get('category'),
                date=update_data.get('date')
            )

        if 'completed' in data:
            todo_service.complete(data['todo_id'], data['completed'])

        updated_todo = todo_service.get_by_id(data['todo_id'])

        properties_updated = []
        if 'title' in data:
            properties_updated.append(f"título: {updated_todo.title}")
        if 'description' in data:
            properties_updated.append(f"descrição: {updated_todo.description}")
        if 'category' in data:
            properties_updated.append(f"categoria: {updated_todo.category}")
        if 'date' in data:
            properties_updated.append(f"data: {updated_todo.date}")
        if 'completed' in data:
            status = "concluída" if updated_todo.completed else "pendente"
            properties_updated.append(f"status: {status}")

        return f"Tarefa atualizada com sucesso. {', '.join(properties_updated)}"

    except ValueError as e:
        if "UUID" in str(e):
            return "Erro: Formato de ID inválido. Use um UUID válido."
        elif "time data" in str(e):
            return "Erro: Formato de data inválido. Use 'YYYY-MM-DD HH:MM:SS'"
        return f"Erro de validação: {str(e)}"
    except Exception as e:
        return f"Erro ao atualizar tarefa: {str(e)}"


@tool
def query_todos_tool(query: str) -> str:
    """
    Executa uma query SQL personalizada na tabela 'todos'.

    Use esta ferramenta quando precisar consultas específicas, filtros complexos ou quantidades de 'todos' em categorias ou datas especificas 
    que as outras tools não cobrem.

    Args:
        query (str): Query SQL para executar na tabela todos
                   (ex: "SELECT * FROM todos WHERE completed = false")

    Returns:
        str: Resultados da query formatados ou mensagem de erro
    """
    db = next(get_db())

    try:
        query_lower = query.lower().strip()
        if any(keyword in query_lower for keyword in ['insert', 'update', 'delete', 'drop', 'alter', 'create']):
            return "Erro: Apenas consultas SELECT são permitidas."

        if 'todos' not in query_lower:
            return "Erro: A query deve referenciar a tabela 'todos'."

        result = db.execute(text(query)).fetchall()

        if not result:
            return "Nenhum resultado encontrado para a query."

        response = [f"**Resultados da Query:**"]

        for i, row in enumerate(result, 1):
            row_data = []
            for key, value in dict(row._mapping).items():
                if isinstance(value, datetime):
                    value = value.strftime("%d/%m/%Y %H:%M")
                elif value is None:
                    value = "N/A"
                row_data.append(f"{key}: {value}")

            response.append(f"{i}. " + " | ".join(row_data))

        return "\n\n".join(response)

    except Exception as e:
        return f"Erro na execução da query: {str(e)}"
