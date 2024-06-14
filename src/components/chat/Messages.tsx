import { useEffect, useState } from 'react';
import { useChatContext } from '../../context/ChatContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import Message  from './Message';
import newLogo from '../../assets/images/newLogo.png';

const Messages = () => {
    const { data } = useChatContext();
    const [messages, setMessages] = useState<TMessage[]>([]);

    useEffect(() => {
        const getMessages = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
            doc.exists() && setMessages(doc.data().messages);
        });  
        return () => getMessages();                
    }, [data.chatId]);
   
    return (
        <section className={`${data.chatId !== "null" ? "messages" : "logo-panel"}`}> 
            {messages && messages.map((msg) => (
                <Message message={msg} key={msg.id}/>
            ))}
            {data.chatId === "null" && (
                <div className='panel-content'>
                    <img src={newLogo} alt='site logo'/>
                    <p>Send and receive messages</p>
                    <p>Play Chess with your friends!</p>
                </div>              
            )}                                       
        </section>        
    )
}

export default Messages