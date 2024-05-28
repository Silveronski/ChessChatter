import { useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const msgRef = useRef();

  useEffect(() => {
    msgRef.current?.scrollIntoView();
  },[message]);

  const formatMessage = (msg) => {
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
    <section ref={msgRef} className={`message ${message.senderId === currentUser.uid && "owner"}`}>
      <div className="message-info">
        <img src={message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL} alt='user image'/>
        <span>{JSON.stringify(message.date).substring(1,6)}</span>
      </div>
      <div className="message-content">
        <p dangerouslySetInnerHTML={{ __html: (message.text.length > 35 ? formatMessage(message.text) : message.text) + (message.img ? `<br/> <img src="${message.img}"/>` : '') }} /> 
      </div>
    </section>
  )
}

export default Message