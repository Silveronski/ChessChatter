import { MutableRefObject, ReactNode, createContext, useContext, useRef } from "react";

interface RefContextProviderProps {
    children: ReactNode
};

interface RefContextType {
    sidebarRef: MutableRefObject<HTMLElement | null>,
    chatRef: MutableRefObject<HTMLElement | null>,
};

export const RefContext = createContext<RefContextType | null>(null);

export const RefContextProvider = ({ children }: RefContextProviderProps) => {
    const sidebarRef = useRef<HTMLElement | null>(null);
    const chatRef = useRef<HTMLElement | null>(null);
    return (
        <RefContext.Provider value={{ sidebarRef, chatRef }}>
            {children}
        </RefContext.Provider>
    )
};

export const useRefContext = () => {
    const context = useContext(RefContext);
    if (!context) {
        throw new Error('RefContext must be used within a RefContextProvider');
    }
    return context;
};