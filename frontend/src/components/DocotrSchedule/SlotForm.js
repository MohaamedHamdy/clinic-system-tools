import React, { useState } from 'react';
import axios from 'axios'

const SlotForm = ({ addSlot }) => {
  const [date, setDate] = useState('');
  const [start_time, setStartTime] = useState('');
  // const [endTime, setEndTime] = useState('');


  const slotAdded = async () => {
    try {
      const inResponse = await axios.post('http://localhost:3001/api/addSlot', { date, start_time });
      console.log('added successful.', inResponse.data);
    } catch (error) {
      console.error('Error sending data to server:', error);
    }
  };

  const handleAddSlot = () => {
    if (date && start_time) {
      addSlot({ date, start_time });
      setDate('');
      setStartTime('');
      // setEndTime('');
      slotAdded();
    } else {
      // Handle error or validation
    }

  };

  return (
    <div>
      <label htmlFor="date">Date:</label>
      <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} />

      <label htmlFor="start-time">Start Time:</label>
      <input type="time" id="start-time" value={start_time} onChange={(e) => setStartTime(e.target.value)} />

      {/* <label htmlFor="end-time">End Time:</label>
      <input type="time" id="end-time" value={endTime} onChange={(e) => setEndTime(e.target.value)} /> */}

      <button onClick={handleAddSlot}>Add Slot</button>
    </div>
  );
};

export default SlotForm;
