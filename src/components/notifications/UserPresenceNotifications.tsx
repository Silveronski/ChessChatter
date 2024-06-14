import { useEffect } from 'react';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { useAuthContext } from '../../context/AuthContext';
import { useToastr } from '../../hooks/useToastr';


const UserPresenceNotifications = () => {
  const { currentUser } = useAuthContext();

  useEffect(() => {
    if (!currentUser?.uid) return;
    const userPresenceListener = onSnapshot(collection(db, 'presence'), (snapshot) => {
      snapshot.forEach(async (presenceDoc) => {
        const user = presenceDoc.data();
        if (presenceDoc.id !== currentUser.uid && !user.hasShown && user.online) {
            useToastr(`${user.name} has just logged in!`, "info", 8000);
        }
      });
    });
    return () => userPresenceListener();
  }, [currentUser?.uid]);

  return null;
};

export default UserPresenceNotifications