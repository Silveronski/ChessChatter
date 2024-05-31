import useToastr from "./useToastr";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Timestamp, doc, arrayUnion, serverTimestamp, updateDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { v4 as uuid } from 'uuid';
import { signOut, updateProfile } from "firebase/auth";
import { ChatContext } from "../context/ChatContext";
import { getDownloadURL } from "firebase/storage";

export const useFirebase = () => {
    const { currentUser } = useContext(AuthContext);
    const { dispatch } = useContext(ChatContext);

    const hourOfMsg = Timestamp.now().toDate().getHours().toString().length === 2 ? 
                    Timestamp.now().toDate().getHours() : "0"+ Timestamp.now().toDate().getHours() 
    const minOfMsg = Timestamp.now().toDate().getMinutes().toString().length === 2 ?
                    Timestamp.now().toDate().getMinutes() : "0"+ Timestamp.now().toDate().getMinutes();
    const timeOfMsg = hourOfMsg + ":" + minOfMsg;

    const updateUserChatsDoc = async (userIdToUpdate, chatId, msgText = "Image") => {
        try {
            await updateDoc(doc(db, "userChats", userIdToUpdate), {
                [chatId + ".lastMessage"] : {
                  text : msgText,
                  senderId: currentUser.uid         
                },
                [chatId + ".date"] : timeOfMsg,
                [chatId + ".fullDate"] : serverTimestamp()
            }); 
        } 
        catch (error) { throw error; }      
    }
    
    const updateChatsDoc = async (msgText, chatId, otherUserId, isImg = false, imgUrl = null) => {
        const message = {
            id: uuid(),
            text: msgText,
            senderId: currentUser.uid,
            receiverId: otherUserId,
            date: timeOfMsg,
            fullDate: Timestamp.now(),
        };
        
        if (isImg) message.img = imgUrl;
         
        try {
            await updateDoc(doc(db, "chats", chatId), {
                messages: arrayUnion(message)
            }); 
        } 
        catch (error) { throw error; }                            
    }

    const createUserChat = async (userDocToUpdate, otherUser, combinedId) => {
        try {
            await updateDoc(doc(db, "userChats", userDocToUpdate), {
                [combinedId + ".userInfo"] : {
                  uid: otherUser.uid,
                  displayName: otherUser.displayName,
                  photoURL: otherUser.photoURL,
                },
                [combinedId + ".date"]: Timestamp.now().toDate(),
            });   
        } 
        catch (error) { useToastr('error', 'There was a problem setting the caht with this user'); }       
    }

    const userSignout = async () => {
        try {      
            const userRef = doc(db, 'presence', currentUser.uid); 
            await updateDoc(userRef, { 
              count : 0,
              online: false, 
              hasShown: false 
            });
            await signOut(auth);
            dispatch({ type: "LOG_OUT", payload: {} });
        } 
        catch (error) { useToastr('error', ' There was an error logging out');  console.log(error)}       
    }

    const createUser = async (avatarUrl, userName, userEmail, res) => {
        try {
            getDownloadURL(avatarUrl).then(async (downloadURL) => {
                await updateProfile(res.user, {
                    displayName: userName,
                    photoURL: downloadURL
                });

                await setDoc(doc(db, "users", res.user.uid),{
                    uid: res.user.uid,
                    displayName: userName,
                    email: userEmail,
                    photoURL: downloadURL
                });

                await setDoc(doc(db, "userChats", res.user.uid), {});                   
            });
        } 
        catch (error) { throw error; }      
    }

    return { updateUserChatsDoc, updateChatsDoc, createUserChat, userSignout, createUser };
}