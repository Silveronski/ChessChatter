import online from '../../assets/images/online.jpg';
import offline from '../../assets/images/offline.png';
import { useRefs } from '../../hooks/useRefs';
import { useContext } from 'react';
import { ChatContext } from '../../context/ChatContext';

const UserChat = ({ userInfo, selectedChatId, setSelectedChat, chatLastMsg, chatDate, userStatuses }) => {
    const { dispatch } = useContext(ChatContext);
    const { showChat } = useRefs();

    const handleSelect = (user) => {
        setSelectedChat(user.uid);
        dispatch({ type:"CHANGE_USER", payload: user }); // move to chat window with the user.
        if (window.innerWidth < 940) showChat();
    }

    return (
        <section className={`user-chat ${selectedChatId === userInfo?.uid ? 'selected-chat' : ''}`}
         id={userInfo?.uid} 
         onClick={() => handleSelect(userInfo)}
        >        
            <img className='user-photo' src={userInfo?.photoURL} alt='user image'/>
            <div className='user-chat-info'>
                <span>{userInfo?.displayName}</span>
                <div className='lastmsg-time'>
                    <p className='lastmsg-text'>{chatLastMsg?.length >= 36 ? chatLastMsg.substring(0,30) + "..." : chatLastMsg}</p>                         
                    <div className='date-status'>
                        {chatLastMsg && <p>{JSON.stringify(chatDate).substring(1,6)}</p> }                
                        <p>{userStatuses[userInfo?.uid] ? <img src={online}/> : <img src={offline}/>}</p>                   
                    </div>                                   
                </div>
            </div>
        </section>    
    )
}

export default UserChat