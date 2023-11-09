import React, { useState } from 'react'
import './login_signup.css'
import user from '../assets/user.png'
import email from '../assets/email.png'
import password from '../assets/lock.png'

const LoginSignup = () => {

    const [action, setAction] = useState("Sign Up");


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
                    <img src={email} alt="" />
                    <input type="email" placeholder='Email' />
                </div>
            </div>

            <div className="inputs">
                <div className="input">
                    <img src={password} alt="" />
                    <input type="password" placeholder='Password' />
                </div>
            </div>
            <div className="submit-container">
                <div className={action === "Sign Up" ? "submit" : "submit grey"} onClick={() => setAction("Sign Up")}>Sign Up</div>
                <div className={action === "Log In" ? "submit" : "submit grey"} onClick={() => setAction("Log In")}>Log In</div>
            </div>
        </div>
    )
}


export default LoginSignup