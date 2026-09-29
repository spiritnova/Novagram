import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const TITLES = [
    [/^\/$/, 'Home'],
    [/^\/explore/, 'Explore'],
    [/^\/messages/, 'Messages'],
    [/^\/post\//, 'Post'],
    [/^\/settings\/appearance/, 'Appearance settings'],
    [/^\/settings\/password_change/, 'Change password'],
    [/^\/settings\/emails/, 'Email notification settings'],
    [/^\/settings\/privacy_and_security/, 'Privacy and security settings'],
    [/^\/settings\/login_activity/, 'Login activity'],
    [/^\/settings\/help/, 'Help'],
    [/^\/settings/, 'Edit profile'],
    [/^\/login/, 'Log in'],
    [/^\/register/, 'Sign up'],
    [/^\/404/, 'Page not found'],
]

function titleFor(pathname) {
    const known = TITLES.find(([pattern]) => pattern.test(pathname))
    if (known) return known[1]

    const [username, section] = pathname.split('/').filter(Boolean)
    return section === 'saved' ? `Saved by @${username}` : `@${username}`
}

// A single-page app never reloads, so screen readers hear nothing when the page changes.
// Keep the document title current and announce each navigation in a live region.
export default function RouteAnnouncer() {
    const { pathname } = useLocation()
    const [announcement, setAnnouncement] = useState('')

    useEffect(() => {
        const title = titleFor(pathname)
        document.title = `${title} • Novagram`
        setAnnouncement(title)
    }, [pathname])

    return <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</div>
}
