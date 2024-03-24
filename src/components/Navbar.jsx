import { signOut } from 'firebase/auth'
import React, { useContext } from 'react'
import { auth, db } from '../firebase'
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/images/smallLogo.png'
import { doc, setDoc } from 'firebase/firestore';

const Navbar = () => {

  const {currentUser} = useContext(AuthContext);

  const signUserOut = async () => {
    try { 
      const userRef = doc(db, `presence/${currentUser?.uid}`); 
      await setDoc(userRef, { online: false });
      signOut(auth);
    } 
      catch (error) {
        console.error('Error setting user presence:', error);
      }
  }

  return (
    <div className='navbar'>
      <div className='logo-container'><img src={logo} className='logo'/></div>  
      {/* <span className="logo">Backgammon Chatter</span> */}
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