import React, { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';
import { AppearanceContext } from '../context/AppearanceContext';
import { UseGame } from '../hooks/useGame';
import Messages from './Messages';
import Input from './Input';
import back from '../assets/images/back.png';
import pawn from '../assets/images/pawn.png';

const Chat = () => {
  const { invitePlayer } = UseGame();
  const {data} = useContext(ChatContext);
  const {controlSidebarAppearance, controlChatAppearance} = useContext(AppearanceContext);

  const handleGameInvite = async () => {
    await invitePlayer(data.user.uid);
  }
  
  const handleBackBtn = () => {
    controlChatAppearance(false);
    controlSidebarAppearance(true);
  }

  return (
    <div className='chat'>
      <div className="chat-info">
        <div className='user-info'>
          <img src={back} className='backBtn' onClick={handleBackBtn} alt='back button'/>
          {data.chatId !== "null" && <img src={data.user?.photoURL} alt='user image'/>}
          <span>{data.user?.displayName}</span> 
        </div>       
        {data.chatId !== "null" && <button onClick={handleGameInvite}>Play Chess <img src={pawn}/></button>}
      </div>        
        <Messages/>
        <Input/>  
    </div>
  )
}

export default Chat