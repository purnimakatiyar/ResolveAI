from core.celery_app import celery_app
from services.ai_service import generate_ai_draft
from db.session import SessionLocal
from models.db import Ticket, AIResponse
from google.genai.errors import ServerError

import logging

logger = logging.getLogger(__name__)


@celery_app.task(
    name="core.ai_tasks.generate_ai_draft_task",
    bind=True,
    autoretry_for=(ServerError, ConnectionError, TimeoutError),
    retry_backoff=5,
    retry_kwargs={"max_retries": 3},
)
def generate_ai_draft_task(self, ticket_id: str):
    task_id = self.request.id
    logger.info(
        "AI draft task started",
        extra={"task_id": task_id, "ticket_id": ticket_id},
    )

    db = SessionLocal()

    try:

        ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
        if not ticket:
            logger.warning(
                "Ticket not found, aborting task",
                extra={"task_id": task_id, "ticket_id": ticket_id},
            )
            return

        logger.info(
            "Ticket fetched successfully",
            extra={"task_id": task_id, "ticket_id": ticket_id},
        )


        logger.info(
            "Calling AI draft generator",
            extra={"task_id": task_id, "ticket_id": ticket_id},
        )

        result = generate_ai_draft(ticket)

        logger.info(
            "AI draft generated successfully",
            extra={
                "task_id": task_id,
                "ticket_id": ticket_id,
                "confidence": result.get("confidence"),
            },
        )

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
            logger.info(
                "Ticket auto-resolved by AI",
                extra={"task_id": task_id, "ticket_id": ticket_id},
            )
        else:
            ticket.status = "assigned"
            logger.info(
                "Ticket assigned for manual review",
                extra={"task_id": task_id, "ticket_id": ticket_id},
            )

        db.add(ai_response)
        db.commit()

        logger.info(
            "AI response saved successfully",
            extra={"task_id": task_id, "ticket_id": ticket_id},
        )

    except Exception as exc:
        logger.exception(
            "AI draft task failed",
            extra={"task_id": task_id, "ticket_id": ticket_id},
        )
        raise exc

    finally:
        db.close()
        logger.info(
            "DB session closed",
            extra={"task_id": task_id, "ticket_id": ticket_id},
        )
