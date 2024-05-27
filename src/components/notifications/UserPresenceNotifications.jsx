import { useContext, useEffect } from 'react';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { AuthContext } from '../../context/AuthContext';
import useToastr from '../../hooks/useToastr';

const UserPresenceNotifications = () => {
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (!currentUser?.uid) return;
    const unsubscribe = onSnapshot(collection(db, 'presence'), (snapshot) => {
      snapshot.forEach(async (presDoc) => {
        const data = presDoc.data();
        if (presDoc.id !== currentUser.uid && !data.hasShown && data.online) {
            useToastr("info", `${data.name} has just logged in!`, 8000);
        }
      });
    });

    return () => unsubscribe();
  }, [currentUser?.uid]);

  return null;
};

export default UserPresenceNotifications;