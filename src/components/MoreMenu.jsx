import { Bookmark, Flag, LogOut, Moon, Settings, Sun } from 'lucide-react'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import styles from './MoreMenu.module.css'
import ReportDialog from './ReportDialog'
import { useTheme, useThemeUpdate } from '../context/ThemeContext'

// The menu behind the sidebar's "More" button (and the hamburger on phones).
// renderTrigger draws the button itself, so each place can style it to match its surroundings.
export default function MoreMenu({ onLogout, renderTrigger, placement = 'above' }) {
    const [open, setOpen] = useState(false)
    const [reporting, setReporting] = useState(false)

    const root = useRef()
    const trigger = useRef()
    const menu = useRef()
    const menuId = useId()

    const darkTheme = useTheme()
    const toggleTheme = useThemeUpdate()

    const username = sessionStorage.getItem('username')
    const name = sessionStorage.getItem('name')
    const picture = sessionStorage.getItem('picture')

    const close = useCallback((returnFocus) => {
        setOpen(false)
        if (returnFocus) trigger.current?.focus()
    }, [])

    // click outside closes; Escape closes and puts focus back on the button
    useEffect(() => {
        if (!open) return

        const outside = (e) => { if (!root.current?.contains(e.target)) setOpen(false) }
        const escape = (e) => { if (e.key === 'Escape') close(true) }
        document.addEventListener('mousedown', outside)
        document.addEventListener('keydown', escape)
        return () => {
            document.removeEventListener('mousedown', outside)
            document.removeEventListener('keydown', escape)
        }
    }, [open, close])

    // arrow keys move through the items
    const menuKeys = (e) => {
        const items = [...menu.current.querySelectorAll('[role^="menuitem"]')]
        const index = items.indexOf(document.activeElement)

        if (e.key === 'ArrowDown') items[(index + 1) % items.length].focus()
        else if (e.key === 'ArrowUp') items[(index - 1 + items.length) % items.length].focus()
        else if (e.key === 'Home') items[0].focus()
        else if (e.key === 'End') items[items.length - 1].focus()
        else if (e.key === 'Tab') setOpen(false)
        else return

        if (e.key !== 'Tab') e.preventDefault()
    }

    const toggle = () => {
        setOpen(prev => {
            if (!prev) requestAnimationFrame(() => menu.current?.querySelector('[role^="menuitem"]')?.focus())
            return !prev
        })
    }

    // pick an item: close the menu with focus back on its button, so a dialog opened from here returns focus to it
    const run = (action) => () => {
        setOpen(false)
        trigger.current?.focus()
        action()
    }

    return (
        <div className={styles.root} ref={root}>
            {renderTrigger({
                ref: trigger,
                onClick: toggle,
                'aria-haspopup': 'menu',
                'aria-expanded': open,
                'aria-controls': open ? menuId : undefined,
            })}

            {open && (
                <div
                    id={menuId}
                    ref={menu}
                    role="menu"
                    aria-label="More options"
                    className={`${styles.menu} ${placement === 'below' ? styles.below : styles.above}`}
                    onKeyDown={menuKeys}
                >
                    <Link to={`/${username}`} role="menuitem" className={styles.account} onClick={run(() => {})}>
                        <span className={styles.avatar}>
                            {picture ? <img src={picture} alt="" /> : username?.charAt(0).toUpperCase()}
                        </span>
                        <span className={styles.who}>
                            <b>{username}</b>
                            <span>{name}</span>
                        </span>
                    </Link>

                    <div className={styles.separator} role="separator" />

                    <Link to="/settings" role="menuitem" className={styles.item} onClick={run(() => {})}>
                        <Settings size={18} aria-hidden="true" /> Settings
                    </Link>
                    <Link to={`/${username}/saved`} role="menuitem" className={styles.item} onClick={run(() => {})}>
                        <Bookmark size={18} aria-hidden="true" /> Saved
                    </Link>
                    <button
                        role="menuitemcheckbox"
                        aria-checked={darkTheme}
                        className={styles.item}
                        onClick={toggleTheme}
                    >
                        {darkTheme ? <Moon size={18} aria-hidden="true" /> : <Sun size={18} aria-hidden="true" />}
                        Dark mode
                        <span className={`${styles.toggle} ${darkTheme ? styles.on : ''}`} aria-hidden="true"><span /></span>
                    </button>
                    <button role="menuitem" className={styles.item} onClick={run(() => setReporting(true))}>
                        <Flag size={18} aria-hidden="true" /> Report a problem
                    </button>

                    <div className={styles.separator} role="separator" />

                    <button role="menuitem" className={`${styles.item} ${styles.danger}`} onClick={run(onLogout)}>
                        <LogOut size={18} aria-hidden="true" /> Log out
                    </button>
                </div>
            )}

            {reporting && <ReportDialog onClose={() => setReporting(false)} />}
        </div>
    )
}
