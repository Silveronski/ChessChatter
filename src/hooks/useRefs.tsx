import { useRefContext } from "../context/RefContext";

export const useRefs = () => {
    const { chatRef, sidebarRef } = useRefContext();

    const showSidebar = () => {
        if (areRefsPresenet()) {
            sidebarRef.current!.style.display = 'block';
            chatRef.current!.style.display = 'none';
        }       
    }

    const showChat = () => {
        if (areRefsPresenet()) {
            sidebarRef.current!.style.display = 'none';
            chatRef.current!.style.display = 'block';
        }          
    }

    const areRefsPresenet = () => {
        return sidebarRef.current && chatRef.current;
    }

    return { showSidebar, showChat }
}