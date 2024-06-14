import { useAuthContext } from "../context/AuthContext";
import { Timestamp, doc, arrayUnion, serverTimestamp, updateDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { v4 as uuid } from 'uuid';
import { User, signOut, updateProfile } from "firebase/auth";
import { useChatContext } from "../context/ChatContext";
import { StorageReference, getDownloadURL } from "firebase/storage";
import { useToastr } from "./useToastr";

export const useFirebase = () => {
    const { currentUser } = useAuthContext();
    const { dispatch } = useChatContext();

    const hourOfMsg = Timestamp.now().toDate().getHours().toString().length === 2 ? 
                    Timestamp.now().toDate().getHours() : "0"+ Timestamp.now().toDate().getHours() 
    const minOfMsg = Timestamp.now().toDate().getMinutes().toString().length === 2 ?
                    Timestamp.now().toDate().getMinutes() : "0"+ Timestamp.now().toDate().getMinutes();
    const timeOfMsg = hourOfMsg + ":" + minOfMsg;

    const updateUserChatsDoc = async (userIdToUpdate: string, chatId?: string, msgText = "Image") => {
        try {
            await updateDoc(doc(db, "userChats", userIdToUpdate), {
                [chatId + ".lastMessage"] : {
                  text : msgText,
                  senderId: currentUser?.uid         
                },
                [chatId + ".date"] : timeOfMsg,
                [chatId + ".fullDate"] : serverTimestamp()
            }); 
        } 
        catch (error) { throw error; }      
    }
    
    const updateChatsDoc = async (msgText: string, chatId: string, otherUserId: string, isImg = false, imgUrl: string | null = null) => {
        const message: any = {
            id: uuid(),
            text: msgText,
            senderId: currentUser?.uid,
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

    const createUserChat = async (userDocToUpdate: string, otherUser: User, combinedId: string) => {
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
        catch (error) { useToastr('There was a problem setting the caht with this user', 'error'); }       
    }

    const userSignout = async () => {
        try {      
            const userRef = doc(db, 'presence', currentUser!.uid); 
            await updateDoc(userRef, { 
              count : 0,
              online: false, 
              hasShown: false 
            });
            await signOut(auth);
            dispatch({ type: "LOG_OUT", payload: {} });
        } 
        catch (error) { useToastr('There was an error logging out', 'error'); }       
    }

    const userLogin = async (userId: string) => {
        const userRef = doc(db, 'presence', userId); 
        await updateDoc(userRef, { 
            count : 1,
            online: true, 
            hasShown: false 
        });
    }

    const createUser = async (avatarUrl: StorageReference, userName: string, userEmail: string, res: any) => {
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

                await setDoc(doc(db, "presence", res.user.uid),{
                    count : 1,
                    date: Timestamp.now(), 
                    hasShown: false,
                    name: userName, 
                    online: true, 
                });

                await setDoc(doc(db, "userChats", res.user.uid), {});                   
            });
        } 
        catch (error) { throw error; }      
    }

    return { updateUserChatsDoc, updateChatsDoc, createUserChat, userSignout, userLogin, createUser };
}