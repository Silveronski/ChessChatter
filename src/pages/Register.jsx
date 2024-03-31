import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore"; 
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Add from "../assets/images/addAvatar.png";

const Register = () => {

    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const {register, formState: {errors}, handleSubmit} = useForm();

    const onSubmit = async (data) => await AddUser(data);        
                
    const AddUser = async (data) => {

        const displayName = data.displayName;
        const email = data.email;;
        const password = data.password;
        const avatar = data.image[0];

        console.log(displayName, email, password, avatar);

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            const storageRef = ref(storage, displayName); // creates a reference to the storage location where the avatar will be saved
                                                          // the name of the image will be the displayName
            const uploadTask = uploadBytesResumable(storageRef, avatar); // initiates the upload of the user's avatar to the storage location

            uploadTask.on(
                (error) => {
                    console.log(error);
                    setError(true);
                }, 
                () => {             
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        await updateProfile(res.user, {
                            displayName,
                            photoURL: downloadURL
                        });

                        await setDoc(doc(db, "users", res.user.uid),{
                            uid: res.user.uid,
                            displayName,
                            email,
                            photoURL: downloadURL
                        });

                        await setDoc(doc(db, "userChats", res.user.uid), {});
                        navigate("/");
                    });
                }
            );                      
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
                <span className='title'>Register</span>
                <form method='post' onSubmit={handleSubmit(onSubmit)}>
                
                    <input type="text" placeholder='Display name' {...register("displayName",{required: true})}/>
                    <span className='form-error'>
                        {errors.displayName?.type === "required" && "This field is required"}
                    </span>

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

                    <input style={{display:"none"}} type="file" id='img' {...register("image",{required: true})}/>
                    <label htmlFor="img">
                        <img src={Add}/>
                        <span>Add an Avatar</span>
                    </label>
                    <span className='form-error'>
                        {errors.image?.type === "required" && "This field is required"}
                    </span>

                    <button>Sign up</button>
                    {error && <span style={{color:"red"}}>Something went wrong...</span>} 

                </form>
                <p>Already have an account? <Link to="/login">Login</Link></p>
            </div>      
        </div>
    ) 
}

export default Register