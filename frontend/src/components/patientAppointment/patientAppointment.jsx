import React, { useState, useEffect } from 'react'
import axios from 'axios'

const PatientAppointment = ({ test1, token }) => {
    const [doctors, setDoctors] = useState([]);
    const [slots, setSlots] = useState();
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [selectedSlot, setSelectedSlot] = useState();
    const [appointments, setAppointments] = useState();


    const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:3001';


    const getAppontments = () => {
        console.log("Fetching appointments with token:", token);
        const fetchAppointments = async () => {
            try {
                const response = await axios.get(`${serverUrl}/api/showAppointments`, { headers: { Authorization: `Bearer ${token}` } });
                console.log('Appointments fetched successfully:', response.data);
                setAppointments(response.data);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        }

        fetchAppointments();
    }

    const getSlots = () => {
        console.log("Fetching slots with token:", token);

        const fetchDoctorSlots = async () => {
            try {
                const response = await axios.post(
                    `${serverUrl}/api/patient/slots`,
                    { doctorSlotId: selectedDoctor },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                console.log('Slots fetched successfully:', response.data);
                setSlots(response.data);
            } catch (error) {
                console.error('Error fetching doctor slots:', error);
            }
        };

        fetchDoctorSlots();
    }


    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get(`${serverUrl}/api/doctors`, { headers: { Authorization: `Bearer ${token}` } });
                setDoctors(response.data);
            } catch (error) {
                console.error('Error fetching doctors:', error);
                // Handle error, e.g., set an error state
            }
        };
        fetchDoctors();
        getAppontments();

    }, []);

    const onDoctorSelect = (e) => {
        const doctorId = e.target.value;
        setSelectedDoctor(doctorId);
    }

    useEffect(() => {
        if (!selectedDoctor) return;
        getSlots();
    }, [selectedDoctor]);

    const onSlotSelect = (e) => {
        const slotId = e.target.value;
        setSelectedSlot(slotId);
    }

    const onReserveClick = () => {
        const reserveSlot = async () => {
            try {
                const response = await axios.post(`${serverUrl}/api/bookSlot`, { slotId: selectedSlot }, { headers: { Authorization: `Bearer ${token}` } });
                getSlots();
                getAppontments();
            } catch (error) {
                console.error('Error reserving slots:', error);
                // Handle error, e.g., set an error state
            }
        };

        reserveSlot();
    }

    const cancelAppointment = (appointment_id, slot_id) => {
        const cancelAppointmentCall = async () => {
            try {
                const response = await axios.delete(`${serverUrl}/api/cancelAppointment`, { data: { slotId: slot_id, appointmentId: appointment_id }, headers: { Authorization: `Bearer ${token}` } });
                getAppontments();
                if (selectedDoctor) getSlots();
            } catch (error) {
                console.error('Error canceling appointment:', error);
                // Handle error, e.g., set an error state
            }
        };

        cancelAppointmentCall();
    }


    return (
        <div className='container'>

            <div className="header">
                <div className="text">Hello, Patient</div>
                <div className="underline"></div>
            </div>

            <div className="inputs">
                <div className="input">
                    <h2>Doctor List</h2>

                    <label>Select Doctor:</label>
                    <select
                        className="selector"
                        onChange={(e) => onDoctorSelect(e)}
                        value={selectedDoctor}
                    >
                        <option value="" disabled>Select Doctor</option>
                        {doctors?.map(doctor => (
                            <option key={doctor.userid} value={doctor.userid}>
                                {doctor.username}
                            </option>
                        ))}
                    </select>
                </div>
            </div>


            <div className="inputs">
                <div className="input">
                    <label>Select Slot:</label>
                    <select
                        className="selector"
                        onChange={onSlotSelect}
                        value={selectedSlot}
                        disabled={!slots}
                    >
                        <option value="">Select Slot</option>
                        {slots?.map(slot => (
                            // <option key={slot.slot_id} value={slot.slot_id} disabled={!slot.availability}>
                            //     {new Date(slot.date).toDateString()}, {slot.start_time}
                            // </option>
                            <option
                                key={slot.slot_id}
                                value={slot.slot_id}
                            >
                                {new Date(slot.date).toDateString()}, {slot.start_time}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <br />



            {/* login/sign up buttons */}
            <div className="submit-container">
                <div className={"submit"} disabled={!selectedSlot} onClick={onReserveClick}>Reserve</div>
            </div>



            <div>
                <h2>Your Appointments</h2>
                <ul>
                    {appointments?.map(appointment => (
                        <li key={appointment.appointment_id}>
                            {appointment.appointment_id}
                            <button onClick={() => cancelAppointment(appointment.appointment_id, appointment.slot_id)}>Cancel</button>
                        </li>
                    ))}
                </ul>
            </div>

        </div >



    )
}


export default PatientAppointment