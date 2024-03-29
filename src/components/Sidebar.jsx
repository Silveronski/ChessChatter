import React, { useState } from 'react';
import Navbar from './Navbar';
import Search from './Search';
import Chats from './Chats';

const Sidebar = () => {

  const [selectedChatIdFromSearch, setSelectedChatIdFromSearch] = useState("");

  const handleDataFromSearch = (chatId) => {
    setSelectedChatIdFromSearch(chatId);
  }

  return (
    <div className='sidebar'>
      <Navbar/>
      <Search selectedChatIdFromSearch={handleDataFromSearch}/>
      <Chats selectedChatIdFromSearch = {selectedChatIdFromSearch}/>
    </div>
  )
}

export default Sidebar