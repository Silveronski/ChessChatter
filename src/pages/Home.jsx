import Sidebar from '../components/Sidebar'
import Chat from '../components/Chat'
import toastr from 'toastr';
import { useContext, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { AuthContext } from '../context/AuthContext';

const Home = () => {

  const {currentUser} = useContext(AuthContext);

  const handleGameInviteReceive = (userName, link) => {

  }

  useEffect(() => {
    const getGameInvitations = () => {
      const unsub = onSnapshot(doc(db, "gameInvitations", currentUser.uid), (doc) => {       
        if (doc.data() && !doc.data().gameConcluded) {
          console.log(doc.data());
                   
          toastr.info(
            `${doc.data().senderDisplayName} has invited you to play chess!`, 
            "Game Invitation",
            {
                timeOut: 0,
                extendedTimeOut: 0, // To keep the toastr alert open indefinitely
                closeButton: true, // Show close button
                positionClass: "toast-bottom-left", // Adjust position as needed
                tapToDismiss: false, // Prevent dismissing on click
                closeHtml: `<button onclick="acceptInvite('${doc.data().link, doc.data().id}')">Accept</button>` + 
                           `<button onclick="rejectInvite('${doc.data().id}')">Reject</button>`
            }
          );
        }       
      });

      window.acceptInvite = (gameLink, inviteId) => {
        window.open(`http://localhost:3037/black?code=${gameLink}`, '_blank');
      };

      window.rejectInvite = (inviteId) => {
        
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
            <Chat passDataToHome={handleGameInviteReceive}/>              
        </div>
    </div>
  )
}

export default Home