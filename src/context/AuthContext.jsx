import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState({});

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            try {
                setCurrentUser(user);
                if (user?.uid) {
                    const userRef = doc(db, `presence/${user?.uid}`); 
                    await setDoc(userRef, { online: true });    
                }
            }
            catch (err) {
                console.error('Error setting user presence:', err);
            }
        });

        return () => {
            unsub();
        }

    }, []);

    return (
        <AuthContext.Provider value={{currentUser}}>
            {children}
        </AuthContext.Provider>
    )   
}