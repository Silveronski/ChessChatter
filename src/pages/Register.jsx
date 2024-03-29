import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore"; 
import { useNavigate, Link } from 'react-router-dom';
import Add from "../assets/images/addAvatar.png";

const Register = () => {

    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const avatar = e.target[3].files[0];

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
                <form method='post' onSubmit={handleSubmit}>
                    <input type="text" placeholder='Display name'/>
                    <input type="email" placeholder='Email'/>                          
                    <input type="password" placeholder='Password'/>                       
                    <input style={{display:"none"}} type="file" id='img'/>
                    <label htmlFor="img">
                        <img src={Add}/>
                        <span>Add an Avatar</span>
                    </label>          
                    <button>Sign up</button>
                    {error && <span style={{color:"red"}}>Something went wrong...</span>}                                 
                </form>
                <p>Already have an account? <Link to="/login">Login</Link></p>
            </div>      
        </div>
    ) 
}

export default Register