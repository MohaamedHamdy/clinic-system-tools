import React, { useState } from 'react';
import SlotForm from './SlotForm';
import SlotList from './SlotList';

const DoctorSlots = ({ token }) => {
  const [slots, setSlots] = useState([]);

  const addSlot = (newSlot) => {
    setSlots([...slots, newSlot]);
  };

  return (
    <div className="App">
      <h1>Doctor schedule</h1>
      <SlotForm addSlot={addSlot} token={token} />
      <SlotList token={token} />
    </div>
  );
};

export default DoctorSlots;
