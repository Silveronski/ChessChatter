import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase'

const Login = () => {
    const [error, setError] = useState(false);
    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
        e.preventDefault();     
        const email = e.target[0].value;
        const password = e.target[1].value;

        try {
            await signInWithEmailAndPassword(auth, email, password);                  
            navigate("/");                     
        }
        catch (err) {
            console.log(err);
            setError(true);
        }
    }

  return (
    <div className='form-container'> 
        <div className='form-wrapper'>
            <span className='logo'>Chess Chatter</span>
            <span className='title'>Login</span>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder='Email'/>            
                <input type="password" placeholder='Password'/>                                              
                <button>Sign in</button> 
                {error && <span style={{color:"red"}}>Something went wrong...</span>}                                 
            </form>
            <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>      
    </div>
  )
}

export default Login