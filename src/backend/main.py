from contextlib import asynccontextmanager

from uuid import uuid4
from datetime import datetime
from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

from .security import hash_password, verify_password

from . import models, schemas
from .database import Base, engine, get_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Backend radi"}

@app.get("/categories", response_model=list[schemas.CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    return db.query(models.Category).all()

@app.get("/categories/{category_id}", response_model=schemas.CategoryResponse)
def get_category(category_id: str, db: Session = Depends(get_db)):
    category = db.query(models.Category).filter(models.Category.id == category_id).first()

    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")

    return category


@app.post("/categories", response_model=schemas.CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db)):
    new_category = models.Category(
        id=uuid4().hex[:4],
        name=category.name,
        description=category.description,
        created_at=datetime.utcnow().isoformat(),
    )
    db.add(new_category)
    db.commit()
    db.refresh(new_category)

    return new_category



@app.patch("/categories/{category_id}", response_model=schemas.CategoryResponse)
def update_category(
    category_id: str,
    category_update: schemas.CategoryUpdate,
    db: Session = Depends(get_db),
):
    category = db.query(models.Category).filter(models.Category.id == category_id).first()

    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    update_data = category_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(category, key, value)
    db.commit()
    db.refresh(category)

    return category



@app.delete("/categories/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(category_id: str, db: Session = Depends(get_db)):
    category = db.query(models.Category).filter(models.Category.id == category_id).first()

    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")

    db.delete(category)
    db.commit()


@app.get("/tickets", response_model=list[schemas.TicketResponse])
def get_tickets(userId: str | None = None, db: Session = Depends(get_db)):
    query = db.query(models.Ticket)

    if userId:
        query = query.filter(models.Ticket.user_id == userId)

    return query.all()

@app.get("/tickets/{ticket_id}", response_model=schemas.TicketResponse)
def get_ticket(ticket_id: str, db: Session = Depends(get_db)):
    ticket = db.query(models.Ticket).filter(models.Ticket.id == ticket_id).first()

    if ticket is None:
        raise HTTPException(status_code=404, detail="Ticket not found")

    return ticket


@app.post("/tickets", response_model=schemas.TicketResponse, status_code=status.HTTP_201_CREATED)
def create_ticket(ticket: schemas.TicketCreate, db: Session = Depends(get_db)):
    new_ticket = models.Ticket(
        id=uuid4().hex[:4],
        user_id=ticket.user_id,
        title=ticket.title,
        description=ticket.description,
        status=ticket.status,
        category_id=ticket.category_id or "",
        created_at=datetime.utcnow().isoformat(),
    )

    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)

    return new_ticket

@app.patch("/tickets/{ticket_id}", response_model=schemas.TicketResponse)
def update_ticket(
    ticket_id: str,
    ticket_update: schemas.TicketUpdate,
    db: Session = Depends(get_db),
):
    ticket = db.query(models.Ticket).filter(models.Ticket.id == ticket_id).first()
    if ticket is None:
        raise HTTPException(status_code=404, detail="Ticket not found")
    update_data = ticket_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(ticket, key, value)
    db.commit()
    db.refresh(ticket)
    return ticket

@app.delete("/tickets/{ticket_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_ticket(ticket_id: str, db: Session = Depends(get_db)):
    ticket = db.query(models.Ticket).filter(models.Ticket.id == ticket_id).first()
    if ticket is None:
        raise HTTPException(status_code=404, detail="Ticket not found")
    db.delete(ticket)
    db.commit()


@app.get("/users", response_model=list[schemas.UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()


@app.get("/users/{user_id}", response_model=schemas.UserResponse)
def get_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return user

@app.post("/users", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()

    if existing_user is not None:
        raise HTTPException(status_code=400, detail="Email already exists")

    new_user = models.User(
        id=uuid4().hex[:4],
        name=user.name,
        last_name=user.last_name,
        email=user.email,
        password=hash_password(user.password),
        role=user.role,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user



@app.post("/auth/login", response_model=schemas.UserResponse)
def login_user(login_data: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == login_data.email).first()

    if user is None:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(login_data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return user