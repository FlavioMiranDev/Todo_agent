from datetime import datetime
from langchain.tools import tool


@tool
def get_current_datetime_tool(any_input: str = None) -> str:
    """
    Retorna a data e hora atuais do sistema em formato brasileiro.
    Esta funcao nao requer nenhum parametro, mas pode receber qualquer texto que sera ignorado.
    """
    current_datetime = datetime.now()
    formatted_date = current_datetime.strftime("%d/%m/%Y")
    formatted_time = current_datetime.strftime("%H:%M:%S")

    return f"Data e Hora Atual: {formatted_date} às {formatted_time}"
