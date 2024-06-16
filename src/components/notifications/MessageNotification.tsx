import React, { useEffect, useRef } from 'react';
import { Timestamp, collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { useAuthContext } from '../../context/AuthContext';
import msgSound from '../../assets/audio/msgSound.mp3';

const MessageNotification: React.FC = () => {
    const { currentUser } = useAuthContext();
    const msgReceivedSound = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
      if (!currentUser?.uid) return;   
      onSnapshot(
        collection(db, "chats"),
        (snapshot) => {
          snapshot.forEach((chatDoc) => {
            const data = chatDoc.data();
            const msgAraayLen: number = data.messages.length;
            const receiverId: string = data.messages[msgAraayLen-1]?.receiverId;
            const msgDate: number = data.messages[msgAraayLen-1]?.fullDate.seconds;
            if (receiverId === currentUser.uid && msgDate === Timestamp.now().seconds) {           
              msgReceivedSound.current?.play();
            }          
          })
        }     
      );        
    },[]);

    return <audio src={msgSound} ref={msgReceivedSound}></audio>
}

export default MessageNotification