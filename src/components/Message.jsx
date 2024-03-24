import React, { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import bruh from '../assets/audio/bruh.mp3';

const Message = ({message}) => {

  const {currentUser} = useContext(AuthContext);
  const {data} = useContext(ChatContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const ref = useRef();


  useEffect(() => {
    ref.current?.scrollIntoView();
  },[message])


  return (
    <div ref={ref} className={`message ${message.senderId === currentUser.uid && "owner"}`}>
      <div className="message-info">
        <img src={message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL}/>
        <span>{JSON.stringify(message.date).substring(1,6)}</span>
      </div>
      <div className="message-content">
        <p>{message.text} {message.img && <><br/><img src={message.img}/></>}</p>   
      </div>
    </div>
  )
}

export default Message