import { Menu } from 'lucide-react'
import { Link } from 'react-router-dom'
import styles from './MobileNavbar.module.css'
import MoreMenu from './MoreMenu'

// The top bar on phones: the logo and the same menu that the sidebar's "More" button opens
export default function MobileNavbar({ logout }){
    return(
        <header className={styles.nav}>
            <Link to="/" className={styles.logo}>Novagram</Link>
            <MoreMenu
                onLogout={logout}
                placement="below"
                renderTrigger={(triggerProps) => (
                    <button className={styles.button} aria-label="Menu" {...triggerProps}>
                        <Menu size={24} strokeWidth={1.75} aria-hidden="true" />
                    </button>
                )}
            />
        </header>
    )
}
