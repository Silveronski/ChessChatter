import { ReactNode, createContext, useContext } from "react";
import { useAuth } from "../hooks/useAuth";
import { User } from "firebase/auth";

interface AuthContextProviderProps {
    children: ReactNode
};

interface AuthContextType {
    currentUser: User | null;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
    const { currentUser } = useAuth();
    return (
        <AuthContext.Provider value={{ currentUser }}>
            {children}
        </AuthContext.Provider>
    )   
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('AuthContext must be used within a AuthContextProvider');
    }
    return context;
};