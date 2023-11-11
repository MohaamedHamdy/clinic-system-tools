import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SlotList = () => {

  const [slots, setSlots] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/viewSlots')
      .then(response => {
        console.log(response.data); // Log the data to the console
        setSlots(response.data);
      })
      .catch(error => {
        console.error('Error fetching slots:', error);
      });
  }, []);


  return (


    <div>
      <h2>Available Slots</h2>
      <ul>
        {slots.map(slot => (
          <li key={slot.id}>
            Date: {slot.date}, Start Time: {slot.start_time}, Slot Id: {slot.slot_id}
          </li>
        ))}
      </ul>
      <p> there is ==== {slots.length}</p>
    </div>
  );
};

export default SlotList;
