from .health import router as health_router
from .chat import router as chat_router
from .upload import router as upload_router
from .todo import router as todo_router

all_routers = [health_router, chat_router, upload_router, todo_router]
