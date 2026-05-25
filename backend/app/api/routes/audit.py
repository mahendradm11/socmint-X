import json

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db
from app.db.models import AuditLog, User

router = APIRouter(prefix="/audit", tags=["DPDP Audit"])


@router.get("/logs")
def list_audit_logs(
    limit: int = 50,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    logs = (
        db.query(AuditLog)
        .filter(AuditLog.user_id == user.username)
        .order_by(AuditLog.created_at.desc())
        .limit(min(limit, 200))
        .all()
    )
    return [
        {
            "id": log.id,
            "action": log.action,
            "resource_type": log.resource_type,
            "resource_id": log.resource_id,
            "details": json.loads(log.details_json or "{}"),
            "integrity_hash": log.integrity_hash,
            "created_at": log.created_at.isoformat() if log.created_at else None,
        }
        for log in logs
    ]
