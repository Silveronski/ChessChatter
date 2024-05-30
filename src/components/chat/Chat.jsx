import Messages from './Messages';
import Input from './Input';
import back from '../../assets/images/back.png';
import pawn from '../../assets/images/pawn.png';
import { useContext } from 'react';
import { ChatContext } from '../../context/ChatContext';
import { useGameInviter } from '../../hooks/useGameInviter';
import { RefContext } from '../../context/RefContext';

const Chat = () => {
  const { data } = useContext(ChatContext);
  const { chatRef, sidebarRef } = useContext(RefContext);
  const { invitePlayer } = useGameInviter();

  const handleGameInvite = async () => await invitePlayer(data.user.uid);
    
  const handleBackBtn = () => {
    sidebarRef.current.style.display = 'block';
    chatRef.current.style.display = 'none';
  }

  return (
    <section className='chat' ref={chatRef}>
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
    </section>
  )
};

export default Chat