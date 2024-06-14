import './styles/style.scss';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode
};

function App() {
  const { currentUser } = useContext(AuthContext);

  const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    if (!currentUser){
      return <Navigate to="/login"/>
    }
    return children;
  }

  return (    
    <BrowserRouter>
      <Routes>
        <Route path='/' index element=
          {<ProtectedRoute><Home/></ProtectedRoute>}>                    
        </Route>
        <Route path='register' element={<Register/>}></Route>
        <Route path='login' element={<Login/>}></Route>
        <Route path='*' element={<Navigate to={'/'}/>}></Route>
      </Routes>
    </BrowserRouter>       
  )
}

export default App