import React, { useContext, useEffect, useRef, useState } from 'react';
import { db } from '../firebase';
import { Timestamp, collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import online from '../assets/images/online.jpg';
import offline from '../assets/images/offline.png';
import bruh from '../assets/audio/bruh.mp3';
import toastr from 'toastr';

const Chats = ({selectedChatIdFromSearch}) => {

  const [chats, setChats] = useState([]);
  const {currentUser} = useContext(AuthContext);
  const {dispatch} = useContext(ChatContext);
  const [selectedChatId, setSelectedChat] = useState("");
  const [userStatuses, setUserStatuses] = useState({});
  const bruhRef = useRef(); 

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
    Object.entries(chats).forEach(chat => {
      if (chat[1]?.lastMessage?.senderId !== currentUser.uid &&
         chat[1]?.fullDate?.seconds === Timestamp.now().seconds ||
         chat[1]?.fullDate?.seconds === Timestamp.now().seconds + 1) {
        console.log("Inside if block");
        bruhRef.current.play();             
      }                 
    }) 
  },[chats]);


  useEffect(() => {

    // const getOnline = async () => {

      //   console.log(doc2.data()?.date?.seconds);
      //   console.log(Timestamp.now());
      //   console.log(doc2.data()?.date?.seconds == Timestamp.now());
      //   console.log(doc2.id);
      //   console.log(doc2.data().hasShown);

      //   if (doc2.data()?.date?.seconds == Timestamp.now().seconds && currentUser.uid !== doc2.id && doc2.data().hasShown === false) {          
      //     try {

      //       const presencecRef = doc(db, 'presence', doc2?.id);
      //       await updateDoc(presencecRef, {          
      //         hasShown: true 
      //       });
                                      
      //       toastr.info(
      //         `${doc2.data().name} has just logged on!`, 
      //         {
      //             timeOut: 2000,
      //             extendedTimeOut: 0, 
      //             closeButton: true, 
      //             positionClass: "toast-top-right", 
      //             tapToDismiss: false,
      //             preventDuplicates: true,               
      //         }
      //       );       
      //     }

      //     catch (err) {
      //       console.log("error", err);
      //       //handle later
      //     }
          
      //   }
      // }

      // getOnline();
  },[])
  


  useEffect(() => {
    const unsubscribePresence = onSnapshot(collection(db, 'presence'), (snapshot) => {
      const updatedUserStatuses = snapshot.docs.reduce((account, doc2) => {
                           
        account[doc2.id] = doc2.data().online;
        return account;

      }, {});
      setUserStatuses(updatedUserStatuses);
    });

    return () => {
      unsubscribePresence();
    };

  }, []);


  useEffect(() => {
    setSelectedChat(selectedChatIdFromSearch);
  },[selectedChatIdFromSearch])


  const handleSelect = (user) => {
    setSelectedChat(user.uid);
    dispatch({type:"CHANGE_USER", payload: user}); // move to chat window with the user.
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
                            
              <div className='date-status'>
                {chat[1].lastMessage?.text && <p>{JSON.stringify(chat[1]?.date).substring(1,6)}</p> }                
                <p>{userStatuses[chat[1].userInfo.uid] ? <img src={online}/> : <img src={offline}/>}</p>                   
              </div>

              <audio ref={bruhRef} src={bruh}></audio>
                                   
            </div>
          </div>
        </div>      
      ))}
    </div>    
  )
}

export default Chats