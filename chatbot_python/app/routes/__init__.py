from .health import router as health_router
from .chat import router as chat_router

all_routers = [health_router, chat_router]
