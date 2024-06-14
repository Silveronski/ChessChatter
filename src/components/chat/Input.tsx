import { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';
import { useFirebase } from '../../hooks/useFirebase';
import { storage } from '../../firebase/firebase';
import { v4 as uuid } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { validImgExtensions } from '../../utils/utilities';
import addImg from '../../assets/images/img.png';
import vMark from '../../assets/images/v.png';
import useToastr from '../../hooks/useToastr';

const Input = () => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const { updateUserChatsDoc, updateChatsDoc } = useFirebase();
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [imgIsReady, setImgIsReady] = useState(false);
  const inputRef = useRef();
  
  useEffect(() => {
    setImg(null);
    setImgIsReady(false);
    window.innerWidth > 940 && inputRef?.current?.focus();  
    return () => setText("");     
  },[data.chatId]);

  const handleKeyPress = async (e) => {
    if (img) e.key === "Enter" && await handleSend();        
    else (e.key === "Enter" && text.trim()!== '') && await handleSend(); 
  }

  const handleImage = (img) => {
    if (img && validImgExtensions.includes(img.type)) {
      setImg(img);
      setImgIsReady(true);
    }
    else alert("Invalid image format!"); 
    
    inputRef.current.focus(); 
  }
                                                           
  const handleSend = async () => {
    try {
      if (img) {
        const storageRef = ref(storage, uuid());      
        const uploadTask = uploadBytesResumable(storageRef, img);
        const msgText = text;
        setText("");  
  
        uploadTask.on(
          (error) => {
              useToastr('error', 'There was an error sending the image'); 
              return;      
          }, 
          () => {             
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
              await updateChatsDoc(msgText, data.chatId, data.user.uid, true, downloadURL);
            })
          }
        );
        await updateUserChatsDoc(currentUser.uid, data.chatId);
        await updateUserChatsDoc(data.user.uid);
      }
  
      else if(!img && text.trim() !== '') {
        const msgText = text;
        setText(""); 
        await updateChatsDoc(msgText, data.chatId, data.user.uid); 
        await updateUserChatsDoc(currentUser.uid, data.chatId, msgText);
        await updateUserChatsDoc(data.user.uid, data.chatId, msgText);
      }
  
      inputRef.current.focus();  
      setImg(null);
      setImgIsReady(false);
    } 
    catch (error) { useToastr('error', 'There was an error sending the message'); } 
  }

  return (
    (data.chatId !== "null" && 
    <section className='input'>   
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
    </section>)
  )
}

export default Input