from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from db.session import get_db
from dependencies.auth import get_current_user, get_tenant_id
from schemas.ticket import (
    TicketCreate,
    TicketUpdate,
    TicketResponse,
    TicketMessageCreate,
)
from services.tickets_service import create_ticket, add_message
from models.db import Ticket, TicketMessage

router = APIRouter(prefix="/tickets", tags=["Tickets"])


@router.post("/", response_model=TicketResponse)
def create(
    payload: TicketCreate,
    db: Session = Depends(get_db),
    tenant_id: UUID = Depends(get_tenant_id),
):
    return create_ticket(db, tenant_id, payload)


@router.get("/", response_model=list[TicketResponse])
def list_tickets(
    status: str | None = None,
    db: Session = Depends(get_db),
    tenant_id: UUID = Depends(get_tenant_id),
):
    q = db.query(Ticket).filter(Ticket.tenant_id == tenant_id)
    if status:
        q = q.filter(Ticket.status == status)
    return q.order_by(Ticket.created_at.desc()).all()


@router.get("/{ticket_id}", response_model=TicketResponse)
def get_ticket(
    ticket_id: UUID,
    db: Session = Depends(get_db),
    tenant_id: UUID = Depends(get_tenant_id),
):
    ticket = db.query(Ticket).filter(
        Ticket.id == ticket_id,
        Ticket.tenant_id == tenant_id
    ).first()

    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    return ticket


@router.patch("/{ticket_id}")
def update_ticket(
    ticket_id: UUID,
    payload: TicketUpdate,
    db: Session = Depends(get_db),
    tenant_id: UUID = Depends(get_tenant_id),
):
    ticket = db.query(Ticket).filter(
        Ticket.id == ticket_id,
        Ticket.tenant_id == tenant_id
    ).first()

    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    for field, value in payload.dict(exclude_unset=True).items():
        setattr(ticket, field, value)

    db.commit()
    return {"status": "updated"}


@router.post("/{ticket_id}/messages")
def post_message(
    ticket_id: UUID,
    payload: TicketMessageCreate,
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return add_message(
        db,
        ticket_id,
        sender_type=user["role"],
        sender_id=user["sub"],
        message=payload.message,
    )


@router.get("/{ticket_id}/messages")
def get_messages(
    ticket_id: UUID,
    db: Session = Depends(get_db),
):
    return (
        db.query(TicketMessage)
        .filter(TicketMessage.ticket_id == ticket_id)
        .order_by(TicketMessage.created_at)
        .all()
    )


@router.post("/{ticket_id}/close")
def close_ticket(
    ticket_id: UUID,
    db: Session = Depends(get_db),
):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404)

    ticket.status = "closed"
    db.commit()
    return {"status": "closed"}
