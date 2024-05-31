import Messages from './Messages';
import Input from './Input';
import back from '../../assets/images/back.png';
import pawn from '../../assets/images/pawn.png';
import { useContext } from 'react';
import { ChatContext } from '../../context/ChatContext';
import { useGameInviter } from '../../hooks/useGameInviter';
import { RefContext } from '../../context/RefContext';
import { useRefs } from '../../hooks/useRefs';

const Chat = () => {
  const { data } = useContext(ChatContext);
  const { chatRef } = useContext(RefContext);
  const { invitePlayer } = useGameInviter();
  const { showSidebar } = useRefs();

  const handleGameInvite = async () => await invitePlayer(data.user.uid);
    
  return (
    <section className='chat' ref={chatRef}>
      <div className="chat-info">
        <div className='user-info'>
          <img src={back} className='backBtn' onClick={() => showSidebar()} alt='back button'/>
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