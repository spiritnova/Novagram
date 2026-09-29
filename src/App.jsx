import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import AuthContext from "./context/auth-context";

import Sidebar from "./components/Sidebar";
import Container from "./components/Container";

import RouteAnnouncer from "./components/RouteAnnouncer";
import ErrorBoundary from "./components/UI Kit/ErrorBoundary";
import PageFallback from "./components/UI Kit/PageFallback";
import Button from "./components/UI Kit/Button";
import MobileNavbar from "./components/MobileNavbar";
import { pages } from "./routes";

import './App.css'

// Each page is its own chunk, downloaded the first time it is visited
const Home = lazy(pages.Home);
const Explore = lazy(pages.Explore);
const PostPage = lazy(pages.PostPage);
const Messages = lazy(pages.Messages);

const Profile = lazy(pages.Profile);
const Posts = lazy(pages.Posts);
const Saved = lazy(pages.Saved);

const Settings = lazy(pages.Settings);
const EditProfile = lazy(pages.EditProfile);
const PasswordChange = lazy(pages.PasswordChange);
const EmailNotifications = lazy(pages.EmailNotifications);
const PrivacySecurity = lazy(pages.PrivacySecurity);
const LoginActivity = lazy(pages.LoginActivity);
const Help = lazy(pages.Help);
const Appearance = lazy(pages.Appearance);

// Login is what a new visitor sees first, so it ships in the main bundle instead of costing another round trip
import Login from "./pages/Login";
const Register = lazy(pages.Register);
const NotFound = lazy(pages.NotFound);

// shown if a page's code fails to download (offline, or a new deploy replaced the old files)
const loadFailed = (
  <div role="alert" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
    <p style={{ marginBottom: '1rem' }}>This page couldn't be loaded. Check your connection and try again.</p>
    <Button variant="primary" onClick={() => window.location.reload()}>Reload</Button>
  </div>
);

// Once logged in and the browser is idle, download the other pages so navigating feels instant
function usePrefetchPages(enabled) {
  useEffect(() => {
    if (!enabled) return;
    const run = () => Object.values(pages).forEach(load => load().catch(() => {}));
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(run, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(run, 2000);
    return () => clearTimeout(id);
  }, [enabled]);
}


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem('isLoggedIn') ? true : false)

  const queryClient = useQueryClient()
  const { pathname } = useLocation()

  usePrefetchPages(isLoggedIn)

  // the login screen doesn't scroll; every other page does
  useEffect(() => {
    document.body.style.overflowY = isLoggedIn ? '' : 'hidden'
  }, [isLoggedIn])

  function loginHandler(){
    sessionStorage.setItem('isLoggedIn', '1')
    setIsLoggedIn(true);
  }

  function logoutHandler()
  {
    sessionStorage.removeItem('isLoggedIn')
    sessionStorage.removeItem('username')
    sessionStorage.removeItem('picture')
    sessionStorage.removeItem('email')
    sessionStorage.removeItem('name')
    sessionStorage.removeItem('bio')
    sessionStorage.removeItem('user_id')
    localStorage.removeItem('user')
    queryClient.clear()
    setIsLoggedIn(false);
  }

  return (
      <ThemeProvider>
        <ToastProvider>
        <AuthContext.Provider value={{isLoggedIn : isLoggedIn}}>
          <a className="skip-link" href="#main">Skip to main content</a>
          <RouteAnnouncer />
          <div className="main-container">
            {isLoggedIn? <Sidebar onLogout={logoutHandler}/> : ''}
            <Container>
              <ErrorBoundary resetKey={pathname} fallback={loadFailed}>
                <Suspense fallback={<PageFallback />}>
                <Routes>
                  <Route path="/" element={isLoggedIn ? <Home/> :<Navigate to ="/login"/>}/>

                  <Route path="explore" element={isLoggedIn ? <Explore /> : <Navigate to = {`/login`}/>}/>

                  <Route path="messages" element={isLoggedIn ? <Messages /> : <Navigate to = {`/login`}/>}/>
                  <Route path="messages/:username" element={isLoggedIn ? <Messages /> : <Navigate to = {`/login`}/>}/>

                  <Route path="post/:id" element={isLoggedIn ? <PostPage /> : <Navigate to = {`/login`}/>}/>

                  <Route path=":username" element={isLoggedIn ? <Profile/>: <Navigate to = { `/login` }/>}>
                    <Route index element={<Posts/>}/>
                    <Route path=":id"/>
                    <Route path="saved" element={<Saved/>}/>
                  </Route>

                  <Route path="settings" element={isLoggedIn ? <Settings /> : <Navigate to = { `/login` }/>}>
                    <Route path="" element={<EditProfile/>} />
                    <Route path="appearance" element={<Appearance />} />
                    <Route path="password_change" element={<PasswordChange />} />
                    <Route path="emails/notifications" element={<EmailNotifications />} />
                    <Route path="privacy_and_security" element={<PrivacySecurity />} />
                    <Route path="login_activity" element={<LoginActivity />} />
                    <Route path="help" element={<Help />} />
                  </Route>
                  <Route path="login" element={!isLoggedIn ? <Login onLogin={loginHandler}/> : <Navigate to = "/"/>}/>
                  <Route path="register" element={!isLoggedIn ? <Register/> : <Navigate to ="/"/>}/>
                  <Route path="404" element={<NotFound/>}/>
                  <Route path="*" element={<Navigate to = "/404"/>} />
                </Routes>
                </Suspense>
              </ErrorBoundary>
            </Container>
            {isLoggedIn && <MobileNavbar logout={logoutHandler}/>}
          </div>
        </AuthContext.Provider>
        </ToastProvider>
      </ThemeProvider>
  );
};

export default App;