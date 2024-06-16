import Navbar from './Navbar';
import Search from './Search';
import UserChats from './UserChats';
import React, { useCallback, useState } from 'react';
import { useRefContext } from '../../context/RefContext';

const Sidebar: React.FC = () => {
  const { sidebarRef } = useRefContext();
  const [selectedChatIdFromSearch, setSelectedChatIdFromSearch] = useState<string>("");

  const handleDataFromSearch = useCallback((chatId: string) => {
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