import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthContextProvider } from './context/AuthContext.jsx';
import { ChatContextProvider } from './context/ChatContext.jsx';
import { AppearanceContextProvider } from './context/AppearanceContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
    <AuthContextProvider>
        <ChatContextProvider>
            <AppearanceContextProvider>
                <App/>          
            </AppearanceContextProvider>
        </ChatContextProvider>
    </AuthContextProvider>   
);