import Navbar from './Navbar';
import Search from './Search';
import Chats from './Chats';
import { useCallback, useContext, useState } from 'react';
import { RefContext } from '../../context/RefContext';

const Sidebar = () => {
  const { sidebarRef } = useContext(RefContext);
  const [selectedChatIdFromSearch, setSelectedChatIdFromSearch] = useState("");

  const handleDataFromSearch = useCallback((chatId) => {
    setSelectedChatIdFromSearch(chatId);
  },[selectedChatIdFromSearch]);

  return (
    <section className='sidebar' ref={sidebarRef}>
      <Navbar/>
      <Search selectedChatIdFromSearch={handleDataFromSearch}/>
      <Chats selectedChatIdFromSearch = {selectedChatIdFromSearch}/>
    </section>
  )
}

export default Sidebar