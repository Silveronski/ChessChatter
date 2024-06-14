import { createContext } from "react";
import { useAuth } from "../hooks/useAuth";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const { currentUser } = useAuth();
    return (
        <AuthContext.Provider value={{ currentUser }}>
            {children}
        </AuthContext.Provider>
    )   
}