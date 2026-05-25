from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.audit import log_action
from app.db.database import get_db
from app.db.models import InvestigationCase, SeedIndicator, User
from app.schemas.cases import CaseCreate, CaseListItem, CaseResponse, SeedIndicatorCreate, SeedIndicatorResponse

router = APIRouter(prefix="/cases", tags=["Investigation Cases"])


def _next_case_number(db: Session) -> str:
    year = datetime.now(timezone.utc).year
    count = db.query(InvestigationCase).count() + 1
    return f"CID-{year}-{count:04d}"


@router.post("", response_model=CaseResponse, status_code=status.HTTP_201_CREATED)
def create_case(
    body: CaseCreate,
    request: Request,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    case = InvestigationCase(
        case_number=_next_case_number(db),
        title=body.title,
        description=body.description,
        assigned_to=user.username,
    )
    db.add(case)
    db.flush()

    for ind in body.seed_indicators:
        db.add(
            SeedIndicator(
                case_id=case.id,
                indicator_type=ind.indicator_type,
                value=ind.value,
                platform=ind.platform,
                label=ind.label,
            )
        )

    db.commit()
    db.refresh(case)

    log_action(
        db,
        user_id=user.username,
        action="CASE_CREATE",
        resource_type="investigation_case",
        resource_id=str(case.id),
        details={"case_number": case.case_number, "indicators": len(body.seed_indicators)},
        ip_address=request.client.host if request.client else None,
    )
    return case


@router.get("", response_model=list[CaseListItem])
def list_cases(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    cases = (
        db.query(InvestigationCase)
        .filter(InvestigationCase.assigned_to == user.username)
        .order_by(InvestigationCase.created_at.desc())
        .all()
    )
    return [
        CaseListItem(
            id=c.id,
            case_number=c.case_number,
            title=c.title,
            status=c.status,
            indicator_count=len(c.indicators),
            created_at=c.created_at,
        )
        for c in cases
    ]


@router.get("/{case_id}", response_model=CaseResponse)
def get_case(case_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    case = db.query(InvestigationCase).filter(InvestigationCase.id == case_id).first()
    if not case or case.assigned_to != user.username:
        raise HTTPException(status_code=404, detail="Case not found")
    return case


@router.post("/{case_id}/indicators", response_model=SeedIndicatorResponse)
def add_indicator(
    case_id: int,
    body: SeedIndicatorCreate,
    request: Request,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    case = db.query(InvestigationCase).filter(InvestigationCase.id == case_id).first()
    if not case or case.assigned_to != user.username:
        raise HTTPException(status_code=404, detail="Case not found")

    indicator = SeedIndicator(
        case_id=case.id,
        indicator_type=body.indicator_type,
        value=body.value,
        platform=body.platform,
        label=body.label,
    )
    db.add(indicator)
    db.commit()
    db.refresh(indicator)

    log_action(
        db,
        user_id=user.username,
        action="INDICATOR_ADD",
        resource_type="seed_indicator",
        resource_id=str(indicator.id),
        details={"case_id": case_id, "type": body.indicator_type},
        ip_address=request.client.host if request.client else None,
    )
    return indicator

