import React, { useContext, useEffect, useRef, useState } from 'react';
import addImg from '../assets/images/img.png';
import vMark from '../assets/images/v.png';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { v4 as uuid } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const Input = () => {

  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const {currentUser} = useContext(AuthContext);
  const {data} = useContext(ChatContext);
  const [imgIsReady, setImgIsReady] = useState(false);
  const inputRef = useRef();
  const validImgExtensions = ["image/png", "image/jpeg", "image/gif"];

  const hourOfMsg = Timestamp.now().toDate().getHours().toString().length === 2 ? 
                      Timestamp.now().toDate().getHours() : "0"+ Timestamp.now().toDate().getHours() 
  const minOfMsg = Timestamp.now().toDate().getMinutes().toString().length === 2 ?
                    Timestamp.now().toDate().getMinutes() : "0"+ Timestamp.now().toDate().getMinutes();

  const timeOfMsg = hourOfMsg + ":" + minOfMsg;

  const handleKeyPress = async (e) => {
    if (img) {
      e.key === "Enter" && await handleSend();
    }
    else {
      (e.key === "Enter" && text.trim()!== '') && await handleSend();     
    }
  }

  useEffect(() => {

    setImg(null);
    setImgIsReady(false);
    window.innerWidth > 940 && inputRef?.current?.focus();   

    return () =>  setText(""); 
       
  },[data.chatId]);


  const handleImage = (img) => {
    if (img && validImgExtensions.includes(img.type)) {
      setImg(img);
      setImgIsReady(true);
    }
    else {
      alert("Invalid image format!");
    }
  }

                                                               
  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, uuid());      
      const uploadTask = uploadBytesResumable(storageRef, img);
      const msgText = text;
      setText("");
      
      uploadTask.on(
        (error) => {
            console.error(error);       
        }, 
        () => {             
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text: msgText,
                senderId: currentUser.uid,
                receiverId: data.user.uid,
                date: timeOfMsg,  
                fullDate: Timestamp.now(),
                img: downloadURL,
              })
            });
          })
        }
      );
      
      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [data.chatId + ".lastMessage"] : {
          text : "Image",
          senderId: currentUser.uid         
        },
        [data.chatId + ".date"] : timeOfMsg,
        [data.chatId + ".fullDate"] : serverTimestamp()
      })
  
      await updateDoc(doc(db, "userChats", data.user.uid), {
        [data.chatId + ".lastMessage"] : {
          text : "Image",
          senderId: currentUser.uid               
        },
        [data.chatId + ".date"] : timeOfMsg,
        [data.chatId + ".fullDate"] : serverTimestamp()
      })
    }

    else if(!img && text.trim() !== '') {

      const msgText = text;
      setText("");
      
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text: msgText,
          senderId: currentUser.uid,
          receiverId: data.user.uid,
          date: timeOfMsg,
          fullDate: Timestamp.now(),
        }),
      });

      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [data.chatId + ".lastMessage"] : {
          text: msgText,
          senderId: currentUser.uid      
        },
        [data.chatId + ".date"] : timeOfMsg,
        [data.chatId + ".fullDate"] : serverTimestamp()
      })
  
      await updateDoc(doc(db, "userChats", data.user.uid), {
        [data.chatId + ".lastMessage"] : {
          text: msgText,
          senderId: currentUser.uid         
        },
        [data.chatId + ".date"] : timeOfMsg,
        [data.chatId + ".fullDate"] : serverTimestamp()
      })
    }

    inputRef.current.focus();  
    setImg(null);
    setImgIsReady(false);
  }

  return (
    (data.chatId !== "null" && <div className='input'>   
      <input 
       type="text"
       placeholder='Type something...'
       onChange={e => setText(e.target.value)}
       value={text}
       onKeyDown={handleKeyPress}
       ref={inputRef}/>          
      <div className="icons">
        <input type="file" id="img" accept="image/*" style={{display:"none"}} onChange={e => handleImage(e.target.files[0])}/>
        {imgIsReady && <img src={vMark}/>} 
        <label htmlFor="img">
        <img src={addImg}/>
        </label>              
        <button onClick={handleSend}>Send</button> 
      </div>             
    </div>)
  )
}

export default Input