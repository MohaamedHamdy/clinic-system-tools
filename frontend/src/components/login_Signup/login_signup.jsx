import React, { useState } from 'react'
import axios from 'axios'
import './login_signup.css'
import user from '../assets/user.png'
import emailLogo from '../assets/email.png'
import passwordLogo from '../assets/lock.png'

const LoginSignup = ({ test1 }) => {

    const [token, setToken] = useState('');
    // const [doctors, setDoctors] = useState([]);
    const [action, setAction] = useState("Sign Up");
    const [email, setEmail] = useState("");
    const [pass, setPassword] = useState("");
    const [userrole, setUserType] = useState('Patient');
    const [username, setName] = useState('');

    const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:3001';

    console.log("SERVER URL  " + process.env.REACT_APP_SERVER_URL);
    const submitIn = async () => {
        try {
            const inResponse = await axios.post(`${serverUrl}/api/signIn`, { email, pass });
            console.log('authentication successful.', inResponse.data);

            const { token: authToken, userrole } = inResponse.data;
            console.log(authToken);
            setToken(authToken);
            test1(userrole, authToken)
        } catch (error) {
            console.error('Error sending data to server:', error);
        }
    };

    const submitUp = async () => {
        try {
            const upResponse = await axios.post(`${serverUrl}/api/signUp`, { email, pass, userrole, username });
        } catch (error) {
            console.error('Error sending data to server:', error);
        }
    };



    const handleUserTypeChange = (event) => {
        setUserType(event.target.value);
    };


    return (
        <div className='container'>

            <div className="header">
                <div className="text">{action}</div>
                <div className="underline"></div>
            </div>

            <div className="inputs">
                {action === "Log In" ? <div></div> : <div className="input">
                    <img src={user} alt="" />
                    <input type="text" onChange={(e) => { setName(e.target.value) }} placeholder='Username' />
                </div>}
            </div>

            <div className="inputs">
                <div className="input">
                    <img src={emailLogo} alt="" />
                    <input type="email" onChange={(e) => { setEmail(e.target.value) }} placeholder='Email' />
                </div>
            </div>

            <div className="inputs">
                <div className="input">
                    <img src={passwordLogo} alt="" />
                    <input type="password" onChange={(e) => { setPassword(e.target.value) }} placeholder='Password' />
                </div>
            </div>


            <div className='body'>
                {action === "Sign Up" ? <div><input className="button" type="submit" onClick={submitUp} /></div> : <input className="button2" type="submit" onClick={submitIn} />
                }
            </div>

            <br />

            {/* radio buttons to choose doctor or patient */}
            <div>
                {action === "Log In" ? <div></div> : <div className="role">
                    <label>
                        <input
                            type="radio"
                            value="Patient"
                            checked={userrole === 'Patient'}
                            onChange={handleUserTypeChange}
                        />
                        Patient
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="Doctor"
                            checked={userrole === 'Doctor'}
                            onChange={handleUserTypeChange}
                        />
                        Doctor
                    </label>


                </div>
                }
            </div>



            {/* login/sign up buttons */}
            <div className="submit-container">
                <div className={action === "Sign Up" ? "submit" : "submit grey"} onClick={() => setAction("Sign Up")}>Sign Up</div>
                <div className={action === "Log In" ? "submit" : "submit grey"} onClick={() => setAction("Log In")}>Log In</div>
            </div>
        </div>
    )
}


export default LoginSignup