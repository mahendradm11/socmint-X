# SOCMINT Intelligence Platform

**AI-Driven SOCMINT Platform** — CID Karnataka Hackathon PS-03  
Cross-platform identity attribution via behavioral fingerprinting and explainable multi-modal fusion.

## Folder structure (aligned with proposal architecture)

```
socmint-platform/
├── backend/                          # FastAPI API Gateway
│   └── app/
│       ├── api/routes/               # auth, cases, intelligence, audit
│       ├── core/                     # config, JWT, DPDP audit logger
│       ├── db/                       # SQLAlchemy models (cases, audit, attribution)
│       ├── schemas/
│       └── services/
│           ├── behavioral/           # Phase 2: stylometry, temporal
│           └── attribution/          # Phase 5: fusion + explainable scoring
├── frontend/investigator-portal/     # React investigator portal
├── infrastructure/                   # Docker, nginx (future)
│   └── collection/                   # Phase 1 scrapers (later)
│   └── graph/                        # Phase 4 Neo4j (later)
└── docker-compose.yml
```

## Implemented features (real, in use)

| # | Feature | Proposal phase | What works now |
|---|---------|----------------|----------------|
| 1 | **Investigation case management** | Workflow 01, DPDP compliance | JWT login, create cases, seed indicators, role-scoped cases, SHA-256 audit log |
| 2 | **Behavioral fingerprint + explainable attribution** | Phase 2 + 5 | Stylometry, temporal Jaccard, TF-IDF NLP, weighted fusion, risk levels, reasoning chain |

## Deferred (structure reserved)

- Phase 1: OSINT collection (Playwright / Scrapy)
- Phase 3: Image hashing, username permutation at scale
- Phase 4: Neo4j graph + Louvain community detection
- Phase 5: PDF report export, Kafka pipeline
- Elasticsearch, Redis, full RBAC roles

## Quick start

### Backend

```powershell
cd d:\geleya\socmint-platform\backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

You must activate `.venv` first — running `uvicorn` without it uses system Python and causes `ModuleNotFoundError: pydantic_settings`.

If you see `WinError 10013` or “address already in use”, port 8000 is taken. Free it:

```powershell
Get-NetTCPConnection -LocalPort 8000 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

Or use another port: `uvicorn app.main:app --reload --port 8001` (and set Vite proxy target to `8001` in `frontend/investigator-portal/vite.config.ts`).

### Frontend

From `frontend` (shortcut) or `frontend\investigator-portal` (app root):

```powershell
cd d:\geleya\socmint-platform\frontend
npm run install:portal   # first time only
npm run dev
```

Or:

```powershell
cd d:\geleya\socmint-platform\frontend\investigator-portal
npm install
npm run dev
```

Open http://localhost:5173 — login: **investigator** / **cid2025**

**Enterprise UI modules:** Command Center · Identity Correlation (React Flow) · Behavioral Intel · Attribution Engine · Timeline · AI Co-Pilot · Evidence Reports · Cases · DPDP Audit. See `frontend/investigator-portal/ARCHITECTURE.md`.

### API docs

http://127.0.0.1:8000/docs

## Demo attribution

Use the pre-filled Kannada/English sample posts on the Attribution page — same writing style should yield **HIGH** or **CONFIRMED** with shared bigrams and temporal overlap in the reasoning chain.

## Legal note

Public-data investigation workflow only. Audit logs support DPDP Act 2023 purpose limitation and evidence integrity (IT Act Section 65B-ready hashing).
