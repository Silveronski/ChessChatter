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

                if (currentUser?.uid === undefined || null) return;

                if (user?.uid) {                  
                    const userRef = doc(db, `presence/${user.uid}`);
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                        if (userSnap.data().count === 0) {
                            await updateDoc(userRef, {
                                count: 1, // this is for not updating the doc on every page refrsh
                                online: true,
                                date: Timestamp.now()
                            });                      
                        }
                    } 
                    
                    else {
                        setTimeout(async () => {                                                     
                            const currentUserSnap = await getDoc(doc(db, 'users', user.uid));                        
                            const userName = currentUserSnap.data()?.displayName;
                            await setDoc(userRef, { 
                                count : 1,
                                date: Timestamp.now(), 
                                hasShown: false,
                                name: userName, 
                                online: true, 
                            });                                               
                        }, 2000);                                              
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