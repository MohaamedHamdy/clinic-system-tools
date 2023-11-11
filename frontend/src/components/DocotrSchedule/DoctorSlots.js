import React, { useState } from 'react';
import SlotForm from './SlotForm';
import SlotList from './SlotList';

const DoctorSlots = () => {
  const [slots, setSlots] = useState([]);

  const addSlot = (newSlot) => {
    setSlots([...slots, newSlot]);
  };

  return (
    <div className="App">
      <h1>Doctor schedule</h1>
      <SlotForm addSlot={addSlot} />
      <SlotList />
    </div>
  );
};

export default DoctorSlots;
