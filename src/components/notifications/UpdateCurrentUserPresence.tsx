import { useAuthContext } from "../../context/AuthContext";
import { useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const UpdateCurrentUserPresence = () => {
  const { currentUser } = useAuthContext();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const updateCurrentUserPresence = async () => {
      try {
        const currentUserPresenceRef = doc(db, 'presence', currentUser!.uid);     
        const currentUserPresenceSnap = await getDoc(currentUserPresenceRef);        
        if (currentUserPresenceSnap.exists() && !currentUserPresenceSnap.data()?.hasShown) {
          timer = setTimeout(async () => {
            await updateDoc(currentUserPresenceRef, { hasShown: true });      
          }, 4000);
        }
      } 
      catch (_error) {}                   
    };   
    currentUser?.uid && updateCurrentUserPresence();     
    return () => clearTimeout(timer);              
  },[]);

  return null;
};

export default UpdateCurrentUserPresence