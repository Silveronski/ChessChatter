import { createContext, useRef } from "react";

export const RefContext = createContext();

export const RefContextProvider = ({ children }) => {
    const sidebarRef = useRef(null);
    const chatRef = useRef(null);
    return (
        <RefContext.Provider value={{ sidebarRef, chatRef }}>
            {children}
        </RefContext.Provider>
    )
}