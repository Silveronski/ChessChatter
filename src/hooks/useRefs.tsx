import { useRefContext } from "../context/RefContext";

export const useRefs = () => {
    const { chatRef, sidebarRef } = useRefContext();

    const showSidebar = (): void => {
        if (areRefsPresenet()) {
            sidebarRef.current!.style.display = 'block';
            chatRef.current!.style.display = 'none';
        }       
    }

    const showChat = (): void => {
        if (areRefsPresenet()) {
            sidebarRef.current!.style.display = 'none';
            chatRef.current!.style.display = 'block';
        }          
    }

    const areRefsPresenet = (): HTMLElement | null => {
        return sidebarRef.current && chatRef.current;
    }

    return { showSidebar, showChat }
}