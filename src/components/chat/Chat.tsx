import React from 'react';
import Messages from './Messages';
import Input from './Input';
import back from '../../assets/images/back.png';
import pawn from '../../assets/images/pawn.png';
import { useChatContext } from '../../context/ChatContext';
import { useGameInviter } from '../../hooks/useGameInviter';
import { useRefContext } from '../../context/RefContext';
import { useRefs } from '../../hooks/useRefs';

const Chat: React.FC = () => {
  const { data } = useChatContext();
  const { chatRef } = useRefContext();
  const { invitePlayer } = useGameInviter();
  const { showSidebar } = useRefs();

  const handleGameInvite = async (): Promise<void> => {
    if (data.user?.uid) await invitePlayer(data.user.uid); 
  }
    
  return (
    <section className='chat' ref={chatRef}>
      <div className="chat-info">
        <div className='user-info'>
          <img src={back} className='backBtn' onClick={() => showSidebar()} alt='back button'/>
          {(data.chatId !== "null" && data.user?.photoURL) && <img src={data.user?.photoURL} alt='user image'/>}
          <span>{data.user?.displayName}</span> 
        </div>       
        {data.chatId !== "null" && 
          <button 
            onClick={handleGameInvite}>Play Chess 
            <img src={pawn}/>
          </button>
        }
      </div>        
        <Messages/>
        <Input/>  
    </section>
  )
};

export default Chat