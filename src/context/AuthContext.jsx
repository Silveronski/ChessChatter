import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { Timestamp, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState({});
    
    useEffect(() => {      
        const unsub = onAuthStateChanged(auth, async (user) => {
            try {
                setCurrentUser(user);
                if (user?.uid) {
                    const userRef = doc(db, `presence/${user?.uid}`);
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                        if (userSnap.data().count === 0) {
                            await updateDoc(userRef, {
                                count : 1,
                                online: true,
                                date: Timestamp.now()
                            });                      
                        }
                    } 
                    
                    else {
                        await setDoc(userRef, { 
                            count : 1,
                            online: true, 
                            name: user?.displayName, 
                            date: Timestamp.now(), 
                            hasShown: false
                        });
                    }                    
                }              
            }
            catch (err) {
                console.error('Error setting user presence:', err);
            }
        });

        return () => {
            unsub();
        }

    }, [currentUser?.uid]);

    return (
        <AuthContext.Provider value={{currentUser}}>
            {children}
        </AuthContext.Provider>
    )   
}