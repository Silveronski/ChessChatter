import { useContext } from 'react';
import { ChatContext } from '../../context/ChatContext';
import { useGameInviter } from '../../hooks/useGameInviter';
import Messages from './Messages';
import Input from './Input';
import back from '../../assets/images/back.png';
import pawn from '../../assets/images/pawn.png';

const Chat = () => {
  const {invitePlayer} = useGameInviter();
  const {data} = useContext(ChatContext);

  const handleGameInvite = async () => await invitePlayer(data.user.uid);
    
  const handleBackBtn = () => {
    document.querySelector('.home .container .chat').style.display = 'none';
    document.querySelector('.home .container .sidebar').style.display = 'block';
  }

  return (
    <section className='chat'>
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
}

export default Chat