import sqlite3

DB_PATH = "hospital.db"


def print_doctors(cursor):
    """Print all rows from the doctors table with a section header."""
    print("\n=== DOCTORS ===")
    try:
        cursor.execute("SELECT id, name, specialty, created_at FROM doctors")
        rows = cursor.fetchall()
        if rows:
            for row in rows:
                print(f"  [{row[0]}] {row[1]} - {row[2]}  (created: {row[3]})")
        else:
            print("  No doctors found.")
    except sqlite3.OperationalError:
        print("  Table 'doctors' does not exist yet.")


def print_appointments(cursor):
    """Print all rows from the appointments table with a section header."""
    print("\n=== APPOINTMENTS ===")
    try:
        cursor.execute(
            "SELECT id, patient_name, reason, date, time, doctor_id, status FROM appointments"
        )
        rows = cursor.fetchall()
        if rows:
            for row in rows:
                print(
                    f"  [{row[0]}] {row[1]} | {row[2]} | {row[3]} {row[4]}"
                    f" | doctor_id={row[5]} | status={row[6]}"
                )
        else:
            print("  No appointments found.")
    except sqlite3.OperationalError:
        print("  Table 'appointments' does not exist yet.")


def print_counts(cursor):
    """Print total confirmed and cancelled appointment counts."""
    print("\n=== APPOINTMENT COUNTS ===")
    try:
        cursor.execute("SELECT COUNT(*) FROM appointments WHERE status = 'confirmed'")
        confirmed = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM appointments WHERE status = 'cancelled'")
        cancelled = cursor.fetchone()[0]
        print(f"  Confirmed : {confirmed}")
        print(f"  Cancelled : {cancelled}")
    except sqlite3.OperationalError:
        print("  Table 'appointments' does not exist yet.")


def main():
    """Connect to hospital.db and print doctors, appointments, and status counts."""
    conn = None
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        print_doctors(cursor)
        print_appointments(cursor)
        print_counts(cursor)
    except sqlite3.OperationalError as exc:
        print(f"Could not connect to database: {exc}")
    finally:
        if conn:
            conn.close()


if __name__ == "__main__":
    main()
