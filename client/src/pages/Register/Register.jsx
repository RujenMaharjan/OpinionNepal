import React from 'react'
import './Register.css';

const Register = () => {
  return (
    <div className='main'>
        <div className='secondary'>
              <div className='headerdiv'>
                <h1> OpinionNepal </h1>
                <span>Where you're heard.</span>
              </div>
              <div className='formdiv'>
                    <div className='inputfields'>
                        <span>Full Name:</span><input type="fullname" placeholder="Fullname" id="fullname" />
                        <span>Username:</span><input type="username" placeholder="Username" id="username" />
                        <span>Email:</span><input type="email" placeholder="name@gmail.com" name="" id="email" />
                        <span>Password:</span><input type="password" placeholder="Password" name="" id="password" />
                        <span>Confirm Password:</span><input type="password" placeholder="Confirm password" name="" id="confirmpassword" />
                    </div>
                    <button className='signupbtn'> Sign Up</button>
                    <button className='loginbtn'>Login to your Account</button>
              </div>         
        </div>
    </div>
  )
}

export default Register;