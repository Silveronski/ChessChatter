import Sidebar from '../components/Sidebar';
import Chat from '../components/Chat';
import toastr from 'toastr';
import msgSound from '../assets/audio/msgSound.mp3';
import { useContext, useEffect, useRef } from 'react';
import { query, onSnapshot, collection, where, doc, updateDoc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { AuthContext } from '../context/AuthContext';

const Home = () => {

  const {currentUser} = useContext(AuthContext);
  const msgReceivedSound = useRef();

  useEffect(() => {
    let timer;

    const fetchCurrentUserPresence = async () => {
      try {
        const currentUserPresenceRef = doc(db, 'presence', currentUser?.uid);     
        const currentUserPresenceSnap = await getDoc(currentUserPresenceRef);       
        if (currentUserPresenceSnap.exists() && currentUserPresenceSnap.data().hasShown === false) {
          timer = setTimeout(async () => {
            await updateDoc(currentUserPresenceRef, { hasShown: true });      
          }, 1500);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    currentUser.uid && fetchCurrentUserPresence();
  
    return () => {
      clearTimeout(timer);
    };
    
  },[]);


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
          await updateDoc(invitationDocRef, { gameConcluded: true, gameAccepted: "true" });                                     
        }
        catch (err) {
          console.log(err);
          // handle later
        }
        setTimeout(() => {
          window.open(`http://localhost:3037/black?code=${gameLink}`, '_blank');                            
        }, 500);                    
      };

      window.rejectInvite = async (inviteId) => {
        try {
          const invitationDocRef = doc(db, "gameInvitations", inviteId);
          await updateDoc(invitationDocRef, { gameConcluded: true, gameAccepted: "false" });                                     
        }
        catch (err) {
          console.log(err);
          // handle later
        }       
      };      
    
  },[]);

  

  useEffect(() => {
    
    if (currentUser?.uid === undefined || null) return;

    const unsubscribe = onSnapshot(collection(db, 'presence'), (snapshot) => {
      snapshot.forEach(async (presDoc) => {
        const data = presDoc.data();         
        if (currentUser.uid && presDoc.id !== currentUser.uid && !data.hasShown && data.online) {                                   
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

    return () => {
      unsubscribe();
  };

  },[currentUser.uid]);


  useEffect(() => {

    if (!currentUser.uid) return;
    
    onSnapshot(
      collection(db, "chats"),
      (snapshot) => {
        snapshot.forEach((chatDoc) => {
          const msgAraayLen = chatDoc.data().messages.length;
          const receiverId = chatDoc.data().messages[msgAraayLen-1].receiverId;
          const msgDate = chatDoc.data().messages[msgAraayLen-1].fullDate.seconds;

          if (receiverId === currentUser.uid && msgDate === Timestamp.now().seconds) {           
            console.log(chatDoc.data().messages[msgAraayLen-1].text);
            msgReceivedSound.current.play();
          }          
        })
      }     
    ); 
       
  },[]);


  return (
    <div className='home'>
        <div className='container'>           
            <Sidebar/>
            <Chat/>
            <audio src={msgSound} ref={msgReceivedSound}></audio>              
        </div>
    </div>
  )
}

export default Home