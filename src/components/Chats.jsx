import React, { useContext, useEffect, useState } from 'react'
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

const Chats = () => {

  const [chats, setChats] = useState([]);
  const {currentUser} = useContext(AuthContext);
  const {dispatch} = useContext(ChatContext);
  const [selectedChat, setSelectedChat] = useState(null);


  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data()); 
      });

      return () => {
        unsub();
      }
    }

    currentUser.uid && getChats();

  }, [currentUser.uid]);


  const handleSelect = (user) => {
    setSelectedChat(user);
    dispatch({type:"CHANGE_USER", payload: user})
  }


  return (
    <div className="chats">
      {chats && Object.entries(chats)?.sort((a,b) => b[1].fullDate - a[1].fullDate).map((chat) => ( 
        <div className={`user-chat ${selectedChat === chat[1].userInfo ? 'selected-chat' : ''}`} key={chat[0]} onClick={() => handleSelect(chat[1].userInfo)}>        
          <img src={chat[1].userInfo?.photoURL}/>
          <div className="user-chat-info">
            <span>{chat[1].userInfo?.displayName}</span>
            <div className='lastmsg-time'>
              <p>{chat[1].lastMessage?.text}</p>
              
              {chat[1].lastMessage?.text && 
              <div>
                {JSON.stringify(chat[1]?.date).substring(1,6)}
              </div>}
                          
            </div>
          </div>
        </div>      
      ))}
    </div>    
  )
}

export default Chats