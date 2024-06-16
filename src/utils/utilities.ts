import { Timestamp, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

const hourOfMsg = Timestamp.now().toDate().getHours().toString().length === 2 ? 
    Timestamp.now().toDate().getHours() : "0"+ Timestamp.now().toDate().getHours() 

const minOfMsg = Timestamp.now().toDate().getMinutes().toString().length === 2 ?
    Timestamp.now().toDate().getMinutes() : "0"+ Timestamp.now().toDate().getMinutes();
    
export const timeOfMsg = hourOfMsg + ":" + minOfMsg;

export const validImgExtensions = ["image/png", "image/jpeg", "image/gif"];

export async function imageUrlToFile(imageUrl: string, fileName: string): Promise<File> {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const file = new File([blob], fileName);
    return file;
}

export async function isDisplayNameTaken (displayName: string): Promise<boolean> {
    try {
        let displayNameTaken = false;
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => { 
            if (doc.data().displayName.toLowerCase() === displayName.toLowerCase()) { 
                displayNameTaken = true;        
            }                    
        });
        return displayNameTaken;
    } 
    catch (err) {
        console.error("Error searching for user:", err);
        return true;
    }
}