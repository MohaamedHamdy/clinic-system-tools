// import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react'
import LoginSignup from './components/login_Signup/login_signup';
import DoctorSlots from './components/DocotrSchedule/DoctorSlots';
import PatientAppointment from './components/patientAppointment/patientAppointment';

function App() {

  const [userrole, setUserType] = useState(null);
  const test1 = (userrole) => {
    setUserType(userrole);
    console.log('Handling successful authentication with userType:', userrole);
  };
  return (

    <div>
      {userrole === 'Doctor' ? (
        <DoctorSlots />
      ) : userrole === 'Patient' ? (
        <PatientAppointment />
      ) : (


        <LoginSignup test1={test1} />
      )}




      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
    </div>
  );
}

export default App;
