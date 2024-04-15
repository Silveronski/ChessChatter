import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, doc, getDocs, setDoc } from "firebase/firestore"; 
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Add from "../assets/images/addAvatar.png";
import newLogo from '../assets/images/newLogo.png';
import loading from '../assets/images/loading.gif';
import defaultAvatar from '../assets/images/defaultAvatar.png';

const Register = () => {

    const [error, setError] = useState(false);
    const [avatarError, setAvatarError] = useState(false);
    const [avatarErrorMsg, setAvatarErrorMsg] = useState("");
    const [displayNameError, setDisplayNameError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const validImgExtensions = ["image/png", "image/jpeg", "image/gif"];

    const {register, formState: {errors}, handleSubmit} = useForm();
    const onSubmit = async (data) => await AddUser(data);  
    
    
    const AddUser = async (data) => {  

        const displayNameTaken = await isDisplayNameTaken(data.displayName);
        if (displayNameTaken) return;

        const displayName = data.displayName;
        const email = data.email;
        const password = data.password;
        let avatar = null;

        if (data.image[0]){
            if (!validImgExtensions.includes(data.image[0].type)) {
                setAvatarError(true); 
                setAvatarErrorMsg("Please select a valid file type (PNG/JPEG/GIF)");
                return;
            }
            else if (data.image[0].size > 80000) {
                setAvatarError(true); 
                setAvatarErrorMsg("Image must not exceed 80 kilobytes in size!");
                return;
            }
            setAvatarError(false); 
            avatar = data.image[0];        
        }
        else {
            imageUrlToFile(defaultAvatar, "defaultAvatar.png")
                .then((file) => {
                    avatar = file;
                })
                .catch((error) => {
                    console.error('Error:', error);
                    return;
                });
            setAvatarError(false);          
        }
             
        setIsLoading(true);

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            const storageRef = ref(storage, email); // creates a reference to the storage location where the avatar will be saved
                                                          // the name of the image will be the email
            const uploadTask = uploadBytesResumable(storageRef, avatar); // initiates the upload of the user's avatar to the storage location

            uploadTask.on(
                (error) => {
                    console.log(error);
                    setIsLoading(false);
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
                        setIsLoading(false);
                        navigate("/");
                    });
                }
            );                      
        }
        catch (err) {
            console.log(err);
            setIsLoading(false);
            setError(true);
        }
    }

    async function imageUrlToFile(imageUrl, fileName) {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], fileName);
        return file;
    }

    async function isDisplayNameTaken (displayName) {
        try {
            let displayNameTaken = false;
            const querySnapshot = await getDocs(collection(db, "users"));
            querySnapshot.forEach((doc) => { 
                if (doc.data().displayName === displayName) { 
                    console.log("match!", doc.data().displayName);
                    displayNameTaken = true; 
                    setDisplayNameError(true);        
                }                    
            });
            return displayNameTaken;
        } 
        catch (err) {
            console.error("Error searching for user:", err);
            setError(true);
            return true;
        }
    }

    return (
        <div className='form-container'> 
            <div className='form-wrapper'>
                <span className='logo'><img src={newLogo}/></span>
                <span className='title'>Register</span>
                <form method='post' onSubmit={handleSubmit(onSubmit)}>
                
                    <input onClick={() => setDisplayNameError(false)} type="text" placeholder='Display name' {...register("displayName",{required: true, pattern: /^(?!\s*$).{1,12}$/})}/>
                    <span className='form-error'>
                        {errors.displayName?.type === "required" && "This field is required"}
                        {errors.displayName?.type === "pattern" && "Display name must not exceed 12 characters"}
                        {displayNameError && "This display name is already taken!"}
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

                    <input style={{display:"none"}} type="file" id='img' {...register("image")}/>
                    <label htmlFor="img">
                        <img src={Add}/>
                        <span className='avatar-span'>Add an Avatar (Optional)</span>
                    </label>
                    <span className='form-error'>
                        {avatarError && avatarErrorMsg}
                    </span>              

                    <button>Sign up</button>
                    {error && <span className='generalError'>Something went wrong...</span>} 

                </form>
                <p>Already have an account? <Link to="/login">Login</Link></p>
                {isLoading && <img className='loading' src={loading}/>}
            </div>      
        </div>
    ) 
}

export default Register