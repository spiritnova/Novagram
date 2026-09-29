import { Bell, CircleHelp, History, Lock, Palette, ShieldCheck, User } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import styles from './Settings.module.css'

const SECTIONS = [
    { to: '/settings', label: 'Edit profile', icon: User, end: true },
    { to: '/settings/appearance', label: 'Appearance', icon: Palette },
    { to: '/settings/password_change', label: 'Password', icon: Lock },
    { to: '/settings/emails/notifications', label: 'Notifications', icon: Bell },
    { to: '/settings/privacy_and_security', label: 'Privacy', icon: ShieldCheck },
    { to: '/settings/login_activity', label: 'Login activity', icon: History },
    { to: '/settings/help', label: 'Help', icon: CircleHelp },
]

export default function Settings(){
    return(
        <div className={styles.page}>
            <nav className={styles.menu} aria-label="Settings sections">
                <h1 className={styles.menuTitle}>Settings</h1>
                <ul className={styles.menuList}>
                    {SECTIONS.map(({ to, label, icon: Icon, end }) => (
                        <li key={to}>
                            <NavLink
                                to={to}
                                end={end}
                                className={({ isActive }) => `${styles.menuLink} ${isActive ? styles.menuActive : ''}`}
                            >
                                <Icon size={18} strokeWidth={2} aria-hidden="true" />
                                <span>{label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className={styles.panel}>
                <Outlet/>
            </div>
        </div>
    )
}
