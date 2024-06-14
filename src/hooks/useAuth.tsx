import { User, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../firebase/firebase";

export const useAuth = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {           
        const unsub = onAuthStateChanged(auth, async (user) => {              
            setCurrentUser(user);               
        });
        return () => unsub();          
    }, []);

    return { currentUser }
}