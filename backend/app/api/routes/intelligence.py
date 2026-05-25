import json

from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.audit import log_action
from app.db.database import get_db
from app.db.models import AttributionRun, InvestigationCase, User
from app.schemas.attribution import (
    AttributionHistoryItem,
    AttributionRequest,
    AttributionResponse,
    ModalityScore,
)
from app.services.attribution.fusion import fuse_attribution
from app.services.behavioral.fingerprint import compare_accounts

router = APIRouter(prefix="/intelligence", tags=["Behavioral Intelligence"])


@router.post("/attribution", response_model=AttributionResponse)
def run_attribution(
    body: AttributionRequest,
    request: Request,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    posts_a = [{"text": p.text, "timestamp": p.timestamp} for p in body.account_a.posts]
    posts_b = [{"text": p.text, "timestamp": p.timestamp} for p in body.account_b.posts]

    comparison = compare_accounts(
        {"posts": posts_a},
        {"posts": posts_b},
    )
    fused = fuse_attribution(
        account_a_label=body.account_a.label,
        account_b_label=body.account_b.label,
        modality_raw=comparison["modality_raw"],
    )

    run = AttributionRun(
        case_id=body.case_id,
        account_a_label=body.account_a.label,
        account_b_label=body.account_b.label,
        confidence_score=fused["confidence_score"],
        risk_level=fused["risk_level"],
        modality_scores_json=json.dumps(fused["modality_scores"]),
        reasoning_chain_json=json.dumps(fused["reasoning_chain"]),
        created_by=user.username,
    )
    db.add(run)
    db.commit()
    db.refresh(run)

    if body.case_id:
        case = db.query(InvestigationCase).filter(InvestigationCase.id == body.case_id).first()
        if case and case.assigned_to == user.username:
            pass
        else:
            body.case_id = None

    log_action(
        db,
        user_id=user.username,
        action="ATTRIBUTION_RUN",
        resource_type="attribution_run",
        resource_id=str(run.id),
        details={
            "confidence": fused["confidence_score"],
            "risk_level": fused["risk_level"],
            "case_id": body.case_id,
        },
        ip_address=request.client.host if request.client else None,
    )

    return AttributionResponse(
        account_a=body.account_a.label,
        account_b=body.account_b.label,
        confidence_score=fused["confidence_score"],
        risk_level=fused["risk_level"],
        modality_scores=[ModalityScore(**m) for m in fused["modality_scores"]],
        reasoning_chain=fused["reasoning_chain"],
        fingerprint_a=comparison["fingerprint_a"],
        fingerprint_b=comparison["fingerprint_b"],
        run_id=run.id,
    )


@router.get("/attribution/history", response_model=list[AttributionHistoryItem])
def attribution_history(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    runs = (
        db.query(AttributionRun)
        .filter(AttributionRun.created_by == user.username)
        .order_by(AttributionRun.created_at.desc())
        .limit(50)
        .all()
    )
    return runs
