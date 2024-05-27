import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const UpdateCurrentUserPresence = () => {
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        let timer;
        const updateCurrentUserPresence = async () => {
          try {
            const currentUserPresenceRef = doc(db, 'presence', currentUser.uid);     
            const currentUserPresenceSnap = await getDoc(currentUserPresenceRef);       
            if (currentUserPresenceSnap.exists() && !currentUserPresenceSnap.data().hasShown) {
              timer = setTimeout(async () => {
                await updateDoc(currentUserPresenceRef, { hasShown: true });      
              }, 4000);
            }
          } 
          catch (error) {}                   
        };   
        currentUser.uid && updateCurrentUserPresence();     
        return () => clearTimeout(timer);        
    },[]);

    return null;
}

export default UpdateCurrentUserPresence