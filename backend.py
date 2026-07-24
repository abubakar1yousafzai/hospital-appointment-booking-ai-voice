from datetime import datetime
from typing import List, Optional

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session

from database import Appointment, Doctor, get_db, init_db

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------
STATUS_CONFIRMED = "confirmed"
STATUS_CANCELLED = "cancelled"
MSG_DOCTOR_NOT_FOUND = "Doctor not found"
MSG_NO_APPOINTMENT = "No appointment found"
MSG_CANCELLED = "Appointment cancelled"
MSG_CLARIFY = "Multiple appointments found. Please clarify the time."

# ---------------------------------------------------------------------------
# App & middleware
# ---------------------------------------------------------------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    """Initialize the database and seed doctors on server start."""
    init_db()


# ---------------------------------------------------------------------------
# Pydantic models
# ---------------------------------------------------------------------------
class AppointmentRequest(BaseModel):
    """Request body for creating a new appointment."""

    patient_name: str
    reason: str
    time: str
    date: str
    doctor_id: int


class AppointmentResponse(BaseModel):
    """Response body for a single appointment."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    patient_name: str
    reason: str
    time: str
    date: str
    status: str
    created_at: datetime


class CancelAppointmentRequest(BaseModel):
    """Request body for cancelling an appointment."""

    patient_name: str
    date: str
    time: Optional[str] = None


class CancelAppointmentResponse(BaseModel):
    """Response body for a cancellation operation."""

    cancelled_count: int
    message: str
    appointments: Optional[List[dict]] = None


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------
@app.post("/api/appointments", response_model=AppointmentResponse)
def create_appointment(request: AppointmentRequest, db: Session = Depends(get_db)):
    """Create a new confirmed appointment for the given patient and doctor."""
    doctor = db.query(Doctor).filter(Doctor.id == request.doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail={"message": MSG_DOCTOR_NOT_FOUND})

    appointment = Appointment(
        patient_name=request.patient_name,
        reason=request.reason,
        time=request.time,
        date=request.date,
        doctor_id=request.doctor_id,
        status=STATUS_CONFIRMED,
    )
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return AppointmentResponse.model_validate(appointment)


@app.delete("/api/appointments/cancel", response_model=CancelAppointmentResponse)
def cancel_appointment(request: CancelAppointmentRequest, db: Session = Depends(get_db)):
    """Cancel a confirmed appointment by patient name and date.

    Handles disambiguation when multiple appointments exist on the same date:
    returns the list of times for the agent to read back to the patient.
    Never deletes rows — only updates status to cancelled.
    """
    matches = (
        db.query(Appointment)
        .filter(
            Appointment.patient_name == request.patient_name,
            Appointment.date == request.date,
            Appointment.status == STATUS_CONFIRMED,
        )
        .all()
    )

    if len(matches) == 0:
        raise HTTPException(status_code=404, detail={"message": MSG_NO_APPOINTMENT})

    if len(matches) == 1:
        matches[0].status = STATUS_CANCELLED
        db.commit()
        return CancelAppointmentResponse(cancelled_count=1, message=MSG_CANCELLED)

    if request.time is None:
        return CancelAppointmentResponse(
            cancelled_count=0,
            message=MSG_CLARIFY,
            appointments=[{"time": a.time} for a in matches],
        )

    target = next((a for a in matches if a.time == request.time), None)
    if target is None:
        raise HTTPException(status_code=404, detail={"message": MSG_NO_APPOINTMENT})

    target.status = STATUS_CANCELLED
    db.commit()
    return CancelAppointmentResponse(cancelled_count=1, message=MSG_CANCELLED)


@app.get("/api/appointments", response_model=List[AppointmentResponse])
def list_appointments(date: str, patient_name: Optional[str] = None, db: Session = Depends(get_db)):
    """Return appointments for the given date (YYYY-MM-DD).

    If patient_name is provided, results are further filtered to that patient only.
    """
    query = db.query(Appointment).filter(Appointment.date == date)
    if patient_name is not None:
        query = query.filter(Appointment.patient_name == patient_name)
    return [AppointmentResponse.model_validate(a) for a in query.all()]


@app.get("/api/doctors")
def list_doctors(db: Session = Depends(get_db)):
    """Return all doctors with their id, name, and specialty."""
    doctors = db.query(Doctor).all()
    return [{"id": d.id, "name": d.name, "specialty": d.specialty} for d in doctors]
