import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const validImgExtensions = ["image/png", "image/jpeg", "image/gif"];

export async function imageUrlToFile(imageUrl, fileName) {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const file = new File([blob], fileName);
    return file;
}

export async function isDisplayNameTaken (displayName) {
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