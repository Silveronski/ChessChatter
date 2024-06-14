import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { ChatContextProvider } from './context/ChatContext';
import { RefContextProvider } from './context/RefContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <AuthContextProvider>
        <ChatContextProvider>   
            <RefContextProvider>
                <App/> 
            </RefContextProvider>                                 
        </ChatContextProvider>
    </AuthContextProvider>   
);