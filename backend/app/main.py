from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import audit, auth, cases, intelligence
from app.core.config import settings
from app.core.security import hash_password
from app.db.database import SessionLocal, init_db
from app.db.models import User


def seed_default_user():
    db = SessionLocal()
    try:
        if not db.query(User).filter(User.username == "investigator").first():
            db.add(
                User(
                    username="investigator",
                    hashed_password=hash_password("cid2025"),
                    role="investigator",
                )
            )
            db.commit()
    finally:
        db.close()


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    seed_default_user()
    yield


app = FastAPI(
    title=settings.app_name,
    description="AI-Driven SOCMINT Platform — CID Karnataka Hackathon PS-03",
    version="0.1.0",
    lifespan=lifespan,
)

origins = [o.strip() for o in settings.cors_origins.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api = settings.api_prefix
app.include_router(auth.router, prefix=api)
app.include_router(cases.router, prefix=api)
app.include_router(intelligence.router, prefix=api)
app.include_router(audit.router, prefix=api)


@app.get("/health")
def health():
    return {"status": "ok", "platform": "SOCMINT", "phase": "initial"}
