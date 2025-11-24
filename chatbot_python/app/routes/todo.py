import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.todo_service import Todo_service
from app.schemas.todo_schema import TodoResponse, TodoCreate, TodoUpdate

router = APIRouter(prefix="/todos", tags=["Todo"])


@router.get("/", response_model=list[TodoResponse])
def get_all(db: Session = Depends(get_db)):
    todo_service = Todo_service(db)

    return todo_service.get_all()


@router.get("/{todo_id}", response_model=TodoResponse)
def get_by_id(todo_id: uuid.UUID, db: Session = Depends(get_db)):
    todo_service = Todo_service(db)

    return todo_service.get_by_id(todo_id)


@router.post("/", response_model=TodoResponse)
def create_todo(todo_data: TodoCreate, db: Session = Depends(get_db)):
    todo_service = Todo_service(db)

    return todo_service.new(
        title=todo_data.title,
        category=todo_data.category,
        descript=todo_data.description,
        date=todo_data.date
    )


@router.put("/{todo_id}", response_model=TodoResponse)
def update_todo(todo_id: uuid.UUID, todo_data: TodoUpdate, db: Session = Depends(get_db)):
    todo_service = Todo_service(db)

    return todo_service.update(
        todo_id=todo_id,
        title=todo_data.title,
        category=todo_data.category,
        description=todo_data.description,
        date=todo_data.date
    )


@router.put("/complete/{todo_id}", response_model=TodoResponse)
def update_completed_todo(todo_id: uuid.UUID, completed: bool, db: Session = Depends(get_db)):
    todo_service = Todo_service(db)

    return todo_service.complete(todo_id, completed)


@router.delete("/{todo_id}")
def delete_todo(todo_id: uuid.UUID, db: Session = Depends(get_db)):
    todo_service = Todo_service(db)

    todo_service.delete(todo_id)

    return {"message": f"Delete todo with id:{todo_id} sucessfully"}
