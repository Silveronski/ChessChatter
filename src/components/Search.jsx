import React, { useContext, useEffect, useState } from 'react'
import { collection, getDoc, getDocs, query, serverTimestamp, setDoc, where, doc, updateDoc } from "firebase/firestore";
import { db } from '../firebase'
import { AuthContext } from '../context/AuthContext';

const Search = () => {

  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const {currentUser} = useContext(AuthContext);

  useEffect(() => {
    if (username.length === 0){
      setErr(false);
    }
  },[username])


  const handleKey =  (e) => {
    (e.code === "Enter" && username.trim() !== '') && handleSearch();
  }

  const handleSearch = async () => {
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
          [combinedId + ".date"]: serverTimestamp(),
        });      

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });   
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