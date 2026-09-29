import { Laptop, Smartphone } from 'lucide-react'
import styles from './Settings.module.css'

const SESSIONS = [
    { device: 'Windows PC - Chrome', location: 'New York, United States', status: 'Active now', icon: Laptop, current: true },
    { device: 'iPhone - Novagram app', location: 'New York, United States', status: '2 days ago', icon: Smartphone },
    { device: 'MacBook - Safari', location: 'Boston, United States', status: '1 week ago', icon: Laptop },
]

export default function LoginActivity(){
    return(
        <section className={styles.section}>
            <h2 className={styles.title}>Login activity</h2>
            <p className={styles.lead}>Where you're logged in. If you don't recognise a device, change your password.</p>

            <ul className={`${styles.card} ${styles.sessions}`}>
                {SESSIONS.map(({ device, location, status, icon: Icon, current }) => (
                    <li key={device} className={styles.session}>
                        <span className={styles.sessionIcon}><Icon size={20} aria-hidden="true" /></span>
                        <div className={styles.rowText}>
                            <div className={styles.rowTitle}>
                                {device}
                                {current && <span className={styles.badge}>This device</span>}
                            </div>
                            <p className={styles.rowDesc}>{location} · {status}</p>
                        </div>
                    </li>
                ))}
            </ul>

            <p className={styles.hint}>Sample data for the demo.</p>
        </section>
    )
}
