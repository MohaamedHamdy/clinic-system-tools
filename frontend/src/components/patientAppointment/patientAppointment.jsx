import React, { useState, useEffect } from 'react'
// import {apiService} from '../../utils/axiosInstance'
import axios from 'axios'




const PatientAppointment = ({ test1 }) => {

    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/doctors');
                setDoctors(response.data);
            } catch (error) {
                console.error('Error fetching doctors:', error);
                // Handle error, e.g., set an error state
            }
        };

        fetchDoctors();
    }, []);
    const [slots, setSlots] = useState();
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [selectedSlot, setSelectedSlot] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPassword] = useState('');
    const [userrole, setUserType] = useState('Patient');
    const [username, setName] = useState('');
    const [appointments, setAppointments] = useState([]);

    // const handleUserTypeChange = (event) => {
    //     setUserType(event.target.value);
    // };

    const onDoctorSelect = (e) => {
        const doctorId = e.target.value;
        setSelectedDoctor(doctorId);
    }

    useEffect(() => {
        const fetchDoctorSlots = async () => {
            try {
                const response = await axios.post('http://localhost:3001/api/viewSlots',{doctorSlotId: selectedDoctor});
                setSlots(response.data);
            } catch (error) {
                console.error('Error fetching doctor slots:', error);
                // Handle error, e.g., set an error state
            }
        };

        fetchDoctorSlots();
    }, [selectedDoctor]);


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
                        {doctors.map(doctor => (
                            <option key={doctor.userid} value={doctor.userid}>
                                {doctor.username}
                            </option>
                        ))}
                    </select>
                </div>
            </div>


            {slots && (<div className="inputs">
                <div className="input">
                    <label>Select Slot:</label>
                    <select
                        className="selector"
                        onChange={(e) => setSelectedSlot(e.target.value)}
                        value={selectedSlot}
                    >
                        <option value="">Select Slot</option>
                        {slots.map(slot => (
                            <option key={slot.slot_id} value={slot.slot_id}>
                                {new Date(slot.date).toDateString()}, {slot.start_time}
                            </option>
                        ))}
                    </select>
                </div>
            </div>)}

            <br />



            {/* login/sign up buttons */}
            <div className="submit-container">
                <div className={"submit"} >Reserve</div>
            </div>



            <div>
                <h2>Your Appointments</h2>
                <ul>
                    {appointments.map(appointment => (
                        <li key={appointment.id}>
                            {appointment.doctorName} - {appointment.slotTime}
                        </li>
                    ))}
                </ul>
            </div>

        </div>



    )
}


export default PatientAppointment