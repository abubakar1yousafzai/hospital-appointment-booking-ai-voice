# AGENT.md — Alex Voice Agent

## What This Is
Hospital appointment voice agent. Patients call → VAPI handles voice → hits FastAPI backend → SQLite. "Wayu" is the product name. Next.js frontend is a marketing/demo page with embedded voice widget.

---

## Stack (locked — no substitutions without ADR)

| Layer | Tool | Entry Point |
|---|---|---|
| Runtime | Python + `uv` | `pyproject.toml` |
| Backend | FastAPI | `backend.py` |
| Database | SQLite + SQLAlchemy | `database.py` → `hospital.db` |
| Test Dashboard | Streamlit | `dummy_frontend.py` |
| DB Inspection | raw sqlite3 | `db_demo.py` |
| Voice | VAPI (external) | configured in VAPI dashboard |
| Tunnel | ngrok | exposes port 8000 |
| Marketing Frontend | Next.js | `frontend/` |

---

## Run Commands

```powershell
# Backend
uv run uvicorn backend:app --reload

# Streamlit test dashboard
uv run streamlit run dummy_frontend.py

# DB inspection (read-only)
uv run python db_demo.py

# Next.js frontend
cd frontend && npm run dev
```

---

## API Endpoints

```
POST   /api/appointments           create appointment
DELETE /api/appointments/cancel    cancel (soft delete)
GET    /api/appointments?date=...  list by date (YYYY-MM-DD), optional ?patient_name=
GET    /api/doctors                list all doctors
```

### POST /api/appointments — body
```json
{ "patient_name": "str", "reason": "str", "date": "YYYY-MM-DD", "time": "HH:MM", "doctor_id": 1 }
```

### DELETE /api/appointments/cancel — body
```json
{ "patient_name": "str", "date": "YYYY-MM-DD", "time": "HH:MM (optional)" }
```
Returns `cancelled_count`. If 0 + `appointments` list → multiple matches, re-call with `time`.

---

## Database Schema

**doctors** — seeded on startup (Dr. Ahmed/Cardiology, Dr. Fatima/Gynecology, Dr. Hassan/General)
```
id | name | specialty | created_at
```

**appointments**
```
id | patient_name | reason | date | time | doctor_id | status | created_at
```
`status`: `"confirmed"` | `"cancelled"` — never hard delete.

---

## Hard Rules

- **No hard deletes.** Use `status = "cancelled"`.
- **No new top-level files** without a ratified ADR.
- **All endpoints return JSON.** Errors must include `{"message": "..."}`.
- **Constants at file top.** No hardcoded values inside functions.
- **Every function needs a docstring.**
- **All routes prefixed `/api/`.**
- **CORS fully open** (ngrok changes domain on restart).
- **Dates**: `YYYY-MM-DD`. **Times**: `HH:MM` (24h).
- **`dummy_frontend.py`** must NOT import SQLAlchemy or touch the DB directly.
- **`dummy_frontend.py`** must have exactly 3 tabs: Schedule / Cancel / Check.

---

## Environment Variables

```env
NEXT_PUBLIC_VAPI_PUBLIC_KEY=...       # Next.js voice widget
NEXT_PUBLIC_VAPI_ASSISTANT_ID=...    # VAPI assistant to start on mic press
```
Backend has no required env vars (SQLite is local, no auth).

---

## Next.js Frontend — Wayu

**Product**: "Alex" voice receptionist for Apollo Wellness Hospital. : English.

**Personas** (runtime-switchable): `receptionist` | `nurse` | `concierge`  
**Moods** (CSS `data-mood` on `<html>`): `apothecary` | `midnight` | `clinical` | `bedside`  
**Voice**: `VoiceWidget.tsx` — uses `@vapi-ai/web` SDK, connects to VAPI on mic press.

Key components: `WayuContext.tsx` (persona/mood data), `WayuTweaksPanel.tsx` (dev switcher), `VoiceWidget.tsx` (VAPI integration).

---

## Spec / History Layout

```
specs/
  001-database-layer/   spec + plan + tasks (done)
  002-backend/          spec + plan + tasks (done)
  003-frontend-dashboard/ spec + plan + tasks (current branch)
history/
  prompts/              PHRs by feature or stage
  adr/                  Architecture Decision Records
.specify/
  memory/constitution.md   canonical rules reference
  templates/               PHR + plan + spec + tasks templates
```
