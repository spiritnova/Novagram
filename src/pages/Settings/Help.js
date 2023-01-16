import styles from './Settings.module.css'
import { useTheme } from '../../ThemeContext'

export default function Help(){
    const darkTheme = useTheme()
    return(
        <div className={styles['profile-wrapper']}>
            <div className={styles.help}>
                <p>Help</p>
                <div className={darkTheme? styles['help-buttons'] : styles['help-buttons-light']}>
                    <button>Help Center</button>
                    <button>Privacy and Security Help</button>
                    <button>Support Requests</button>
                </div>
            </div>
        </div>
    )
}