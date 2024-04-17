import React, { useContext, useEffect, useState } from 'react';
import { collection, getDoc, getDocs, query, setDoc, where, doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from '../firebase';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { AppearanceContext } from '../context/AppearanceContext';

const Search = ({selectedChatIdFromSearch}) => {

  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);
  const {currentUser} = useContext(AuthContext);
  const {dispatch} = useContext(ChatContext);
  const {controlSidebarAppearance, controlChatAppearance} = useContext(AppearanceContext);

  useEffect(() => {
    if (username.length === 0){
      setErr(false);
      setUser(null);
    }
  },[username]);


  const handleKey = (e) => {
    (e.code === "Enter" && username.trim() !== '') && handleSearch();
  }

  const handleClick = () => {
    username.trim() !== '' && handleSearch();
  }

  const handleSearch = async () => {
    if (username.toLowerCase() === currentUser.displayName.toLowerCase()) {
      setErr(true);
      return;
    }
    const q = query(
      collection(db, "users"), 
      where("displayName", "==", username)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
        setErr(false);
      });
      if (querySnapshot.empty){
        setErr(true);
      }
    }
    catch (err) {
      setErr(true);
    }
  }

  
  const handleSelect = async () => {
    //check whether the group(chats in firestore) exists, if not, create
    const combinedId = 
      currentUser.uid > user.uid 
        ? currentUser.uid + user.uid 
        : user.uid + currentUser.uid

    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        // create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId),{ messages: [] });
        
        //create user chats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId+".userInfo"] : {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: Timestamp.now().toDate(),
        });      

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: Timestamp.now().toDate(),
        });   
      }

      dispatch({type:"CHANGE_USER", payload: user}); // move to chat window with the user.
      selectedChatIdFromSearch(user.uid);

      if (window.innerWidth < 940) {
        controlSidebarAppearance(false);
        controlChatAppearance(true);
      }
    }    
    catch (err) {}

    setUser(null);
    setUsername("");   
  }

  return (
    <div className='search'>
      <div className="search-form">
        <input 
        type="text" 
        placeholder='Find a user'
        onKeyDown={handleKey}
        onChange={(e) => setUsername(e.target.value)} 
        value={username}/>
        <button className='search-btn' onClick={handleClick}>Search</button>
      </div>

      {err && <span className='error' style={{color: "red"}}>User not found!</span>}
      {user && ( 
        <div className="user-chat" onClick={handleSelect}>
          <img src={user.photoURL}/>
          <div className="user-chat-info">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default Search