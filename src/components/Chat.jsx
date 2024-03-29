import Messages from './Messages';
import Input from './Input';
import React, { useContext, useEffect, useState } from 'react';
import { ChatContext } from '../context/ChatContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';
import toastr from 'toastr';

const Chat = () => {

  const {data} = useContext(ChatContext);
  const {currentUser} = useContext(AuthContext);
  const [invitePending, setInvitePending] = useState(false);
  const [gameInviteId, setGameInviteId] = useState("");

  const handlePlay = async () => {
    if (!invitePending) {     
      try {        
        await setDoc(doc(db, "gameInvitations", data.user.uid + currentUser.uid),{
          id: data.user.uid + currentUser.uid,
          userId: data.user.uid,
          senderId : currentUser.uid,
          senderDisplayName : currentUser.displayName,
          link: data.chatId,
          gameConcluded: false,
        });

        setInvitePending(true);
        setGameInviteId(data.user.uid + currentUser.uid);

        window.open(`http://localhost:3037/white?code=${data.chatId}`, '_blank');
      }

      catch (err) {
        console.log(err);
        // handle error - problem setting doc
      }      
    }

    else {
      console.log("cant invite more than 1 person at a time!");
      // handle error - cant invite 2 users at teh same times
    }  
  }

  useEffect(() => {

    let timer;

    if (invitePending) {
      timer = setTimeout(async () => {
        try {          
          const gameInviteRef = doc(db, "gameInvitations", gameInviteId);
          const gameInviteSnap = await getDoc(gameInviteRef);
          if (gameInviteSnap.data().gameConcluded === false) {
            await updateDoc(gameInviteRef, {gameConcluded: true});
            console.log("game canceled!");
            setGameInviteId("");
            setInvitePending(false);
          }
        }
        catch (err) {
          //handle later
          console.log(err);
        }
      }, 10000);
    }

    return () => {
      clearTimeout(timer);
    }

  },[invitePending, gameInviteId]);


  return (
    <div className='chat'>
      <div className="chat-info">
        <div className='user-info'>
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