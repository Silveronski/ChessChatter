import React, { useContext, useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import online from '../assets/images/online.jpg';
import offline from '../assets/images/offline.png';
import { AppearanceContext } from '../context/AppearanceContext';

const Chats = ({selectedChatIdFromSearch}) => {

  const [chats, setChats] = useState([]);
  const {currentUser} = useContext(AuthContext);
  const {dispatch} = useContext(ChatContext);
  const {controlSidebarAppearance, controlChatAppearance} = useContext(AppearanceContext);
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
      const updatedUserStatuses = snapshot.docs.reduce((account, presDoc) => {
                            
        account[presDoc.id] = presDoc.data().online;
        return account;

      }, {});
      setUserStatuses(updatedUserStatuses);
    });
         
    return () => {
      unsubscribePresence();
    }    
    
  }, []);

  
  useEffect(() => {
    setSelectedChat(selectedChatIdFromSearch);
    const selectedChat = document.getElementById(selectedChatIdFromSearch);
    selectedChat?.scrollIntoView({behavior:'instant'});
    // not sure if need control here too
  },[selectedChatIdFromSearch]);


  const handleSelect = (user) => {
    setSelectedChat(user.uid);
    dispatch({type:"CHANGE_USER", payload: user}); // move to chat window with the user.
    controlSidebarAppearance(false);
    controlChatAppearance(true);
  }


  return (
    <div className="chats">     
      {chats && Object.entries(chats)?.sort((a,b) => b[1]?.fullDate - a[1]?.fullDate).map((chat) => ( 
        <div className={`user-chat ${selectedChatId === chat[1]?.userInfo?.uid ? 'selected-chat' : ''}`} id={chat[1]?.userInfo?.uid} key={chat[1]?.userInfo?.uid} onClick={() => handleSelect(chat[1]?.userInfo)}>        
          <img className='user-photo' src={chat[1].userInfo?.photoURL}/>
          <div className="user-chat-info">
            <span>{chat[1].userInfo?.displayName}</span>
            <div className='lastmsg-time'>
              <p className='lastmsg-text'>{chat[1].lastMessage?.text.length >= 36 ? chat[1].lastMessage?.text.substring(0,30) + "..." : chat[1].lastMessage?.text}</p>                         
              <div className='date-status'>
                {chat[1].lastMessage?.text && <p>{JSON.stringify(chat[1]?.date).substring(1,6)}</p> }                
                <p>{userStatuses[chat[1].userInfo?.uid] ? <img src={online}/> : <img src={offline}/>}</p>                   
              </div>                                   
            </div>
          </div>
        </div>      
      ))}
    </div>          
  )
}

export default Chats