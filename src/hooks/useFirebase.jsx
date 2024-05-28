import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Timestamp, doc, arrayUnion, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { v4 as uuid } from 'uuid';

export const useFirebase = () => {
    const { currentUser } = useContext(AuthContext);
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

    return { updateUserChatsDoc, updateChatsDoc };
}