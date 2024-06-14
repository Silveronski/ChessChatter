import ReactDOM from 'react-dom/client';
import App from './App.js';
import { AuthContextProvider } from './context/AuthContext.js';
import { ChatContextProvider } from './context/ChatContext.js';
import { RefContextProvider } from './context/RefContext.js';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <AuthContextProvider>
        <ChatContextProvider>   
            <RefContextProvider>
                <App/> 
            </RefContextProvider>                                 
        </ChatContextProvider>
    </AuthContextProvider>   
);