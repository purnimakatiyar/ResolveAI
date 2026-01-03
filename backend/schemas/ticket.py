from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime


class TicketCreate(BaseModel):
    title: str
    description: str
    priority: Optional[str] = "low"
    category: Optional[str] = None


class TicketUpdate(BaseModel):
    status: Optional[str]
    priority: Optional[str]
    assigned_agent_id: Optional[UUID]


class TicketResponse(BaseModel):
    id: UUID
    title: str
    status: str
    priority: str
    category: Optional[str]
    sentiment: Optional[str]
    ai_confidence: Optional[int]
    is_auto_resolved: bool
    created_at: datetime

    class Config:
        orm_mode = True


class TicketMessageCreate(BaseModel):
    message: str
