import { forwardRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { Skeleton } from './UI Kit/Skeleton';
import { timeAgo } from '../utils/time';
import { followUser, getNotifications, markNotificationsRead } from '../mock/api';
import styles from './Notifications.module.css'

const MESSAGES = {
    like: 'liked your post.',
    follow: 'started following you.',
    comment: 'commented:',
    reply: 'replied to your comment:',
}

const Notifications = forwardRef(({ onNavigate }, ref) => {
    const darkTheme = useTheme()
    const showToast = useToast()
    const queryClient = useQueryClient()

    const username = sessionStorage.getItem('username')

    const notificationsQuery = useQuery({
        queryKey: ['notifications', username],
        queryFn: () => getNotifications(username),
    })

    // Marked as read a moment after opening, so what was new is still shown as new
    useEffect(() => {
        const timer = setTimeout(async () => {
            await markNotificationsRead(username)
            queryClient.invalidateQueries({ queryKey: ['unread', username] })
        }, 1500)
        return () => clearTimeout(timer)
    }, [username, queryClient])

    const followBackMutation = useMutation({
        mutationFn: (target) => followUser(username, target),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications', username] })
            queryClient.invalidateQueries({ queryKey: ['home', username] })
            queryClient.invalidateQueries({ queryKey: ['stories', username] })
            queryClient.invalidateQueries({ queryKey: ['suggestions', username] })
        },
        onError: () => showToast('Could not follow. Please try again.'),
    })

    const notifications = notificationsQuery.data ?? []
    const fresh = notifications.filter(n => !n.read)
    const earlier = notifications.filter(n => n.read)

    const renderGroup = (title, items) => items.length > 0 && (
        <section>
            <h4>{title}</h4>
            <ul className={styles.notifs}>
                {items.map(n => (
                    <li key={n.id} className={`${styles.notif} ${n.read ? '' : styles.unread}`}>
                        <Link to={`/${n.actor.username}`} className={styles.picture} onClick={onNavigate} tabIndex={-1} aria-hidden="true">
                            {n.actor.picture ? <img src={n.actor.picture} alt="" /> : n.actor.username.charAt(0).toUpperCase()}
                        </Link>

                        <p className={styles.message}>
                            <Link to={`/${n.actor.username}`} onClick={onNavigate}><b>{n.actor.username}</b></Link>{' '}
                            {MESSAGES[n.type]}
                            {n.text && <span className={styles.quote}> {n.text}</span>}
                            <span className={styles.date}> {timeAgo(n.createdAt)}</span>
                        </p>

                        {n.type === 'follow'
                            ? (n.isFollowing
                                ? <span className={styles.following}>Following</span>
                                : <button className={styles.followBack} onClick={() => followBackMutation.mutate(n.actor.username)} disabled={followBackMutation.isPending}>Follow back</button>)
                            : n.post && (
                                <Link to={`/post/${n.post.id}`} onClick={onNavigate} className={styles.thumb} aria-label="Open post">
                                    <img src={n.post.image} alt="" />
                                </Link>
                            )}
                    </li>
                ))}
            </ul>
        </section>
    )

    return(
        <div className={`${styles.container} ${darkTheme ? '' : styles.light}`} ref={ref} role="dialog" aria-label="Notifications">
            <h3>Notifications</h3>

            {notificationsQuery.isPending && (
                <div className={styles.loading} role="status" aria-label="Loading notifications">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className={styles.notif}>
                            <Skeleton className={styles.picture} />
                            <Skeleton style={{ flex: 1, height: '0.9rem' }} />
                        </div>
                    ))}
                </div>
            )}

            {notificationsQuery.isError && (
                <div className={styles.empty}>
                    <p>Couldn't load notifications.</p>
                    <button onClick={() => notificationsQuery.refetch()}>Try again</button>
                </div>
            )}

            {notificationsQuery.isSuccess && notifications.length === 0 && (
                <div className={styles.empty}>
                    <p>Activity on your posts will show up here.</p>
                </div>
            )}

            {renderGroup('New', fresh)}
            {renderGroup('Earlier', earlier)}
        </div>
    )
})

export default Notifications;
