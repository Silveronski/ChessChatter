import React, { useContext, useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import online from '../assets/images/online.jpg';
import offline from '../assets/images/offline.png';

const Chats = () => {

  const [chats, setChats] = useState([]);
  const {currentUser} = useContext(AuthContext);
  const {dispatch} = useContext(ChatContext);
  const [selectedChatId, setSelectedChat] = useState("");
  const [userStatuses, setUserStatuses] = useState({});

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


  useEffect(() => {
    const unsubscribePresence = onSnapshot(collection(db, 'presence'), (snapshot) => {
      const updatedUserStatuses = snapshot.docs.reduce((account, doc) => {
        account[doc.id] = doc.data().online;
        return account;
      }, {});
      setUserStatuses(updatedUserStatuses);
    });

    return () => {
      unsubscribePresence();
    };

  }, []);


  const handleSelect = (user) => {
    setSelectedChat(user.uid);
    dispatch({type:"CHANGE_USER", payload: user})
  }


  return (
    <div className="chats">
      {chats && Object.entries(chats)?.sort((a,b) => b[1].fullDate - a[1].fullDate).map((chat) => ( 
        <div className={`user-chat ${selectedChatId === chat[1].userInfo.uid ? 'selected-chat' : ''}`} key={chat[0]} onClick={() => handleSelect(chat[1].userInfo)}>        
          <img className='user-photo' src={chat[1].userInfo?.photoURL}/>
          <div className="user-chat-info">
            <span>{chat[1].userInfo?.displayName}</span>
            <div className='lastmsg-time'>
              <p>{chat[1].lastMessage?.text}</p>
              
              {chat[1].lastMessage?.text && 
              <div className='date-status'>
                <p>{JSON.stringify(chat[1]?.date).substring(1,6)} </p>  
                <p>{userStatuses[chat[1].userInfo.uid] ? <img src={online}/> : <img src={offline}/>}</p>                   
              </div>}
                       
            </div>
          </div>
        </div>      
      ))}
    </div>    
  )
}

export default Chats