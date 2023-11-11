import React, { useState } from 'react';
import axios from 'axios';

const SlotList = () => {

  const [slots, setSlots] = useState([]);
  const [doctorSlotId, setDoctorId] = useState('');

  const fetchData = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/viewSlots', { doctorSlotId });
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
        {slots.map(slot => (
          <li key={slot.id}>
            Date: {slot.date}, Start Time: {slot.start_time},
          </li>
        ))}
      </ul>
      <p> there is ==== {slots.length}</p>
    </div>
  );
};

export default SlotList;
