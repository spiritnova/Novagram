import styles from './Settings.module.css'
import { Link, Outlet } from 'react-router-dom'
import { useTheme } from '../../ThemeContext'

export default function Settings(){

    const darkTheme = useTheme()
    return(
        <div className={darkTheme ? styles.wrapper : styles['wrapper-light']}>
            <div className={darkTheme ? styles.sidebar : styles['sidebar-light']}>
                <ul className={darkTheme ? styles['sidebar-links'] : styles['sidebar-links-light']}>
                    <li><Link to="/settings">Edit profile</Link></li>
                    <li><Link to="/settings/password_change">Change password</Link></li>
                    <li><Link to="/settings/emails/notifications">Email notifications</Link></li>
                    <li><Link to="/settings/privacy_and_security">Privacy and Security</Link></li>
                    <li><Link to="/settings/login_activity">Login Activity</Link></li>
                    <li><Link to="/settings/help">Help</Link></li>
                </ul>
            </div>
            
            <div className={styles.container}>
                <Outlet/>
            </div>
        </div>
    )
}