from fastapi import APIRouter
from datetime import datetime

router = APIRouter(tags=["health"])


@router.get("/health")
async def heath_check():
    return {
        "status": "healthy",
        "service": "chatbot-ai",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }


@router.get("/")
async def root():
    return {
        "message": "Chatbot AI API is running",
        "docs": "/docs",
        "health": "/health"
    }
