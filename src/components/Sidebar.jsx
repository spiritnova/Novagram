import { Compass, Heart, House, Menu, Search as SearchIcon, Send, SquarePlus, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import styles from './Sidebar.module.css'
import CreatePost from './CreatePost'
import MoreMenu from './MoreMenu'
import Notifications from './Notifications'
import Search from './Search/Search'
import { getUnreadCounts } from '../mock/api'

const ICON_SIZE = 26

function Badge({ count, label }) {
    if (!count) return null
    return <span className={styles.badge} aria-label={`${count} unread ${label}`}>{count > 9 ? '9+' : count}</span>
}

export default function Sidebar({ onLogout }) {
    const [panel, setPanel] = useState(null) // 'search' | 'notifications' | null
    const [creating, setCreating] = useState(false)

    const nav = useRef()
    const panelRef = useRef()
    const location = useLocation()

    const username = sessionStorage.getItem('username')
    const picture = sessionStorage.getItem('picture')

    // Unread counts drive the badges; polling keeps them current while the mock backend adds activity
    const unreadQuery = useQuery({
        queryKey: ['unread', username],
        queryFn: () => getUnreadCounts(username),
        enabled: !!username,
        refetchInterval: 5000,
    })
    const unread = unreadQuery.data ?? { notifications: 0, messages: 0 }

    // a slide-out panel closes when you go somewhere, click away from it, or press Escape
    useEffect(() => {
        setPanel(null)
    }, [location.pathname, location.search])

    useEffect(() => {
        if (!panel) return

        const outside = (e) => {
            if (panelRef.current?.contains(e.target) || nav.current?.contains(e.target)) return
            setPanel(null)
        }
        const escape = (e) => { if (e.key === 'Escape') closePanelWithFocus() }
        document.addEventListener('mousedown', outside)
        document.addEventListener('keydown', escape)
        return () => {
            document.removeEventListener('mousedown', outside)
            document.removeEventListener('keydown', escape)
        }
    }, [panel])

    // closing from the keyboard hands focus back to the button that opened the panel
    const closePanelWithFocus = () => {
        nav.current?.querySelector('[aria-expanded="true"]')?.focus()
        setPanel(null)
    }

    const togglePanel = (name) => setPanel(prev => (prev === name ? null : name))

    const itemClass = ({ isActive }) => `${styles.item} ${isActive ? styles.active : ''}`

    return (
        <>
            <nav className={styles.nav} ref={nav} aria-label="Main">
                <Link to="/" className={styles.logo} aria-label="Novagram home">
                    <span className={styles.wordmark}>Novagram</span>
                    <span className={styles.glyph} aria-hidden="true">N</span>
                </Link>

                <ul className={styles.list}>
                    <li>
                        <NavLink to="/" end className={itemClass}>
                            {({ isActive }) => (
                                <>
                                    <span className={styles.icon}><House size={ICON_SIZE} strokeWidth={isActive ? 2.5 : 1.75} aria-hidden="true" /></span>
                                    <span className={styles.label}>Home</span>
                                </>
                            )}
                        </NavLink>
                    </li>
                    <li>
                        <button
                            className={`${styles.item} ${panel === 'search' ? styles.active : ''}`}
                            onClick={() => togglePanel('search')}
                            aria-expanded={panel === 'search'}
                        >
                            <span className={styles.icon}><SearchIcon size={ICON_SIZE} strokeWidth={panel === 'search' ? 2.5 : 1.75} aria-hidden="true" /></span>
                            <span className={styles.label}>Search</span>
                        </button>
                    </li>
                    <li>
                        <NavLink to="/explore" className={itemClass}>
                            {({ isActive }) => (
                                <>
                                    <span className={styles.icon}><Compass size={ICON_SIZE} strokeWidth={isActive ? 2.5 : 1.75} aria-hidden="true" /></span>
                                    <span className={styles.label}>Explore</span>
                                </>
                            )}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/messages" className={itemClass}>
                            {({ isActive }) => (
                                <>
                                    <span className={styles.icon}>
                                        <Send size={ICON_SIZE} strokeWidth={isActive ? 2.5 : 1.75} aria-hidden="true" />
                                        <Badge count={unread.messages} label="messages" />
                                    </span>
                                    <span className={styles.label}>Messages</span>
                                </>
                            )}
                        </NavLink>
                    </li>
                    <li>
                        <button
                            className={`${styles.item} ${panel === 'notifications' ? styles.active : ''}`}
                            onClick={() => togglePanel('notifications')}
                            aria-expanded={panel === 'notifications'}
                        >
                            <span className={styles.icon}>
                                <Heart size={ICON_SIZE} strokeWidth={panel === 'notifications' ? 2.5 : 1.75} aria-hidden="true" />
                                <Badge count={unread.notifications} label="notifications" />
                            </span>
                            <span className={styles.label}>Notifications</span>
                        </button>
                    </li>
                    <li>
                        <button className={styles.item} onClick={() => setCreating(true)}>
                            <span className={styles.icon}><SquarePlus size={ICON_SIZE} strokeWidth={1.75} aria-hidden="true" /></span>
                            <span className={styles.label}>Create</span>
                        </button>
                    </li>
                    <li>
                        <NavLink to={`/${username}`} className={itemClass}>
                            {({ isActive }) => (
                                <>
                                    <span className={styles.icon}>
                                        {picture
                                            ? <img src={picture} alt="" className={`${styles.avatar} ${isActive ? styles.avatarActive : ''}`} />
                                            : <User size={ICON_SIZE} strokeWidth={isActive ? 2.5 : 1.75} aria-hidden="true" />}
                                    </span>
                                    <span className={styles.label}>Profile</span>
                                </>
                            )}
                        </NavLink>
                    </li>
                </ul>

                <div className={styles.more}>
                    <MoreMenu
                        onLogout={onLogout}
                        renderTrigger={(triggerProps) => (
                            <button className={styles.item} {...triggerProps}>
                                <span className={styles.icon}><Menu size={ICON_SIZE} strokeWidth={1.75} aria-hidden="true" /></span>
                                <span className={styles.label}>More</span>
                            </button>
                        )}
                    />
                </div>
            </nav>

            {panel === 'notifications' && <Notifications ref={panelRef} onNavigate={() => setPanel(null)} />}
            {panel === 'search' && <Search ref={panelRef} onNavigate={() => setPanel(null)} onClose={closePanelWithFocus} />}
            {creating && <CreatePost onClose={() => setCreating(false)} />}
        </>
    )
}
