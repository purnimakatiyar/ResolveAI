from fastapi import APIRouter, Depends
from workers.ai_tasks import generate_ai_draft_task
from dependencies.auth import get_current_user
from models.db import AIResponse, Ticket
from db.session import SessionLocal

router = APIRouter(prefix="/tickets")

@router.post("/{ticket_id}/ai/draft")
def draft_ai_response(ticket_id: str, user=Depends(get_current_user)):
    generate_ai_draft_task.delay(ticket_id)
    return {
        "status": "queued",
        "message": "AI draft generation started"
    }


@router.post("/{ticket_id}/ai/approve")
def approve_ai_response(ticket_id: str, user=Depends(get_current_user)):
    db = SessionLocal()

    ai_response = (
        db.query(AIResponse)
        .filter(AIResponse.ticket_id == ticket_id)
        .order_by(AIResponse.created_at.desc())
        .first()
    )

    if not ai_response:
        return {"error": "No AI response found"}

    ai_response.was_approved = True

    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    ticket.status = "resolved"

    db.commit()
    db.close()

    return {"status": "approved"}
