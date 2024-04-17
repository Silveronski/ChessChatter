import React, { useContext } from 'react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase/firebase';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { doc, updateDoc } from 'firebase/firestore';
import newLogo from '../assets/images/newLogo.png';
import logout from '../assets/images/logout.png';

const Navbar = () => {
  const {currentUser} = useContext(AuthContext);
  const {dispatch} = useContext(ChatContext);

  const signUserOut = async () => {
    try {      
      const userRef = doc(db, 'presence', currentUser.uid); 
      await updateDoc(userRef, { 
        count : 0,
        online: false, 
        hasShown: false 
      });
      await signOut(auth);
      dispatch({ type: "LOG_OUT", payload: {} });
    } 
      catch (error) {
        console.error('Error logging out:', error);
      }
  }

  return (
    <div className='navbar'>
      <div className='logo-container'><img src={newLogo} className='logo'/></div>  
      <div className="user">
          <img src={currentUser?.photoURL}/>
          <span>{currentUser?.displayName}</span>
          <button onClick={() => signUserOut()}>Log out<img src={logout}/></button>
      </div>
    </div>
  )
}

export default Navbar