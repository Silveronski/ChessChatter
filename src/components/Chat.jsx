import React, { useContext } from 'react'
import Messages from './Messages'
import Input from './Input'
import { ChatContext } from '../context/ChatContext';

const Chat = () => {
  const {data} = useContext(ChatContext);

  return (
    <div className='chat'>
      <div className="chat-info">
        <div className='user-info'>
          {data.chatId !== "null" && <img src={data.user?.photoURL}/>}
          <span>{data.user?.displayName}</span> 
        </div>       
        <button>Play Backgammon</button>
      </div>
        <Messages isChatSelected={data.chatId !== "null"}/>
        <Input isChatSelected={data.chatId !== "null"}/>  
    </div>
  )
}

export default Chat