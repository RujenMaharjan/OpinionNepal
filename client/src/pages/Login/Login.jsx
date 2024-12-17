import React from 'react'
import './Login.css';

const Login = () => {
  return (
    <div className='main'>
        <div className='secondary'>
              <div className='headerdiv'>
                <h1> OpinionNepal </h1>
                <span>Where you're heard.</span>
              </div>
              <div className='formdiv'>
                    <div className='inputfields'>
                        <span id='email'>Email:</span><input type="email" placeholder="name@gmail.com" name="" id="email" />
                        <span id='password'>Password:</span><input type="password" placeholder="Password" name="" id="password" />
                    </div>
                    <button className='loginbtn'> Login</button>
                    <button className='signupbtn'>Create a new account</button>
              </div>         
        </div>
    </div>
  )
}

export default Login