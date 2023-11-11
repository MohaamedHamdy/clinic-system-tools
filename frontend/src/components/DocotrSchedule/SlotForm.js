import React, { useState } from 'react';
import axios from 'axios'

const SlotForm = ({ addSlot }) => {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');


  const slotAdded = async () => {
    try {
      const inResponse = await axios.post('http://localhost:3000/api/addSlot', { date, startTime });
      console.log('added successful.', inResponse.data);
    } catch (error) {
      console.error('Error sending data to server:', error);
    }
  };

  const handleAddSlot = () => {
    if (date && startTime && endTime) {
      addSlot({ date, startTime, endTime });
      setDate('');
      setStartTime('');
      setEndTime('');
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
      <input type="time" id="start-time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />

      <label htmlFor="end-time">End Time:</label>
      <input type="time" id="end-time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />

      <button onClick={handleAddSlot}>Add Slot</button>
    </div>
  );
};

export default SlotForm;