from fastapi import FastAPI
from dotenv import load_dotenv

from app.middlewares.error_handler import error_handler_middleware

from app.routes import all_routers

load_dotenv()

app = FastAPI(
    title="Chatbot AI API",
    description="API para chatbot usando Gemini AI e LangChain",
    version="1.0.0"
)

app.middleware("http")(error_handler_middleware)

for router in all_routers:
    app.include_router(router)
