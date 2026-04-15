from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, Literal

class UserBase(BaseModel):
    name: str
    last_name: str = Field(alias="lastName")
    email: str
    role: Literal["user", "admin"] = "user"

    model_config = ConfigDict(
        populate_by_name = True,
        #omogucava da koristimo alias i python ime
        from_attributes = True,
        #omogucava da Pydantic radi sa SQLAlchemy objektma
    )


class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str

class TicketBase(BaseModel):
    user_id: str = Field(alias="userId")
    title: str
    description: str
    status: Literal["open", "in_progress", "closed"]
    category_id: Optional[str] = Field(default="", alias="categoryId")

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
    )

class TicketCreate(TicketBase):
    pass

class TicketUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[Literal["open", "in_progress", "closed"]] = None
    category_id: Optional[str] = Field(default=None, alias="categoryId")
    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
    )
class TicketResponse(TicketBase):
    id: str
    created_at: str = Field(alias="createdAt")

class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
    )

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
    )

class CategoryResponse(CategoryBase):
    id: str
    created_at: Optional[str] = Field(default=None, alias="createdAt")


class LoginRequest(BaseModel):
    email: str
    password: str

class AuthUserResponse(BaseModel):
    id: str
    name: str
    last_name: str = Field(alias="lastName")
    email: str
    role: Literal["user", "admin"] = "user"

    model_config = ConfigDict(
        populate_by_name=True, #omogucava koriscenje i lastName i last_name
        from_attributes=True, #Pydantic moze da uzme objekte iz baze i pretvori ih u JSON
    )