import { signOut } from 'firebase/auth'
import React, { useContext } from 'react'
import { auth } from '../firebase'
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/images/smallLogo.png'

const Navbar = () => {

  const {currentUser} = useContext(AuthContext);

  return (
    <div className='navbar'>
      <div className='logo-container'><img src={logo} className='logo'/></div>  
      {/* <span className="logo">Backgammon Chatter</span> */}
      <div className="user">
          <img src={currentUser.photoURL}/>
          <span>{currentUser.displayName}</span>
          <button>Play</button>
          <button onClick={() => signOut(auth)}>Logout</button>
      </div>
    </div>
  )
}

export default Navbar