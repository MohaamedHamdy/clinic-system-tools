import React from 'react'
import './login_signup.css'
import user from '../assets/user.png'
import email from '../assets/email.png'
import password from '../assets/lock.png'

function LoginSignup() {
    return (
        <div className='container'>

            <div className="header">
                <div className="text">Sign Up</div>
                <div className="underline"></div>
            </div>

            <div className="inputs">
                <img src={user} alt="" />
                <input type="text" />
            </div>

            <div className="inputs">
                <img src={email} alt="" />
                <input type="email" />
            </div>

            <div className="inputs">
                <img src={password} alt="" />
                <input type="password" />
            </div>
            <div className="submit-container">
                <div className="submit">Sign Up</div>
                <div className="submit">Log In</div>
            </div>
        </div>
    )
}


export default LoginSignup