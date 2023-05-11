import React from 'react'
import "./register.scss"
import image from "../images/register.jpg"
function Register() {
  return (
    <div className='register'>
        <div className="register-container">
            <form className="left">
                <h1>Sign in</h1>
                <input type="email" name="si-email" placeholder='Enter your E-Mail...' />
                <input type="password" name="si-password" placeholder='Enter your Password...' />
                <button>Sign in</button>
                <h5>Have already an account?</h5>
            </form>
            <div className="right">
                <a ><img src={image} alt="" /></a>
            </div>
        </div>
    </div>
  )
}

export default Register