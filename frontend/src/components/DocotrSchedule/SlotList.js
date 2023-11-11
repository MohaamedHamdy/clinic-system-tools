import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SlotList = ({ slots }) => {

  const [slotts, setSlots] = useState([]);

  axios.get('http://localhost:3001/api/viewSlots')
    .then(response => {
      setSlots(response.data);
    })
    .catch(error => {
      console.error('Error fetching slots:', error);
    });

  return (


    <div>
      <h2>Available Slots</h2>
      <ul>
        {slots.map(slot => (
          <li key={slot.id}>
            Date: {slot.date}, Start Time: {slot.start_time}, End Time: {slot.end_time}
          </li>
        ))}
      </ul>
      <p> there is ==== {slotts.length}</p>
    </div>
  );
};

export default SlotList;
