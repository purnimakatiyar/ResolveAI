from sqlalchemy.orm import Session
from uuid import UUID
from models.db import Ticket, TicketMessage, SLATracker
from datetime import datetime, timedelta


def create_ticket(db: Session, tenant_id: UUID, data):
    ticket = Ticket(
        tenant_id=tenant_id,
        title=data.title,
        description=data.description,
        priority=data.priority,
        category=data.category,
        status="new"
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)

    # SLA setup
    sla = SLATracker(
        ticket_id=ticket.id,
        first_response_deadline=datetime.utcnow() + timedelta(minutes=5),
        resolution_deadline=datetime.utcnow() + timedelta(hours=24),
    )
    db.add(sla)
    db.commit()

    return ticket


def add_message(db: Session, ticket_id: UUID, sender_type: str, sender_id, message: str):
    msg = TicketMessage(
        ticket_id=ticket_id,
        sender_type=sender_type,
        sender_id=sender_id,
        message=message
    )
    db.add(msg)
    db.commit()
    return msg
