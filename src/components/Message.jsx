import React, { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

const Message = ({message}) => {

  const {currentUser} = useContext(AuthContext);
  const {data} = useContext(ChatContext);
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({behavior:"smooth"})
  },[message])


  return (
    <div ref={ref} className={`message ${message.senderId === currentUser.uid && "owner"}`}>
      <div className="message-info">
        <img src={message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL}/>
        <span>{JSON.stringify(message.date).substring(1,6)}</span>
      </div>
      <div className="message-content">
        <p>{message.text}</p>
        {message.img && <img src={message.img}/>}
      </div>
    </div>

  )
}

export default Message