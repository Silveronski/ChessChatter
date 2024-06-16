import UserChat from './UserChat';
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebase';
import { collection, doc, onSnapshot } from 'firebase/firestore';;
import { useAuthContext } from '../../context/AuthContext';
import { TUserChat } from '../../types/types';

interface UserChatsProps {
  selectedChatIdFromSearch: string
};

const UserChats: React.FC<UserChatsProps> = ({ selectedChatIdFromSearch }) => {
  const { currentUser } = useAuthContext();
  const [chats, setChats] = useState<TUserChat[]>([]);
  const [selectedChatId, setSelectedChat] = useState<string>("");
  const [userStatuses, setUserStatuses] = useState<any>({});

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser!.uid), (doc) => {
        setChats(doc.data() as TUserChat[]);                                                
      });  
      return () => unsub();                      
    }   
    currentUser?.uid && getChats();    
  }, [currentUser?.uid]);


  useEffect(() => {         
    const getUsersOnlineStatus = onSnapshot(collection(db, 'presence'), (snapshot) => {
      const updatedUserStatuses = snapshot.docs.reduce((account, presDoc) => {                          
        account[presDoc.id] = presDoc.data().online;
        return account;
      }, {});
      
      setUserStatuses(updatedUserStatuses);
    });
         
    return () => getUsersOnlineStatus();           
  }, []);

  
  useEffect(() => {
    setSelectedChat(selectedChatIdFromSearch);
    const selectedChat = document.getElementById(selectedChatIdFromSearch);
    selectedChat?.scrollIntoView({ behavior:'instant' });
  },[selectedChatIdFromSearch]);


  return (
    <section className="chats">     
      {chats && Object.entries(chats)?.sort((a,b) => b[1]?.fullDate - a[1]?.fullDate).map((chat) => ( 
        <UserChat 
          key={chat[1]?.userInfo.uid}
          userInfo={chat[1]?.userInfo} 
          chatLastMsg={chat[1].lastMessage?.text}
          chatDate={chat[1]?.date} 
          setSelectedChat={setSelectedChat} 
          selectedChatId={selectedChatId} 
          userStatuses={userStatuses}
        />
      ))}
    </section>          
  )
}

export default UserChats