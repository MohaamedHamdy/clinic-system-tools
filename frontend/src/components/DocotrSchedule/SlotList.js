import React from 'react';

const SlotList = ({ slots }) => {
  return (
    <div>
      <h2>Slots</h2>
      <ul>
        {slots.map((slot, index) => (
          <li key={index}>
            Date: {slot.date}, Start Time: {slot.start_time}, End Time: {slot.endTime}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SlotList;
