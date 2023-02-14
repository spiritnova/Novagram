import { Route, Routes, Navigate} from "react-router-dom";
import { useState } from 'react'
// import { useCookie } from './hooks/useCookie'
// import uuid from 'react-uuid'

import { ThemeProvider } from "./context/ThemeContext";
import AuthContext from "./context/auth-context";

import Sidebar from "./components/Sidebar";
import Container from "./components/Container";

import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Messages from "./pages/Messages";

import Profile from "./pages/Profile/Profile";
import Posts from "./pages/Profile/Posts";
import Saved from "./pages/Profile/Saved";

import Settings from "./pages/Settings/Settings";
import EditProfile from "./pages/Settings/EditProfile";
import PasswordChange from './pages/Settings/PasswordChange'
import EmailNotifications from "./pages/Settings/EmailNotifications";
import PrivacySecurity from "./pages/Settings/PrivacySecurity";
import LoginActivity from "./pages/Settings/LoginActivity";
import Help from "./pages/Settings/Help"

import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./components/NotFound";

import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Post from "./pages/Profile/Post";


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem('isLoggedIn') ? true : false)

  if(!isLoggedIn){
    document.body.style.overflowY = 'hidden'
  }
  
  function loginHandler(){
    sessionStorage.setItem('isLoggedIn', '1')
    setIsLoggedIn(true);
  }

  function logoutHandler()
  {
    sessionStorage.removeItem('isLoggedIn')
    localStorage.removeItem('user')
    setIsLoggedIn(false);
  }  

  return (
      <ThemeProvider>
        <AuthContext.Provider value={{isLoggedIn : isLoggedIn}}>
          {isLoggedIn? <Sidebar onLogout={logoutHandler}/> : ''}
          <Container>
              <Routes>
                <Route path="/" element={isLoggedIn ? <Home/> :<Navigate to ="/login"/>} />
                <Route path="explore" element={isLoggedIn ? <Explore /> : <Navigate to ="/login"/>} >
                  <Route path=":id" element={<Post/>}/>
                </Route>
                <Route path="messages" element={isLoggedIn ? <Messages /> : <Navigate to ="/login"/>} />
                <Route path="profile" element={isLoggedIn ? <Profile/> : <Navigate to ="/"/>}>
                  <Route path=":username" element={<Posts />} >
                    <Route path=":id" element={<Posts/>} />
                  </Route>
                  <Route path=":username/saved" element={<Saved />} />
                </Route>
                <Route path="settings" element={isLoggedIn ? <Settings /> : <Navigate to ="/login"/>}>
                  <Route path="" element={<EditProfile/>} />
                  <Route path="password_change" element={<PasswordChange />} />
                  <Route path="emails/notifications" element={<EmailNotifications />} />
                  <Route path="privacy_and_security" element={<PrivacySecurity />} />
                  <Route path="login_activity" element={<LoginActivity />} />
                  <Route path="help" element={<Help />} />
                </Route>
                <Route path="login" element={!isLoggedIn ? <Login onLogin={loginHandler}/> : <Navigate to ="/"/>}/>
                <Route path="register" element={!isLoggedIn ? <Register/> : <Navigate to ="/"/>}/>
                <Route path="*" element={<NotFound/>} />
              </Routes>
          </Container>
        </AuthContext.Provider>
      </ThemeProvider>
  );
};

export default App;