import { useContext, useEffect } from 'react';
import { query, onSnapshot, collection, doc, updateDoc, where } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { AuthContext } from '../../context/AuthContext';
import toastr from 'toastr';
import useToastr from '../../hooks/useToastr';

const GameInvitations = () => {
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        if (!currentUser.uid) return;            
        onSnapshot( 
          query(collection(db, "gameInvitations"), where("userId", "==", currentUser.uid)),
          (snapshot) => {
            snapshot.forEach((doc) => {
                if (doc.exists() && !doc.data().gameConcluded) {
                    toastr.info(
                        `${doc.data().senderDisplayName} has invited you to play chess!`,
                        "Game Invitation", 
                        {
                            timeOut: 9500,
                            extendedTimeOut: 0, 
                            progressBar: true,
                            closeButton: true, 
                            positionClass: "toast-bottom-left", 
                            tapToDismiss: false,
                            preventDuplicates: true,
                            closeHtml:
                            `<button onclick="acceptInvite('${doc.data().link}', '${doc.data().id}')">Accept</button>` +
                            `<br />` +
                            `<button onclick="rejectInvite('${doc.data().id}')">Reject</button>`                       
                        }
                    );
                }
            });
          }
        );
          
        window.acceptInvite = async (gameLink, inviteId) => {
            try {
                const invitationDocRef = doc(db, "gameInvitations", inviteId);
                await updateDoc(invitationDocRef, { gameConcluded: true, gameAccepted: "true" });
                setTimeout(() => { window.open(gameLink, '_blank') }, 2500);                                                                                 
            }
            catch (err) {
                useToastr('error', 'There was a problem accepting the game offer');
            }                            
        };

        window.rejectInvite = async (inviteId) => {
            try {
                const invitationDocRef = doc(db, "gameInvitations", inviteId);
                await updateDoc(invitationDocRef, { gameConcluded: true, gameAccepted: "false" });                                     
            }
            catch (err) {
                useToastr('error', 'There was a problem rejecting the game offer');
            }       
        };
    },[]);
      
    return null 
}

export default GameInvitations