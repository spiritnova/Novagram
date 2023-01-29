import { Route, Routes, Navigate} from "react-router-dom";
import { useEffect, useState } from 'react'
// import { useCookie } from './hooks/useCookie'
// import uuid from 'react-uuid'

import { ThemeProvider } from "./ThemeContext";
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

import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn'))

  function loginHandler(){
    setIsLoggedIn(false)
    sessionStorage.removeItem('isLoggedIn')

    sessionStorage.setItem('isLoggedIn', '1')
    setIsLoggedIn(true);
  }

  function logoutHandler()
  {
    sessionStorage.removeItem('isLoggedIn')
    localStorage.removeItem('user')
    setIsLoggedIn(false);
  }

  useEffect(() => {
    const log = sessionStorage.getItem('isLoggedIn')

    if (log !== '1'){
      setIsLoggedIn(false)
    }
    else{
      setIsLoggedIn(true)
    }
  }, [])
  

  return (
      <ThemeProvider>
        <AuthContext.Provider value={{isLoggedIn : isLoggedIn}}>
          <Sidebar onLogout={logoutHandler}/>
          <Container>
              <Routes>
                <Route path="/" element={isLoggedIn ? <Home/> : <Navigate to = "/login"/>} />
                <Route path="explore" element={isLoggedIn ? <Explore /> : <Navigate to ="/login"/>} />
                <Route path="messages" element={isLoggedIn ? <Messages /> : <Navigate to ="/login"/>} />
                <Route path="profile/:username" element={isLoggedIn ? <Profile /> : <Navigate to ="/login"/>} >
                  <Route path="" element={isLoggedIn ? <Posts /> : <Navigate to ="/login"/>} >
                    <Route path=":id" element={isLoggedIn ? <Posts/> : <Navigate to ="/login"/>}/>
                  </Route>
                  <Route path="saved" element={isLoggedIn ? <Saved /> : <Navigate to ="/login"/>} />
                </Route>
                <Route path="settings" element={isLoggedIn ? <Settings /> : <Navigate to ="/login"/>}>
                  <Route path="" element={isLoggedIn ? <EditProfile/> : <Navigate to ="/login"/>} />
                  <Route path="password_change" element={isLoggedIn ? <PasswordChange /> : <Navigate to ="/login"/>} />
                  <Route path="emails/notifications" element={isLoggedIn ? <EmailNotifications /> : <Navigate to ="/login"/>} />
                  <Route path="privacy_and_security" element={isLoggedIn ? <PrivacySecurity /> : <Navigate to ="/login"/>} />
                  <Route path="login_activity" element={isLoggedIn ? <LoginActivity /> : <Navigate to ="/login"/>} />
                  <Route path="help" element={isLoggedIn ? <Help /> : <Navigate to ="/login"/>} />
                </Route>
                <Route path="login" element={isLoggedIn ? <Home/> : <Login onLogin={loginHandler}/>}/>
                <Route path="register" element={!isLoggedIn ? <Register/> : <Navigate to ="/"/>}/>
              </Routes>
          </Container>
        </AuthContext.Provider>
      </ThemeProvider>
  );
};

export default App;