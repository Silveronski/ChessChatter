import { signOut } from 'firebase/auth'
import React, { useContext } from 'react'
import { auth, db } from '../firebase'
import { AuthContext } from '../context/AuthContext';
import newLogo from '../assets/images/newLogo.png'
import { Timestamp, doc, updateDoc } from 'firebase/firestore';

const Navbar = () => {

  const {currentUser} = useContext(AuthContext);

  const signUserOut = async () => {
    try { 
      const userRef = doc(db, 'presence', currentUser.uid); 
      await updateDoc(userRef, { 
        online: false, 
        hasShown: false 
      });

      await signOut(auth);

      sessionStorage.removeItem('authInitialized');
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