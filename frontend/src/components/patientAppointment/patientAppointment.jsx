import React, { useState, useEffect } from 'react';
import axios from 'axios'


const PatientAppointment = () => {

    const [doctors, setDoctors] = useState([]);
    const [slots, setSlots] = useState([]);
    const [doctorSlotId, setSelectedDoctor] = useState('');
    const [selectedSlot, setSelectedSlot] = useState('');
    const [appointments, setAppointments] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/doctors');
            console.log('Data fetched successfully.', response.data);
            setDoctors(response.data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    const fetchSlots = async (doctorSlotID) => {
        try {
            const response = await axios.post('http://localhost:3001/api/viewSlots', { doctorSlotID });
            console.log('slots fetched successfully.', response.data);
            setSlots(response.data);
        } catch (error) {
            console.error('Error fetching slots:', error);
        }
    };





    // const fetchData ()=>{}

    const handleUserTypeChange = (event) => {

        setSelectedDoctor(event.target.value);
        fetchSlots(doctorSlotId);
        console.log("here is the id" + doctorSlotId);
    };


    return (
        <div className='container'>

            <div className="header">
                <div className="text">Hello, Patient</div>
                <div className="underline"></div>
            </div>

            <div className="inputs">
                {<div className="input">
                    <label >Select Doctor:</label>
                    <select
                        className="selector"
                        onChange={(e) => setSelectedDoctor(e.target.value)}
                        value={doctorSlotId}
                        onClick={fetchData}
                    >
                        <option value="" >Select Doctor</option>
                        {doctors.map(doctor => (
                            <option key={doctor.id} value={doctor.id} onClick={handleUserTypeChange}>
                                {doctor.username}
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
                                {slot.start_time}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <br />



            {/* login/sign up buttons */}
            <div className="submit-container">
                <div className={"submit"} onClick={handleUserTypeChange}>Reserve</div>
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

        </div >



    )
}


export default PatientAppointment