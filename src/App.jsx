import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useContext } from 'react'
import { AuthContext } from './context/AuthContext'
import './style.scss'

function App() {

  const {currentUser} = useContext(AuthContext);

  const ProtectedRoute = ({children}) => {
    if (!currentUser){
      return <Navigate to="/login"/>
    }
    return children;
  }

  return (    
    <BrowserRouter>
      <Routes>
        <Route path='/' index element=
          {<ProtectedRoute>
            <Home/>
          </ProtectedRoute>}>      
        </Route>
        <Route path='register' element={<Register/>}></Route>
        <Route path='login' element={<Login/>}></Route>
        {/* <Route path='*' index element={<ErrorPage/>}></Route> */}
      </Routes>
    </BrowserRouter>       
  )
}

export default App