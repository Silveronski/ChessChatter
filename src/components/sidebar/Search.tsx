import search from '../../assets/images/search.png';
import React, { KeyboardEvent, useEffect, useState } from 'react';
import { getDoc, getDocs, setDoc, doc} from "firebase/firestore";
import { db } from '../../firebase/firebase';
import { useAuthContext } from '../../context/AuthContext';
import { useChatContext } from '../../context/ChatContext';
import { useFirebase } from '../../hooks/useFirebase';
import { useRefs } from '../../hooks/useRefs';
import { User } from 'firebase/auth';

interface SearchProps {
  selectedChatIdFromSearch: Function
};

const Search: React.FC<SearchProps> = ({ selectedChatIdFromSearch }) => {
  const { currentUser } = useAuthContext();
  const { dispatch } = useChatContext();
  const { showChat } = useRefs();
  const { createUserChat, searchForUser } = useFirebase();
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string>("");
  const [err, setErr] = useState<boolean>(false);

  useEffect(() => {
    if (username.length === 0){
      setErr(false);
      setUser(null);
    }
  },[username]);

  const handleKey = (e: KeyboardEvent) => (e.code === "Enter" && username.trim() !== '') && handleUserSearch();
    
  const handleSearchClick = (): Promise<void> | boolean => username.trim() !== '' && handleUserSearch();
    
  const handleUserSearch = async (): Promise<void> => {
    if (username.toLowerCase() === currentUser?.displayName?.toLowerCase()) {
      setErr(true);
      return;
    }  
    try {
      const userQuery = searchForUser(username);
      const querySnapshot = await getDocs(userQuery);
      querySnapshot.forEach((doc) => {
        const user = doc.data() as User;
        setUser(user);
        setErr(false);
      });
      if (querySnapshot.empty) setErr(true);   
    }
    catch (_err) { setErr(true); }        
  }

  const handleUserSelect = async () => {
    //check whether the group(chats in firestore) exists, if not, create
    const combinedId = 
      currentUser!.uid > user!.uid 
        ? currentUser!.uid + user?.uid 
        : user?.uid + currentUser!.uid
    try {
      const chat = await getDoc(doc(db, "chats", combinedId));
      if (!chat.exists()) {    
        await Promise.all([      
          setDoc(doc(db, "chats", combinedId),{ messages: [] }), // creates a chat in chats collection    
          createUserChat(currentUser!.uid, user!, combinedId),   // creates user chats for current user
          createUserChat(user!.uid, currentUser!, combinedId)    // creates user chats for searched user
        ]);      
      }
      dispatch({ type:"CHANGE_USER", payload: user! }); // move to chat window with the user.
      selectedChatIdFromSearch(user?.uid);
      if (window.innerWidth < 940) showChat();     
    }    
    catch (_err) {}
    finally{
      setUser(null);
      setUsername("");
    }     
  }

  return (
    <section className='search'>
      <div className="search-form">
        <input 
          type="text" 
          placeholder='Find a user'
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)} 
          value={username}
        />
        <img className='search-icon' alt='search for users icon' src={search} onClick={handleSearchClick}/>
      </div>
      {err && <span className='error'>User not found!</span>}
      {user && ( 
        <div className="user-chat" onClick={handleUserSelect}>
          {user?.photoURL && <img src={user.photoURL} alt='found user image'/>}
          <div className="user-chat-info">
            <span>{user?.displayName}</span>
          </div>
        </div>
      )}
    </section>
  )
}

export default Search