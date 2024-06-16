import React, { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { useChatContext } from '../../context/ChatContext';
import { useFirebase } from '../../hooks/useFirebase';
import { storage } from '../../firebase/firebase';
import { v4 as uuid } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { validImgExtensions } from '../../utils/utilities';
import { useToastr } from '../../hooks/useToastr';
import addImg from '../../assets/images/img.png';
import vMark from '../../assets/images/v.png';

const Input: React.FC = () => {
  const { currentUser } = useAuthContext();
  const { data } = useChatContext();
  const { updateUserChatsDoc, updateChatsDoc } = useFirebase();
  const [text, setText] = useState<string>("");
  const [img, setImg] = useState<File | null>(null);
  const [imgIsReady, setImgIsReady] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  
  useEffect(() => {
    setImg(null);
    setImgIsReady(false);
    window.innerWidth > 940 && inputRef?.current?.focus();  
    return () => setText("");     
  },[data?.chatId]);

  const handleKeyPress = async (e: KeyboardEvent): Promise<void | boolean> => {
    if (img) e.key === "Enter" && await handleSend();        
    else (e.key === "Enter" && text.trim()!== '') && await handleSend(); 
  }

  const handleImage = (e: ChangeEvent<HTMLInputElement>): void => {
    const img = e.target.files ? e.target.files[0] : null;
    if (img && validImgExtensions.includes(img.type)) {
      setImg(img);
      setImgIsReady(true);
    }
    else alert("Invalid image format!"); 
    
    inputRef.current && inputRef.current.focus(); 
  }
                                                           
  const handleSend = async (): Promise<void> => {
    try {
      if (img) { // user sent an image
        const storageRef = ref(storage, uuid());      
        const uploadTask = uploadBytesResumable(storageRef, img);
        const msgText = text;
        setText("");     
        uploadTask.on("state_changed",
          null,         
          (_error: unknown) => {
            useToastr('There was an error sending the image', 'error'); 
            resetImgState();
            return;      
          }, 
          async () => { // This part is called when the upload is complete           
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
              data?.user && await updateChatsDoc(msgText, data.chatId, data.user.uid, true, downloadURL);
            });
            await Promise.all([
              updateUserChatsDoc(currentUser!.uid, data.chatId),
              data?.user && updateUserChatsDoc(data.user.uid)
            ]);            
          }
        );    
      } 
      else if (!img && text.trim() !== '') { // user didn't send an image
        const msgText = text;
        setText(""); 
        data?.user && await Promise.all([
          updateChatsDoc(msgText, data.chatId, data.user.uid), 
          updateUserChatsDoc(currentUser!.uid, data.chatId, msgText),
          updateUserChatsDoc(data.user.uid, data.chatId, msgText)
        ]);     
      }
      inputRef.current && inputRef.current.focus();  
      resetImgState();
    } 
    catch (_error) { useToastr('There was an error sending the message', 'error'); } 
  }

  const resetImgState = (): void => {
    setImg(null);
    setImgIsReady(false);
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
       ref={inputRef}
      />          
      <div className="icons">
        <input 
          type="file"
          id="img"
          accept="image/*"
          style={{display:"none"}}
          onChange={handleImage}
        />
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