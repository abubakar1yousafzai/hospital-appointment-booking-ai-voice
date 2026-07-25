import streamlit as st
import requests
from datetime import date as date_type, time as time_type

BASE_URL = "http://localhost:8000"


def get_doctors() -> list:
    """Call GET /api/doctors and return the list of doctors. Returns [] on error."""
    try:
        response = requests.get(f"{BASE_URL}/api/doctors")
        if response.status_code == 200:
            return response.json()
        st.warning("Could not load doctors — is the backend running?")
        return []
    except requests.ConnectionError:
        st.warning("Could not load doctors — is the backend running?")
        return []


def format_doctor(doctor: dict) -> str:
    """Return display string 'Dr. Name - Specialty' for a doctor dict."""
    return f"Dr. {doctor['name']} - {doctor['specialty']}"


def schedule_tab(doctors: list) -> None:
    """Render the Schedule Appointment tab.

    Accepts a list of doctor dicts from get_doctors(). On submit, sends a POST
    request to the backend and displays the new appointment ID on success.
    """
    patient_name = st.text_input("Patient Name", key="schedule_name")
    reason = st.text_input("Reason", key="schedule_reason")
    appt_date = st.date_input("Date", key="schedule_date")
    appt_time = st.time_input("Time", key="schedule_time")

    if doctors:
        doctor_opts = {format_doctor(d): d["id"] for d in doctors}
        selected_label = st.selectbox("Doctor", list(doctor_opts.keys()), key="schedule_doctor")
        doctor_id = doctor_opts[selected_label]
    else:
        st.warning("No doctors available — check that the backend is running.")
        doctor_id = None

    if st.button("Schedule Appointment"):
        if not patient_name or not reason:
            st.error("Patient name and reason are required.")
            return
        if doctor_id is None:
            st.error("No doctor selected — cannot schedule appointment.")
            return

        payload = {
            "patient_name": patient_name,
            "reason": reason,
            "date": appt_date.strftime("%Y-%m-%d"),
            "time": appt_time.strftime("%H:%M"),
            "doctor_id": doctor_id,
        }
        try:
            response = requests.post(f"{BASE_URL}/api/appointments", json=payload)
            if response.status_code == 200:
                data = response.json()
                st.success(f"Appointment scheduled! ID: {data['id']}")
            else:
                detail = response.json().get("detail", {})
                message = detail.get("message", "Unknown error") if isinstance(detail, dict) else str(detail)
                st.error(f"Error: {message}")
        except requests.ConnectionError:
            st.error("Backend not reachable — is it running on port 8000?")


def cancel_tab() -> None:
    """Render the Cancel Appointment tab.

    First call uses patient name + date only. If multiple appointments match,
    the backend returns a list of time slots; the user selects one and a second
    DELETE request is sent with the chosen time to resolve the ambiguity.
    """
    patient_name = st.text_input("Patient Name", key="cancel_name")
    cancel_date = st.date_input("Date", key="cancel_date_input")

    if st.button("Cancel Appointment"):
        if not patient_name:
            st.error("Patient name is required.")
            return
        payload = {
            "patient_name": patient_name,
            "date": cancel_date.strftime("%Y-%m-%d"),
        }
        try:
            response = requests.delete(f"{BASE_URL}/api/appointments/cancel", json=payload)
            if response.status_code == 404:
                st.warning("No appointment found.")
            elif response.status_code == 200:
                data = response.json()
                if data["cancelled_count"] == 1:
                    st.success("Appointment cancelled successfully.")
                    for key in ("cancel_appointments", "cancel_patient_name", "cancel_date"):
                        st.session_state.pop(key, None)
                elif data["cancelled_count"] == 0 and data.get("appointments"):
                    st.session_state["cancel_appointments"] = data["appointments"]
                    st.session_state["cancel_patient_name"] = patient_name
                    st.session_state["cancel_date"] = cancel_date.strftime("%Y-%m-%d")
                    st.info("Multiple appointments found. Select a time slot below.")
                else:
                    st.warning("No appointment found.")
            else:
                detail = response.json().get("detail", {})
                message = detail.get("message", "Unknown error") if isinstance(detail, dict) else str(detail)
                st.error(f"Error: {message}")
        except requests.ConnectionError:
            st.error("Backend not reachable — is it running on port 8000?")

    if st.session_state.get("cancel_appointments"):
        times = [a["time"] for a in st.session_state["cancel_appointments"]]
        chosen_time = st.radio("Multiple appointments found. Select the time to cancel:", times)
        if st.button("Confirm Cancellation"):
            payload = {
                "patient_name": st.session_state["cancel_patient_name"],
                "date": st.session_state["cancel_date"],
                "time": chosen_time,
            }
            try:
                response = requests.delete(f"{BASE_URL}/api/appointments/cancel", json=payload)
                if response.status_code == 200:
                    st.success("Appointment cancelled.")
                    for key in ("cancel_appointments", "cancel_patient_name", "cancel_date"):
                        st.session_state.pop(key, None)
                elif response.status_code == 404:
                    st.warning("No appointment found.")
                else:
                    detail = response.json().get("detail", {})
                    message = detail.get("message", "Unknown error") if isinstance(detail, dict) else str(detail)
                    st.error(f"Error: {message}")
            except requests.ConnectionError:
                st.error("Backend not reachable — is it running on port 8000?")


def check_tab() -> None:
    """Render the Check Appointments tab.

    Fetches all appointments for the selected date and displays them in a
    table. Shows an info message when no appointments exist for that date.
    """
    check_date = st.date_input("Date", key="check_date")

    if st.button("Check"):
        try:
            response = requests.get(
                f"{BASE_URL}/api/appointments",
                params={"date": check_date.strftime("%Y-%m-%d")},
            )
            if response.status_code == 200:
                data = response.json()
                if data:
                    st.dataframe(data)
                else:
                    st.info("No appointments found for this date.")
            else:
                detail = response.json().get("detail", {})
                message = detail.get("message", "Unknown error") if isinstance(detail, dict) else str(detail)
                st.error(f"Error: {message}")
        except requests.ConnectionError:
            st.error("Backend not reachable — is it running on port 8000?")


def main() -> None:
    """Entry point: render the page title, load doctors, and render all three tabs."""
    st.title("Hospital Appointment Dashboard")
    doctors = get_doctors()
    tab1, tab2, tab3 = st.tabs(
        ["Schedule Appointment", "Cancel Appointment", "Check Appointments"]
    )
    with tab1:
        schedule_tab(doctors)
    with tab2:
        cancel_tab()
    with tab3:
        check_tab()


if __name__ == "__main__":
    main()
