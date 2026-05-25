from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.db.database import Base


def utcnow():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(64), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(32), default="investigator")
    created_at = Column(DateTime, default=utcnow)


class InvestigationCase(Base):
    __tablename__ = "investigation_cases"

    id = Column(Integer, primary_key=True, index=True)
    case_number = Column(String(32), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, default="")
    status = Column(String(32), default="open")
    assigned_to = Column(String(64), nullable=False)
    created_at = Column(DateTime, default=utcnow)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)

    indicators = relationship("SeedIndicator", back_populates="case", cascade="all, delete-orphan")
    attributions = relationship("AttributionRun", back_populates="case", cascade="all, delete-orphan")


class SeedIndicator(Base):
    __tablename__ = "seed_indicators"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("investigation_cases.id"), nullable=False)
    indicator_type = Column(String(32), nullable=False)
    value = Column(String(512), nullable=False)
    platform = Column(String(64), default="unknown")
    label = Column(String(128), default="")
    created_at = Column(DateTime, default=utcnow)

    case = relationship("InvestigationCase", back_populates="indicators")


class AttributionRun(Base):
    __tablename__ = "attribution_runs"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("investigation_cases.id"), nullable=True)
    account_a_label = Column(String(128), nullable=False)
    account_b_label = Column(String(128), nullable=False)
    confidence_score = Column(Float, nullable=False)
    risk_level = Column(String(32), nullable=False)
    modality_scores_json = Column(Text, nullable=False)
    reasoning_chain_json = Column(Text, nullable=False)
    created_by = Column(String(64), nullable=False)
    created_at = Column(DateTime, default=utcnow)

    case = relationship("InvestigationCase", back_populates="attributions")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(64), nullable=False, index=True)
    action = Column(String(64), nullable=False)
    resource_type = Column(String(64), nullable=False)
    resource_id = Column(String(64), nullable=True)
    details_json = Column(Text, default="{}")
    ip_address = Column(String(45), nullable=True)
    integrity_hash = Column(String(64), nullable=False)
    created_at = Column(DateTime, default=utcnow, index=True)
