import newLogo from '../../assets/images/newLogo.png';
import logout from '../../assets/images/logout.png';
import { useAuthContext } from '../../context/AuthContext';
import { useFirebase } from '../../hooks/useFirebase';
import React from 'react';

const Navbar: React.FC = () => {
  const { currentUser } = useAuthContext();
  const { userSignout } = useFirebase();

  return (
    <section className='navbar'>
      <div className='logo-container'><img src={newLogo} className='logo'/></div>  
      <div className="user">
          {currentUser?.photoURL && <img src={currentUser.photoURL} alt='current user image'/>}
          <span>{currentUser?.displayName}</span>
          <button onClick={() => userSignout()}>Log out<img src={logout}/></button>
      </div>
    </section>
  )
}

export default Navbar