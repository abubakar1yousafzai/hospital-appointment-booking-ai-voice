from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = "sqlite:///hospital.db"

SEED_DOCTORS = [
    {"name": "Dr. Ahmed", "specialty": "Cardiology"},
    {"name": "Dr. Fatima", "specialty": "Gynecology"},
    {"name": "Dr. Hassan", "specialty": "General"},
]

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Doctor(Base):
    """ORM model for the doctors table."""

    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    specialty = Column(String, nullable=False)
    created_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))


class Appointment(Base):
    """ORM model for the appointments table."""

    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, autoincrement=True)
    patient_name = Column(String, nullable=False)
    reason = Column(String, nullable=False)
    date = Column(String, nullable=False)
    time = Column(String, nullable=False)
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=False)
    status = Column(String, nullable=False, default="confirmed")
    created_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))


def get_db():
    """Yield a database session and ensure it is closed after use."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Create all tables and seed doctors if the doctors table is empty."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(Doctor).count() == 0:
            db.add_all([Doctor(**d) for d in SEED_DOCTORS])
            db.commit()
    finally:
        db.close()
