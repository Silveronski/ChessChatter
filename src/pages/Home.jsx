import Sidebar from '../components/Sidebar';
import Chat from '../components/Chat';
import toastr from 'toastr';
import { useContext, useEffect } from 'react';
import { query, onSnapshot, collection, where, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { AuthContext } from '../context/AuthContext';

const Home = () => {

  const {currentUser} = useContext(AuthContext);

  useEffect(() => {
    const getGameInvitations = () => {     
      const unsub = onSnapshot( 
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
                    closeButton: true, 
                    positionClass: "toast-bottom-left", 
                    tapToDismiss: false,
                    preventDuplicates: true,
                    closeHtml: `<button onclick="acceptInvite('${doc.data().link}', '${doc.data().id}')">Accept</button>` +
                               `<br />` +
                               `<button onclick="rejectInvite('${doc.data().id}')">Reject</button>`
                }
              );
            }
          });
        }
      );
      
      window.acceptInvite = async (gameLink, inviteId) => {
        await updateGameInvitationsDoc(inviteId);                
        window.open(`http://localhost:3037/black?code=${gameLink}`, '_blank');                   
      };

      window.rejectInvite = async (inviteId) => {
        await updateGameInvitationsDoc(inviteId);   
      };      
    }

    const updateGameInvitationsDoc = async (inviteId) => {
      try {
        const invitationDocRef = doc(db, "gameInvitations", inviteId);
        await updateDoc(invitationDocRef, { gameConcluded: true });                                     
      }
      catch (err) {
        console.log(err);
        // handle later
      }    
    }

    currentUser.uid && getGameInvitations();

  },[currentUser.uid]);

  useEffect(() => {
    const notifyUsersWhenUserOnline = onSnapshot(collection(db, 'presence'), (snapshot) => {
      snapshot.forEach(async (presDoc) => {
        const data = presDoc.data();                

        if (presDoc.id !== currentUser.uid && !data.hasShown && data.online) {                 
          try {
            const presenceRef = doc(db, 'presence', presDoc.id);
            await updateDoc(presenceRef, { hasShown: true });         
                                     
            toastr.info(
              `${data.name} has just logged in!`, 
              {
                  timeOut: 8000,
                  extendedTimeOut: 0, 
                  closeButton: true, 
                  positionClass: "toast-top-right", 
                  tapToDismiss: false,
                  preventDuplicates: true,               
              }
            );                         
          }

          catch (err) {          
            console.log("updating presence error", err);
          }                      
        }        
      });
    });

    currentUser.uid && notifyUsersWhenUserOnline();

  },[currentUser.uid]);


  return (
    <div className='home'>
        <div className='container'>           
            <Sidebar/>
            <Chat/>              
        </div>
    </div>
  )
}

export default Home