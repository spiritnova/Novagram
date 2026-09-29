// Loaders for every page. App.jsx wraps them in React.lazy so each becomes its own chunk,
// and calls them again when the browser is idle to prefetch the ones not yet visited.
export const pages = {
    Home: () => import('./pages/Home'),
    Explore: () => import('./pages/Explore'),
    PostPage: () => import('./pages/PostPage'),
    Messages: () => import('./pages/Messages/Messages'),

    Profile: () => import('./pages/Profile/Profile'),
    Posts: () => import('./pages/Profile/Posts'),
    Saved: () => import('./pages/Profile/Saved'),

    Settings: () => import('./pages/Settings/Settings'),
    EditProfile: () => import('./pages/Settings/EditProfile'),
    PasswordChange: () => import('./pages/Settings/PasswordChange'),
    EmailNotifications: () => import('./pages/Settings/EmailNotifications'),
    PrivacySecurity: () => import('./pages/Settings/PrivacySecurity'),
    LoginActivity: () => import('./pages/Settings/LoginActivity'),
    Help: () => import('./pages/Settings/Help'),
    Appearance: () => import('./pages/Settings/Appearance'),

    Register: () => import('./pages/Register'),
    NotFound: () => import('./components/NotFound'),
}
