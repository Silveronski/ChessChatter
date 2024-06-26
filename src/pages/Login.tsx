import newLogo from '../assets/images/newLogo.png';
import loading from '../assets/images/loading.gif';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase/firebase';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useFirebase } from '../hooks/useFirebase';

interface LoginFormInputs {
    email: string,
    password: string
};

const Login: React.FC = () => {
    const [error, setError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate(); 
    const { userLogin } = useFirebase();
    const { register, formState: {errors}, handleSubmit } = useForm<LoginFormInputs>();
    const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => await handleLogin(data);

    const handleLogin = async (data: LoginFormInputs) => {   
        const email = data.email;
        const password = data.password;
        setIsLoading(true);
        try {
            const data = await signInWithEmailAndPassword(auth, email, password); 
            await userLogin(data.user.uid);                          
            navigate("/");                     
        }
        catch (_err) { setError(true); }                
        finally{
            setIsLoading(false);
        }
    }

    return (
        <div className='form-container'> 
            <div className='form-wrapper'>
                <span className='logo'><img src={newLogo}/></span>
                <span className='title'>Login</span>
                <form onSubmit={handleSubmit(onSubmit)}>

                    <input type="email" placeholder='Email' {...register("email",{required: true, pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i})}/> 
                    <span className='form-error'>
                        {errors.email?.type === "required" && "This field is required"}
                        {errors.email?.type === "pattern" && "Entered email is in wrong format"}
                    </span>

                    <input type="password" placeholder='Password' {...register("password",{required: true, minLength: 6, maxLength: 12})}/>
                    <span className='form-error'>
                        {errors.password?.type === "required" && "This field is required"}
                        {errors.password?.type === "minLength" && "Password must be at least 6 characters"}
                        {errors.password?.type === "maxLength" && "Password must not exceed 12 characters"}
                    </span>  

                    <button>Sign in</button> 
                    {error && <span style={{color:"red", textAlign:"center"}}>Incorrect password or email</span>}                                 
                </form>
                <p>Don't have an account? <Link to="/register">Register</Link></p>
                {isLoading && <img className='loading' src={loading}/>}
            </div>      
        </div>
    )
}

export default Login