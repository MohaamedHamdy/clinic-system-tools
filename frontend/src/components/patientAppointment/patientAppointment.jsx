import React, { useState } from 'react'
import axios from 'axios'


const PatientAppointment = ({ test1 }) => {

    const [doctors, setDoctors] = useState([]);
    const [slots, setSlots] = useState([]);
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


    return (
        <div className='container'>

            <div className="header">
                <div className="text">Hello, Patient</div>
                <div className="underline"></div>
            </div>

            <div className="inputs">
                {<div className="input">
                    <label>Select Doctor:</label>
                    <select
                        className="selector"
                        onChange={(e) => setSelectedDoctor(e.target.value)}
                        value={selectedDoctor}
                    >
                        <option value="">Select Doctor</option>
                        {doctors.map(doctor => (
                            <option key={doctor.id} value={doctor.id}>
                                {doctor.name}
                            </option>
                        ))}
                    </select>
                </div>}
            </div>


            <div className="inputs">
                <div className="input">
                    <label>Select Slot:</label>
                    <select
                        className="selector"
                        onChange={(e) => setSelectedSlot(e.target.value)}
                        value={selectedSlot}
                    >
                        <option value="">Select Slot</option>
                        {slots.map(slot => (
                            <option key={slot.id} value={slot.id}>
                                {slot.time}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

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