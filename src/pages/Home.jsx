import Sidebar from '../components/Sidebar'
import Chat from '../components/Chat'
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
                    timeOut: 0,
                    extendedTimeOut: 0, 
                    closeButton: true, 
                    positionClass: "toast-bottom-left", 
                    tapToDismiss: false,
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
        try {

          const invitationDocRef = doc(db, "gameInvitations", inviteId);
          await updateDoc(invitationDocRef, {          
            gameConcluded: true 
          });
          
          window.open(`http://localhost:3037/black?code=${gameLink}`, '_blank');
        }
        catch (err) {
          // handle later
          // make the try cathc into one fucntion so i can use it in reject aswell
          console.log(err);
        }               
      };

      window.rejectInvite = async (inviteId) => {
        try{
          const invitationDocRef = doc(db, "gameInvitations", inviteId);
          await updateDoc(invitationDocRef, {          
            gameConcluded: true 
          });         
        }
        catch (err) {
          console.log(err);
          // handle later
        }     
      };
  
      return () => {
        unsub();
      }
    }

    currentUser.uid && getGameInvitations();

  },[currentUser.uid])


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