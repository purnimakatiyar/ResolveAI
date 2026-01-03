from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, Text, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base
from sqlalchemy.sql import func
import uuid


Base = declarative_base()

class Tenant(Base):
    __tablename__ = "tenants"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False)
    email = Column(String, nullable=False)
    role = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False)

    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)

    status = Column(String, default="new")
    priority = Column(String, default="low")
    category = Column(String)

    sentiment = Column(String)
    ai_confidence = Column(Integer)

    assigned_agent_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)

    is_auto_resolved = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class TicketMessage(Base):
    __tablename__ = "ticket_messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ticket_id = Column(UUID(as_uuid=True), ForeignKey("tickets.id"), nullable=False)

    sender_type = Column(String)  # customer | agent | ai
    sender_id = Column(UUID(as_uuid=True), nullable=True)

    message = Column(Text, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())


class AIResponse(Base):
    __tablename__ = "ai_responses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ticket_id = Column(UUID(as_uuid=True), ForeignKey("tickets.id"))

    draft_response = Column(Text)
    confidence_score = Column(Integer)
    reasoning = Column(Text)

    was_approved = Column(Boolean, default=False)
    edited_by_agent = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

class SLATracker(Base):
    __tablename__ = "sla_trackers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ticket_id = Column(UUID(as_uuid=True), ForeignKey("tickets.id"))

    first_response_deadline = Column(DateTime)
    resolution_deadline = Column(DateTime)

    breached = Column(Boolean, default=False)

