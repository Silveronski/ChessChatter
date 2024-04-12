import Messages from './Messages';
import Input from './Input';
import React, { useContext, useEffect, useState } from 'react';
import { ChatContext } from '../context/ChatContext';
import { db } from '../firebase';
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';
import toastr from 'toastr';
import back from '../assets/images/back.png'
import { AppearanceContext } from '../context/AppearanceContext';

const Chat = () => {

  const {data} = useContext(ChatContext);
  const {currentUser} = useContext(AuthContext);
  const {controlSidebarAppearance, controlChatAppearance} = useContext(AppearanceContext);
  const [invitePending, setInvitePending] = useState(false);
  const [gameInviteId, setGameInviteId] = useState("");
  const [showBackBtn, setShowBackBtn] = useState(false);

  useEffect(() => {
    const invitePendingData = window.localStorage.getItem('invitePending');
    const gameInviteIdData = window.localStorage.getItem('gameInviteId');
    if (invitePendingData !== null) setInvitePending(JSON.parse(invitePendingData));
    if (gameInviteIdData !== null) setGameInviteId(JSON.parse(gameInviteIdData));
  },[]);


  useEffect(() => {
    window.localStorage.setItem('invitePending', JSON.stringify(invitePending));
    window.localStorage.setItem('gameInviteId', JSON.stringify(gameInviteId));
  },[invitePending, gameInviteId]);


  const handlePlay = async () => {
    if (!invitePending) { 
      try {        
        const userSnap = await getDoc(doc(db, 'presence', data.user.uid));    
        if (userSnap.exists() && !userSnap.data().online) {
          toastr.error(
            "Can't invite an offline user!", 
            {
                timeOut: 1000,
                extendedTimeOut: 0, 
                closeButton: true, 
                positionClass: "toast-top-right", 
                tapToDismiss: true,
                preventDuplicates: true,               
            }
          );
          return;
        }

        await setDoc(doc(db, "gameInvitations", data.user.uid + currentUser.uid),{
          id: data.user.uid + currentUser.uid,
          userId: data.user.uid,
          senderId : currentUser.uid,
          senderDisplayName : currentUser.displayName,
          link: data.user.uid + currentUser.uid,
          gameConcluded: false,
          gameAccepted: ""
        });

        toastr.success(
          "Your invitation was successfully sent!", 
          {
              timeOut: 3000,
              extendedTimeOut: 0, 
              closeButton: true, 
              positionClass: "toast-top-right", 
              tapToDismiss: true,
              preventDuplicates: true,               
          }
        );

        setInvitePending(true);
        setGameInviteId(data.user.uid + currentUser.uid);       
      }

      catch (err) {
        console.log(err);
        // handle error - problem setting doc
      }      
    }
    else {
      toastr.error(
        "Can't invite more than one person at a time!", 
        {
            timeOut: 2000,
            extendedTimeOut: 0, 
            closeButton: true, 
            positionClass: "toast-top-right", 
            tapToDismiss: true,
            preventDuplicates: true,               
        }
      );
    }  
  }


  useEffect(() => {

    let unsub;

    if (invitePending && gameInviteId !== "") {
      const gameInviteRef = doc(db, "gameInvitations", gameInviteId);
      unsub = onSnapshot(gameInviteRef, (docSnapshot) => {  

          const data = docSnapshot.data();
          if (data && data.gameAccepted === "true") {           
            window.open(`https://chess-game-fh3hl.ondigitalocean.app/white?code=${gameInviteId}`, '_blank');
            setInvitePending(false);
            setGameInviteId("");
          }

          else if (data && data.gameAccepted === "false") {            
            toastr.error(
              "Your invitation was declined.", 
              {
                  timeOut: 2000,
                  extendedTimeOut: 0, 
                  closeButton: true, 
                  positionClass: "toast-top-right", 
                  tapToDismiss: true,
                  preventDuplicates: true,               
              }
            );
            setGameInviteId("");
            setInvitePending(false); 
          }
      });
    }

    return () => {
      if (unsub) {
        unsub(); 
      }
    }

  },[invitePending, gameInviteId])
  

  useEffect(() => {

    let timer;

    if (invitePending) {
      timer = setTimeout(async () => {
        try {          
          const gameInviteRef = doc(db, "gameInvitations", gameInviteId);
          const gameInviteSnap = await getDoc(gameInviteRef);
          if (gameInviteSnap.data().gameConcluded === false) {
            await updateDoc(gameInviteRef, {gameConcluded: true});
            toastr.error(
              "Your invitation was not responded to within the specified time frame", 
              {
                  timeOut: 6000,
                  extendedTimeOut: 0, 
                  closeButton: true, 
                  positionClass: "toast-top-right", 
                  tapToDismiss: true,
                  preventDuplicates: true,               
              }
            );
            setGameInviteId("");
            setInvitePending(false);
          }
        }
        catch (err) {
          console.log(err);
          //handle later
        }
      }, 10000);
    }

    return () => {
      clearTimeout(timer);
    }

  },[invitePending, gameInviteId]);


  useEffect(() => {
    
    const handleResize = () => {
      window.innerWidth < 940 ? setShowBackBtn(true) : setShowBackBtn(false);
    }

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
      
  },[])

  const handleBack = () => {
    controlChatAppearance(false);
    controlSidebarAppearance(true);
  }


  return (
    <div className='chat'>
      <div className="chat-info">
        <div className='user-info'>
          {(data.chatId !== "null" && showBackBtn) && <img src={back} className='backBtn' onClick={handleBack}/>}
          {data.chatId !== "null" && <img src={data.user?.photoURL}/>}
          <span>{data.user?.displayName}</span> 
        </div>       
        {data.chatId !== "null" && <button onClick={handlePlay}>Play Chess</button>}
      </div>        
        <Messages/>
        <Input/>  
    </div>
  )
}

export default Chat