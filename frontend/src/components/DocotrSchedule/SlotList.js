import React, { useState } from 'react';
import axios from 'axios';

const SlotList = ({ token }) => {

  const [slots, setSlots] = useState([]);
  const [doctorSlotId, setDoctorId] = useState('');

  const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:3001';


  // Example in SlotList.js
  const fetchData = async () => {
    try {
      console.log("Helloo" + token);
      const response = await axios.post(`${serverUrl}/api/doctor/slots`, { doctorSlotId }, { headers: { Authorization: `Bearer ${token}` } });
      console.log('Response:', response); // Log the entire response object
      console.log('Data fetched successfully.', response.data);
      setSlots(response.data);
    } catch (error) {
      console.error('Error fetching slots:', error);
    }
  };

  const handleDoctorIdChange = (event) => {
    setDoctorId(event.target.value);
  };
  return (


    <div>
      <h2>Available Slots</h2>
      <button onClick={fetchData}>Show Slots</button>
      <input type="number" value={doctorSlotId} onChange={handleDoctorIdChange} placeholder="Enter your ID" />
      <ul>
        {slots.map((slot, index) => (
          <li key={index}>
            Date: {slot.date}, Start Time: {slot.start_time},
          </li>
        ))}

      </ul>
      <p> there is ==== {slots.length}</p>
    </div>
  );
};

export default SlotList;
