import React, { useContext, useEffect, useState } from 'react'
import Message  from './Message'
import { ChatContext } from '../context/ChatContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import logo from '../assets/images/logo.png'

const Messages = () => {

    const [messages, setMessages] = useState([]);
    const {data} = useContext(ChatContext);

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
            doc.exists() && setMessages(doc.data().messages);
        });

        return () => {
            unsub();
        }

    }, [data.chatId]);
        
    return (
        <div className={`${data.chatId !== "null" ? "messages" : "logo-panel"}`}> 

            {messages && messages.map((msg) => (
                <Message message={msg} key={msg.id}/>
            ))}

            {data.chatId === "null" && (
                <div className='panel-content'>
                    <img src={logo}/>
                    <p>Send and receive messages</p>
                    <p>Play Backgammon with your friends!</p>
                </div>              
            )}                              
        </div>        
    )
}

export default Messages