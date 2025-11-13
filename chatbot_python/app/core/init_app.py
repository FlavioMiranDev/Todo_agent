import re
import os
import psycopg2
from dotenv import load_dotenv
from sqlalchemy import create_engine
from app.core.database import Base
from app import models

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("Variável DATABASE_URL não encontrada no .env")


match = re.match(
    r"postgresql\+psycopg2://([^:]+):([^@]+)@([^:]+):(\d+)/(.+)", DATABASE_URL
)
if not match:
    raise ValueError("DATABASE_URL inválida.")

user, password, host, port, db_name = match.groups()

print("Criando banco de dados (se não existir)...")

try:

    conn = psycopg2.connect(
        dbname="postgres",
        user=user,
        password=password,
        host=host,
        port=port
    )
    conn.autocommit = True
    cur = conn.cursor()

    cur.execute(f"SELECT 1 FROM pg_database WHERE datname = '{db_name}'")
    exists = cur.fetchone()

    if not exists:
        cur.execute(f"CREATE DATABASE \"{db_name}\"")
        print(f"Banco de dados '{db_name}' criado com sucesso!")
    else:
        print(f"Banco de dados '{db_name}' já existe.")

    cur.close()
    conn.close()

except Exception as e:
    print(f"Erro ao criar banco de dados:\n\t{e}")
    exit(1)

print("Criando tabelas...")

try:
    engine = create_engine(DATABASE_URL)
    Base.metadata.create_all(bind=engine)
    print("Tabelas criadas com sucesso!")

except Exception as e:
    print(f"Erro ao criar tabelas:\n\t{e}")
    exit(1)
