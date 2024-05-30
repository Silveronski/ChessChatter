import Sidebar from '../components/sidebar/Sidebar';
import Chat from '../components/chat/Chat';
import GameInvitations from '../components/notifications/GameInvitations';
import UserPresenceNotifications from '../components/notifications/UserPresenceNotifications';
import UpdateCurrentUserPresence from '../components/notifications/UpdateCurrentUserPresence';
import MessageNotification from '../components/notifications/MessageNotification';
import { RefContextProvider } from '../context/RefContext';

const Home = () => {
  return (
    <main className='home'>
        <section className='container'>  
        <RefContextProvider>
          <Sidebar/>
          <Chat/>
        </RefContextProvider>   
          <UpdateCurrentUserPresence/>
          <UserPresenceNotifications/>
          <MessageNotification/>
          <GameInvitations/>                                                                     
        </section>
    </main>
  )
}

export default Home