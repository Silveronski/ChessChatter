import React, { useContext } from 'react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { doc, updateDoc } from 'firebase/firestore';
import newLogo from '../assets/images/newLogo.png';

const Navbar = () => {

  const {currentUser} = useContext(AuthContext);
  const {dispatch} = useContext(ChatContext);

  const signUserOut = async () => {
    try { 
      dispatch({ type: "LOG_OUT", payload: {} });
      const userRef = doc(db, 'presence', currentUser.uid); 
      await updateDoc(userRef, { 
        count : 0,
        online: false, 
        hasShown: false 
      });
      await signOut(auth);
    } 
      catch (error) {
        console.error('Error setting user presence:', error);
      }
  }

  return (
    <div className='navbar'>
      <div className='logo-container'><img src={newLogo} className='logo'/></div>  
      <div className="user">
          <img src={currentUser.photoURL}/>
          <span>{currentUser.displayName}</span>
          <button>Play</button>
          <button onClick={() => signUserOut()}>Logout</button>
      </div>
    </div>
  )
}

export default Navbar