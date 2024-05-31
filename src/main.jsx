import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthContextProvider } from './context/AuthContext.jsx';
import { ChatContextProvider } from './context/ChatContext.jsx';
import { RefContextProvider } from './context/RefContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
    <AuthContextProvider>
        <ChatContextProvider>   
            <RefContextProvider>
                <App/> 
            </RefContextProvider>                                 
        </ChatContextProvider>
    </AuthContextProvider>   
);