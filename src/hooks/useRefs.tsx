import { useContext } from "react";
import { RefContext } from "../context/RefContext";

export const useRefs = () => {
    const { chatRef, sidebarRef } = useContext(RefContext);

    const showSidebar = () => {
        sidebarRef.current.style.display = 'block';
        chatRef.current.style.display = 'none';
    }

    const showChat = () => {
        sidebarRef.current.style.display = 'none';
        chatRef.current.style.display = 'block';
    }

    return { showSidebar, showChat }
}