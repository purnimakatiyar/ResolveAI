from pydantic import BaseModel
from typing import Optional
from uuid import UUID


class AIDraftRequest(BaseModel):
    draft_response: str
    confidence_score: int
    reasoning: Optional[str] = None
    sentiment: Optional[str] = None


class AIDraftResponse(BaseModel):
    ai_response_id: UUID
    confidence_score: int
    auto_resolve_eligible: bool


class AIApproveResponse(BaseModel):
    ticket_id: UUID
    status: str
    auto_resolved: bool
