import React, { useEffect, useRef } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { useChatContext } from '../../context/ChatContext';
import { TMessage } from '../../types/types';
import defaultAvatar from '../../assets/images/defaultAvatar.png';

interface MessageProps {
  message: TMessage
};

const Message: React.FC<MessageProps> = ({ message }) => {
  const { currentUser } = useAuthContext();
  const { data } = useChatContext();
  const msgRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    msgRef.current?.scrollIntoView({ block: "end" });
  },[message]);

  const formatMessage = (msg: string) => {
    let newMsg = '';
    let wordCount = 0;
    let msgArr = msg.split('');
    msgArr.forEach(m => {
      if (wordCount === 35) {
        newMsg +=`<br>${m}`;
        wordCount = 0;
      }
      else {
        wordCount++;
        newMsg += m;
      }
    });
    return newMsg;
  }

  return (
    <section ref={msgRef} className={`message ${message.senderId === currentUser?.uid && "owner"}`}>
      <div className="message-info">
        <img 
          src={
            message.senderId === 
            currentUser?.uid ? currentUser?.photoURL || defaultAvatar 
            : data.user?.photoURL || defaultAvatar}
          alt='user image'
        />
        <span>{JSON.stringify(message.date).substring(1,6)}</span>
      </div>
      <div className="message-content">
        <p dangerouslySetInnerHTML={{ __html: (message.text.length > 35 ? formatMessage(message.text) : message.text) + (message.img ? `<br/> <img src="${message.img}"/>` : '') }} /> 
      </div>
    </section>
  )
}

export default Message