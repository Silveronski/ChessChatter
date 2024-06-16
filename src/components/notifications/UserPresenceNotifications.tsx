import React, { useEffect } from 'react';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { useAuthContext } from '../../context/AuthContext';
import { useToastr } from '../../hooks/useToastr';
import { TUserPresence } from '../../types/types';

const UserPresenceNotifications: React.FC = () => {
  const { currentUser } = useAuthContext();

  useEffect(() => {
    if (!currentUser?.uid) return;
    const userPresenceListener = onSnapshot(collection(db, 'presence'), (snapshot) => {
      snapshot.forEach(async (presenceDoc) => {
        const userData = presenceDoc.data() as TUserPresence;
        if (presenceDoc.id !== currentUser.uid && !userData.hasShown && userData.online) {
            useToastr(`${userData.name} has just logged in!`, "info", 8000);
        }
      });
    });
    return () => userPresenceListener();
  }, [currentUser?.uid]);

  return null;
};

export default UserPresenceNotifications