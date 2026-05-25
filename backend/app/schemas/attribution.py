from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class PostSample(BaseModel):
    text: str = Field(..., min_length=1)
    timestamp: Optional[str] = Field(
        None,
        description="ISO-8601 datetime, e.g. 2025-05-20T14:30:00+05:30",
    )


class AccountCorpus(BaseModel):
    label: str = Field(..., min_length=1, max_length=128)
    platform: str = "unknown"
    posts: list[PostSample] = Field(..., min_length=1)


class AttributionRequest(BaseModel):
    account_a: AccountCorpus
    account_b: AccountCorpus
    case_id: Optional[int] = None


class ModalityScore(BaseModel):
    modality: str
    weight: float
    score: float
    contribution: float
    evidence: str


class AttributionResponse(BaseModel):
    account_a: str
    account_b: str
    confidence_score: float
    risk_level: str
    modality_scores: list[ModalityScore]
    reasoning_chain: list[str]
    fingerprint_a: dict
    fingerprint_b: dict
    run_id: Optional[int] = None


class AttributionHistoryItem(BaseModel):
    id: int
    case_id: Optional[int]
    account_a_label: str
    account_b_label: str
    confidence_score: float
    risk_level: str
    created_at: datetime

    class Config:
        from_attributes = True
