import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import styles from './Suggestions.module.css'
import { followUser, getSuggestions } from '../mock/api'
import { useToast } from '../context/ToastContext'

// The column beside the feed on wide screens: who you are, people to follow, and a small footer
export default function Suggestions({ username }) {
    const [followed, setFollowed] = useState([])

    const queryClient = useQueryClient()
    const showToast = useToast()

    const name = sessionStorage.getItem('name')
    const picture = sessionStorage.getItem('picture')

    const suggestionsQuery = useQuery({
        queryKey: ['suggestions', username],
        queryFn: () => getSuggestions(username),
    })

    const followMutation = useMutation({
        mutationFn: (target) => followUser(username, target),
        onMutate: (target) => setFollowed(prev => [...prev, target]),
        onError: (_error, target) => {
            setFollowed(prev => prev.filter(u => u !== target))
            showToast('Could not follow. Please try again.')
        },
        onSuccess: (_data, target) => {
            queryClient.invalidateQueries({ queryKey: ['home', username] })
            queryClient.invalidateQueries({ queryKey: ['stories', username] })
            queryClient.invalidateQueries({ queryKey: ['userData', target] })
        },
    })

    return (
        <aside className={styles.rail} aria-label="Suggestions">
            <Link to={`/${username}`} className={styles.me}>
                <span className={`${styles.avatar} ${styles.large}`}>
                    {picture ? <img src={picture} alt="" /> : username.charAt(0).toUpperCase()}
                </span>
                <span className={styles.details}>
                    <b>{username}</b>
                    <span>{name}</span>
                </span>
            </Link>

            {suggestionsQuery.data?.length > 0 && (
                <>
                    <h2>Suggested for you</h2>
                    <ul>
                        {suggestionsQuery.data.map(user => (
                            <li key={user.username}>
                                <Link to={`/${user.username}`} className={styles.avatar} aria-hidden="true" tabIndex={-1}>
                                    {user.picture ? <img src={user.picture} alt="" /> : user.username.charAt(0).toUpperCase()}
                                </Link>
                                <div className={styles.details}>
                                    <Link to={`/${user.username}`}>{user.username}</Link>
                                    <span>
                                        {user.followedBy.length > 0
                                            ? `Followed by ${user.followedBy[0]}${user.followedBy.length > 1 ? ` + ${user.followedBy.length - 1} more` : ''}`
                                            : user.name}
                                    </span>
                                </div>
                                {followed.includes(user.username)
                                    ? <span className={styles.following}>Following</span>
                                    : <button onClick={() => followMutation.mutate(user.username)}>Follow</button>}
                            </li>
                        ))}
                    </ul>
                </>
            )}

            <footer className={styles.footer}>
                <nav aria-label="About">
                    <Link to="/settings/help">Help</Link>
                    <Link to="/settings/privacy_and_security">Privacy</Link>
                    <Link to="/settings/appearance">Appearance</Link>
                </nav>
                <p>© 2026 Novagram · a portfolio project</p>
            </footer>
        </aside>
    )
}
