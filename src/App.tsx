import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from './context/AuthContext';
import React from 'react';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import './styles/style.scss';

interface ProtectedRouteProps {
  children: React.ReactNode
};

function App() {
  const { currentUser, loading } = useAuthContext();

  const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    if (!loading && !currentUser){     
      return <Navigate to="/login"/>
    }
    return children;
  }

  return (    
    <BrowserRouter>
      <Routes>
        <Route path='/' index element={<ProtectedRoute><Home/></ProtectedRoute>}></Route>                           
        <Route path='register' element={<Register/>}></Route>
        <Route path='login' element={<Login/>}></Route>
        <Route path='*' element={<Navigate to={'/'}/>}></Route>
      </Routes>
    </BrowserRouter>       
  )
}

export default App