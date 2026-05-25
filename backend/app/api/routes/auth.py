from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.audit import log_action
from app.core.security import create_access_token, verify_password
from app.db.database import get_db
from app.db.models import User
from app.schemas.auth import LoginRequest, TokenResponse, UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest, request: Request, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == body.username).first()
    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = create_access_token(user.username, user.role)
    log_action(
        db,
        user_id=user.username,
        action="LOGIN",
        resource_type="session",
        ip_address=request.client.host if request.client else None,
    )
    return TokenResponse(access_token=token, role=user.role, username=user.username)


@router.get("/me", response_model=UserResponse)
def me(user: User = Depends(get_current_user)):
    return UserResponse(username=user.username, role=user.role)
