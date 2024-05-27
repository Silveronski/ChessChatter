import { useCallback, useState } from 'react';
import Navbar from './Navbar';
import Search from './Search';
import Chats from './Chats';

const Sidebar = () => {
  const [selectedChatIdFromSearch, setSelectedChatIdFromSearch] = useState("");

  const handleDataFromSearch = useCallback((chatId) => {
    setSelectedChatIdFromSearch(chatId);
  },[selectedChatIdFromSearch]);

  return (
    <section className='sidebar'>
      <Navbar/>
      <Search selectedChatIdFromSearch={handleDataFromSearch}/>
      <Chats selectedChatIdFromSearch = {selectedChatIdFromSearch}/>
    </section>
  )
}

export default Sidebar