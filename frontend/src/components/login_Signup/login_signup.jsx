import React, { useState } from 'react'
import axios from 'axios'
import './login_signup.css'
import user from '../assets/user.png'
import emailLogo from '../assets/email.png'
import passwordLogo from '../assets/lock.png'

const LoginSignup = () => {

    const [action, setAction] = useState("Sign Up");
    const [email, setEmail] = useState("");
    const [pass, setPassword] = useState("");

    const submit = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/receiveData', { email, pass });
            
        } catch (error) {
            console.error('Error sending data to server:', error);
        }
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
                    <input type="text" placeholder='Username' />
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


            <div>
                {action === "Sign Up" ? <div></div> : <input type="submit" onClick={submit} />
                }
            </div>

            <div className="submit-container">
                <div className={action === "Sign Up" ? "submit" : "submit grey"} onClick={() => setAction("Sign Up")}>Sign Up</div>
                <div className={action === "Log In" ? "submit" : "submit grey"} onClick={() => setAction("Log In")}>Log In</div>
            </div>
        </div>
    )
}


export default LoginSignup