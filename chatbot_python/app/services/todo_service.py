import uuid
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.todo_model import Todo
from app.services.embedding_service import EmbeddingService


class Todo_service:
    def __init__(self, db: Session):
        self.db = db
        self.embedder = EmbeddingService()

    def get_all(self):
        return self.db.query(Todo).all()

    def new(self, title: str, descript: str = None, category: str = None, date: datetime = None):
        embed = self.embedder.to_embedding(descript)
        db_todo = Todo(
            id=uuid.uuid4(),
            title=title,
            description=descript,
            category=category,
            embedding=embed,
            completed=False,
            date=date,
            created_at=datetime.now())

        self.db.add(db_todo)
        self.db.commit()
        self.db.refresh(db_todo)

        return db_todo

    def get_by_id(self, todo_id: uuid.UUID):
        todo = self.db.query(Todo).filter(Todo.id == todo_id).first()

        return todo

    def update(
            self,
            todo_id: uuid.UUID,
            title: str = None,
            category: str = None,
            description: str = None,
            date: datetime = None):

        todo = self.get_by_id(todo_id)

        if title is not None:
            todo.title = title

        if category is not None:
            todo.category = category

        if description is not None:
            embed = self.embedder.to_embedding(description)
            todo.embedding = embed
            todo.description = description

        if date is not None:
            todo.date = date

        self.db.commit()
        self.db.refresh(todo)

        return todo

    def complete(self, todo_id: uuid.UUID, completed: bool = True):
        todo = self.get_by_id(todo_id)

        todo.completed = completed

        self.db.commit()
        self.db.refresh(todo)

        return todo

    def delete(self, todo_id: uuid.UUID):
        todo = self.get_by_id(todo_id)

        self.db.delete(todo)
        self.db.commit()

    def semantic_search(self, query: str, limit: int = 5):
        query_embedding = self.embedder.to_embedding(query)

        results = self.db.query(Todo).filter(
            Todo.embedding.cosine_distance(query_embedding) < 0.8
        ).order_by(
            Todo.embedding.cosine_distance(query_embedding)
        ).limit(limit).all()

        return results
