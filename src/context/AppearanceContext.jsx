import { createContext, useCallback, useState } from "react";

export const AppearanceContext = createContext();

export const AppearanceContextProvider = ({children}) => {
    const [showSidebar, setShowSidebar] = useState(true);
    const [showChat, setShowChat] = useState(true);

    const controlSidebarAppearance = useCallback((valFromUserChats) => {
        setShowSidebar(valFromUserChats);
    },[showSidebar]);
    
    
    const controlChatAppearance = useCallback((valFromUserChats) => {
        setShowChat(valFromUserChats);
    },[showChat]);

    return (
        <AppearanceContext.Provider value={{ controlSidebarAppearance, controlChatAppearance, showSidebar, showChat }}>
          {children}
        </AppearanceContext.Provider>
    );
}