import React, { ReactNode, createContext, useContext, useReducer } from "react";
import {  useAuthContext } from "./AuthContext";
import { User } from "firebase/auth";
import { TUserInfo } from "../types/types";

interface ChatContextProviderProps {
    children: ReactNode
};

type TActionPayload = User | TUserInfo;

interface Action  {
    type: "CHANGE_USER" | "LOG_OUT",
    payload: TActionPayload
};

interface State {
    chatId: string,
    user: TActionPayload | null
};

const INITIAL_STATE: State = {
    user: null,
    chatId: "null"
};

interface ChatContextType {
    data: State,
    dispatch: React.Dispatch<Action>
};

export const ChatContext = createContext<ChatContextType | null>(null);

export const ChatContextProvider = ({ children }: ChatContextProviderProps) => {
    const { currentUser } = useAuthContext(); 
    
    const chatReducer = (state: State, action: Action): State => {
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
                    user: null,
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