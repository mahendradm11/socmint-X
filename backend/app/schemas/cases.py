from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class SeedIndicatorCreate(BaseModel):
    indicator_type: str = Field(..., pattern="^(username|profile_url|image|keyword|text_corpus)$")
    value: str = Field(..., min_length=1, max_length=2000)
    platform: str = "unknown"
    label: str = ""


class CaseCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    description: str = ""
    seed_indicators: list[SeedIndicatorCreate] = []


class SeedIndicatorResponse(BaseModel):
    id: int
    indicator_type: str
    value: str
    platform: str
    label: str
    created_at: datetime

    class Config:
        from_attributes = True


class CaseResponse(BaseModel):
    id: int
    case_number: str
    title: str
    description: str
    status: str
    assigned_to: str
    created_at: datetime
    updated_at: Optional[datetime]
    indicators: list[SeedIndicatorResponse] = []

    class Config:
        from_attributes = True


class CaseListItem(BaseModel):
    id: int
    case_number: str
    title: str
    status: str
    indicator_count: int
    created_at: datetime

    class Config:
        from_attributes = True
