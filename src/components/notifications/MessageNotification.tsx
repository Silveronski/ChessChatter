import { useEffect, useRef } from 'react';
import { Timestamp, collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { useAuthContext } from '../../context/AuthContext';
import msgSound from '../../assets/audio/msgSound.mp3';

const MessageNotification = () => {
    const { currentUser } = useAuthContext();
    const msgReceivedSound = useRef<HTMLAudioElement>(null);

    useEffect(() => {
      if (!currentUser?.uid) return;   
      onSnapshot(
        collection(db, "chats"),
        (snapshot) => {
          snapshot.forEach((chatDoc) => {
            const msgAraayLen = chatDoc.data().messages.length;
            const receiverId = chatDoc.data().messages[msgAraayLen-1]?.receiverId;
            const msgDate = chatDoc.data().messages[msgAraayLen-1]?.fullDate.seconds;
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