import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Start from "./pages/Start/Start";
import Login from "./pages/Login/Login";
import Chat from "./pages/Chat/Chat";
import Profile from "./pages/Profile/Profile";
import ProfileUpdate from "./pages/ProfileUpdate/ProfileUpdate";
import { ToastContainer, toast } from 'react-toastify';
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";

const App = () => {

  const navigate = useNavigate();
  const {loadUserData} = useContext(AppContext);

  useEffect(() =>{
    onAuthStateChanged(auth, async(user)=>{
      if(user){
        navigate('/chat');
        await loadUserData(user.uid);
      }else{
        navigate('/')
      }
    })
  },[])

  return (
    <>
    <ToastContainer/>
      <Routes>
        <Route path='/' element={<Start/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/chat/*' element={<Chat/>} />
        <Route path='/profileupdate' element={<ProfileUpdate/>} />
        <Route path='/profile' element={<Profile/>} />
      </Routes>
    </>
  )
}

export default App