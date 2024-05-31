import Navbar from './Navbar';
import Search from './Search';
import UserChats from './UserChats';
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
      <UserChats selectedChatIdFromSearch = {selectedChatIdFromSearch}/>
    </section>
  )
}

export default Sidebar