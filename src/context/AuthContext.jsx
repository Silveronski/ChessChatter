import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { Timestamp, doc, setDoc } from "firebase/firestore";

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState({});
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        const storedInitialized = sessionStorage.getItem('authInitialized');
        if (storedInitialized) {           
            setInitialized(true);
        }

        const unsub = onAuthStateChanged(auth, async (user) => {
            try {
                setCurrentUser(user);
                if (user?.uid && !initialized) {
                    const userRef = doc(db, `presence/${user?.uid}`); 
                    console.log(Timestamp.now());                 
                    await setDoc(userRef, { online: true, name: user?.displayName, date: Timestamp.now(), hasShown: false });    
                    setInitialized(true);                   
                    sessionStorage.setItem('authInitialized', 'true');
                }
            }
            catch (err) {
                console.error('Error setting user presence:', err);
            }
        });

        return () => {
            unsub();
        }

    }, [initialized, currentUser?.uid]);

    return (
        <AuthContext.Provider value={{currentUser}}>
            {children}
        </AuthContext.Provider>
    )   
}