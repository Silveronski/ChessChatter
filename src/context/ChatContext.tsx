import { ReactNode, createContext, useContext, useReducer } from "react";
import {  useAuthContext } from "./AuthContext";

interface ChatContextProviderProps {
    children: ReactNode
};

export const ChatContext = createContext<any | null>(null);

export const INITIAL_STATE = {
    chatId: "null",
    user:{}
}

export const ChatContextProvider = ({ children }: ChatContextProviderProps) => {
    const { currentUser } = useAuthContext(); 
    
    const chatReducer = (state: any, action: any) => {
        switch(action.type) {
            case "CHANGE_USER":
                return {
                    user: action.payload,
                    chatId: currentUser!.uid > action.payload.uid 
                    ? currentUser!.uid + action.payload.uid
                    : action.payload.uid + currentUser!.uid
                }
            case "LOG_OUT":
                return {
                    user: {},
                    chatId: "null"
                }
            default:
                return state;
        }   
    }

    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

    return (
        <ChatContext.Provider value={{ data: state, dispatch }}>
            {children}
        </ChatContext.Provider>
    )   
}

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('ChatContext must be used within a ChatContextProvider');
    }
    return context;
};