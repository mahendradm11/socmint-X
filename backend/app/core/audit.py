import hashlib
import json
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.db.models import AuditLog


def _hash_payload(payload: dict) -> str:
    canonical = json.dumps(payload, sort_keys=True, default=str)
    return hashlib.sha256(canonical.encode()).hexdigest()


def log_action(
    db: Session,
    *,
    user_id: str,
    action: str,
    resource_type: str,
    resource_id: str | None = None,
    details: dict | None = None,
    ip_address: str | None = None,
) -> AuditLog:
    payload = {
        "user_id": user_id,
        "action": action,
        "resource_type": resource_type,
        "resource_id": resource_id,
        "details": details or {},
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    entry = AuditLog(
        user_id=user_id,
        action=action,
        resource_type=resource_type,
        resource_id=resource_id,
        details_json=json.dumps(details or {}),
        ip_address=ip_address,
        integrity_hash=_hash_payload(payload),
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry
