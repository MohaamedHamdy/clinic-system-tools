import React, { useState } from 'react';

const SlotForm = ({ addSlot }) => {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleAddSlot = () => {
    if (date && startTime && endTime) {
      addSlot({ date, startTime, endTime });
      setDate('');
      setStartTime('');
      setEndTime('');
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
