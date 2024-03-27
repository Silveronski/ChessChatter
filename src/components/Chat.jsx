import React, { useContext, useEffect, useState } from 'react'
import Messages from './Messages'
import Input from './Input'
import { ChatContext } from '../context/ChatContext';
import { db } from '../firebase';
import { Timestamp, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';
import toastr from 'toastr';

const Chat = ({passDataToHome}) => {

  const {data} = useContext(ChatContext);
  const {currentUser} = useContext(AuthContext);

  const handlePlay = async () => {
    if (true) { // changes this
      try {        
        await setDoc(doc(db, "gameInvitations", data.user.uid),{
          id: currentUser.uid + data.user.uid,
          senderId : currentUser.uid,
          senderDisplayName : currentUser.displayName,
          link: data.chatId,
          gameConcluded: false,
        });

        window.open(`http://localhost:3037/white?code=${data.chatId}`, '_blank');
      }

      catch (err) {
        // handle error - problem setting doc
      }      
    }

    else {
      console.log("cant invite more than 1 person at a time!");
      // handle error - cant invite 2 users at teh same times
    }  
  }



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