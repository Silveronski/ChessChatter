import { useAuthContext } from "../context/AuthContext";
import { Timestamp, doc, arrayUnion, serverTimestamp, updateDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { v4 as uuid } from 'uuid';
import { User, UserCredential, signOut, updateProfile } from "firebase/auth";
import { useChatContext } from "../context/ChatContext";
import { StorageReference, getDownloadURL } from "firebase/storage";
import { useToastr } from "./useToastr";
import { TMessage } from "../types/types";
import { timeOfMsg } from "../utils/utilities";

interface ChatDocProps {
    (msgText: string,
    chatId: string,
    otherUserId: string,
    isImg?: boolean,
    imgUrl?: string): void
};

interface CreateUserChatProps {
    (
        userIdToUpdate: string,
        otherUser: User,
        combinedId: string
    ): Promise<void>
};

export const useFirebase = () => {
    const { currentUser } = useAuthContext();
    const { dispatch } = useChatContext();

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
    
    const updateChatsDoc: ChatDocProps = async (msgText, chatId, otherUserId, isImg, imgUrl) => {
        const message: TMessage = {
            id: uuid(),
            text: msgText,
            senderId: currentUser!.uid,
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

    const createUserChat: CreateUserChatProps = async (userIdToUpdate, otherUser, combinedId): Promise<void> => {
        try {
            await updateDoc(doc(db, "userChats", userIdToUpdate), {
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

    const userSignout = async (): Promise<void> => {
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

    const userLogin = async (userId: string): Promise<void> => {
        const userRef = doc(db, 'presence', userId); 
        await updateDoc(userRef, { 
            count : 1,
            online: true, 
            hasShown: false 
        });
    }

    const createUser = async (avatarUrl: StorageReference, res: UserCredential, displayName: string) => {
        try {
            getDownloadURL(avatarUrl).then(async (downloadURL) => {
                await updateProfile(res.user, {
                    displayName,
                    photoURL: downloadURL
                });

                await setDoc(doc(db, "users", res.user.uid),{
                    uid: res.user.uid,
                    displayName,
                    email: res.user.email,
                    photoURL: downloadURL
                });

                await setDoc(doc(db, "presence", res.user.uid),{
                    count : 1,
                    date: Timestamp.now(), 
                    hasShown: false,
                    name: res.user.displayName, 
                    online: true, 
                });

                await setDoc(doc(db, "userChats", res.user.uid), {});                   
            });
        } 
        catch (error) { throw error; }      
    }

    return { updateUserChatsDoc, updateChatsDoc, createUserChat, userSignout, userLogin, createUser };
}