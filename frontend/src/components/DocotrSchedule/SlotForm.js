import React, { useState } from 'react';
import axios from 'axios'

const SlotForm = ({ addSlot, token }) => {
  const [date, setDate] = useState('');
  const [start_time, setStartTime] = useState('');
  // const [endTime, setEndTime] = useState('');

  const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:3001';


  const slotAdded = async () => {
    try {
      const inResponse = await axios.post(`${serverUrl}/api/addSlot`, { date, start_time }, { headers: { Authorization: `Bearer ${token}` } });
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
