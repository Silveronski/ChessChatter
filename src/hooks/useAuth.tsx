import { User, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../firebase/firebase";

export const useAuth = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {           
        const unsub = onAuthStateChanged(auth, async (user) => {              
            setCurrentUser(user);
            setLoading(false);               
        });
        return () => unsub();          
    }, []);

    return { currentUser, loading }
}