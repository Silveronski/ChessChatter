import React, { useContext, useEffect, useState } from 'react'
import attach from '../assets/images/attach.png'
import addImg from '../assets/images/img.png'
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

  const hourOfMsg = Timestamp.now().toDate().getHours().toString().length === 2 ? 
                      Timestamp.now().toDate().getHours() : "0"+ Timestamp.now().toDate().getHours() 
  const minOfMsg = Timestamp.now().toDate().getMinutes().toString().length === 2 ?
                    Timestamp.now().toDate().getMinutes() : "0"+ Timestamp.now().toDate().getMinutes();

  const timeOfMsg = hourOfMsg + ":" + minOfMsg;

  const handleKeyPress = async (e) => {
    (e.key === "Enter" && text.trim()!== '') && await handleSend();     
  }

                                                               
  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, uuid());      
      const uploadTask = uploadBytesResumable(storageRef, img);
      
      uploadTask.on(
        (error) => {
            console.log(error);
            // setError(true);
        }, 
        () => {             
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
              await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                  id: uuid(),
                  text,
                  senderId: currentUser.uid,
                  date: timeOfMsg,  
                  img: downloadURL,
                })
              });
            });
        }
      );           
    }
    else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: timeOfMsg,
        }),
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"] : {
        text        
      },
      [data.chatId + ".date"] : serverTimestamp()
    })

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"] : {
        text        
      },
      [data.chatId + ".date"] : serverTimestamp()
    })

    document.querySelector('.input input').focus();

    setText("");
    setImg(null);
  }

  return (
    <div className='input'>   
      <input type="text"
       placeholder='Type something...'
       onChange={e => setText(e.target.value)}
       value={text}
       onKeyDown={handleKeyPress}/>     
      <div className="icons">
        <img src={attach}/>
        <input type="file" id="img" style={{display:"none"}} onChange={e => setImg(e.target.files[0])}/>
        <label htmlFor="img">
        <img src={addImg}/>
        </label>         
        <button onClick={handleSend}>Send</button> 
      </div>             
    </div>
  )
}

export default Input