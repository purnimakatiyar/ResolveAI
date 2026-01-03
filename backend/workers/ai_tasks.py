from core.celery_app import celery_app
from ..services.ai_service import generate_ai_draft
from ..db.session import SessionLocal
from models.db import Ticket, AIResponse

@celery_app.task(bind=True, autoretry_for=(Exception,), retry_backoff=5, retry_kwargs={"max_retries": 3})
def generate_ai_draft_task(self, ticket_id: str):
    db = SessionLocal()
    try:
        ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
        if not ticket:
            return

        result = generate_ai_draft(ticket)

        ai_response = AIResponse(
            ticket_id=ticket.id,
            draft_response=result["draft"],
            confidence_score=result["confidence"],
            reasoning=result["reasoning"],
        )

        ticket.ai_confidence = result["confidence"]


        if result["confidence"] >= 85 and ticket.sentiment != "negative":
            ticket.is_auto_resolved = True
            ticket.status = "resolved"
        else:
            ticket.status = "assigned"

        db.add(ai_response)
        db.commit()

    finally:
        db.close()
