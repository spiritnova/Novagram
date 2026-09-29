import { Send as SendIcon, ChevronLeft as ChevronLeftIcon } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useParams } from 'react-router-dom'

import styles from './Messages.module.css'
import { Skeleton } from '../../components/UI Kit/Skeleton'
import { useTheme } from '../../context/ThemeContext'
import { useToast } from '../../context/ToastContext'
import { getChatContacts, getConversations, getMessages, sendMessage } from '../../mock/api'
import { timeAgo } from '../../utils/time'

const GAP_FOR_TIMESTAMP = 30 * 60 * 1000

function formatTime(timestamp) {
    const date = new Date(timestamp)
    const time = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    return date.toDateString() === new Date().toDateString()
        ? time
        : `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${time}`
}

function Avatar({ user, className }) {
    return (
        <span className={className}>
            {user.picture ? <img src={user.picture} alt="" /> : user.username.charAt(0).toUpperCase()}
        </span>
    )
}

export default function Messages() {
    const { username: other } = useParams()
    const me = sessionStorage.getItem('username')
    const darkTheme = useTheme()

    const conversationsQuery = useQuery({
        queryKey: ['conversations', me],
        queryFn: () => getConversations(me),
        refetchInterval: 4000,
    })

    const contactsQuery = useQuery({
        queryKey: ['chat-contacts', me],
        queryFn: () => getChatContacts(me),
    })

    const conversations = conversationsQuery.data ?? []
    const talkedTo = new Set(conversations.map(c => c.user.username))
    const newContacts = (contactsQuery.data ?? []).filter(u => !talkedTo.has(u.username))

    return (
        <div className={`${styles.layout} ${darkTheme ? '' : styles.light} ${other ? styles.chatOpen : ''}`}>
            <aside className={styles.list} aria-label="Conversations">
                <h1>Messages</h1>

                {conversationsQuery.isPending && Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className={styles.row}>
                        <Skeleton className={styles.avatar} />
                        <Skeleton style={{ flex: 1, height: '1rem' }} />
                    </div>
                ))}

                {conversationsQuery.isError && (
                    <div className={styles.note}>
                        <p>Couldn't load your conversations.</p>
                        <button onClick={() => conversationsQuery.refetch()}>Try again</button>
                    </div>
                )}

                {conversations.map(({ user, last, unread }) => (
                    <NavLink
                        key={user.username}
                        to={`/messages/${user.username}`}
                        className={({ isActive }) => `${styles.row} ${isActive ? styles.active : ''}`}
                    >
                        <Avatar user={user} className={styles.avatar} />
                        <span className={styles.preview}>
                            <span className={`${styles.name} ${unread ? styles.unreadText : ''}`}>{user.username}</span>
                            <span className={`${styles.snippet} ${unread ? styles.unreadText : ''}`}>
                                {last.fromMe ? 'You: ' : ''}{last.text} · {timeAgo(last.createdAt)}
                            </span>
                        </span>
                        {unread > 0 && <span className={styles.dot} aria-label={`${unread} unread`} />}
                    </NavLink>
                ))}

                {conversationsQuery.isSuccess && conversations.length === 0 && (
                    <p className={styles.note}>No conversations yet.</p>
                )}

                {newContacts.length > 0 && (
                    <>
                        <h2>Start a conversation</h2>
                        {newContacts.map(user => (
                            <NavLink
                                key={user.username}
                                to={`/messages/${user.username}`}
                                className={({ isActive }) => `${styles.row} ${isActive ? styles.active : ''}`}
                            >
                                <Avatar user={user} className={styles.avatar} />
                                <span className={styles.preview}>
                                    <span className={styles.name}>{user.username}</span>
                                    <span className={styles.snippet}>{user.name}</span>
                                </span>
                            </NavLink>
                        ))}
                    </>
                )}
            </aside>

            <section className={styles.chat}>
                {other
                    ? <Chat key={other} me={me} other={other} />
                    : (
                        <div className={styles.placeholder}>
                            <SendIcon size="1em" aria-hidden="true" />
                            <h2>Your messages</h2>
                            <p>Pick a conversation to start chatting.</p>
                        </div>
                    )}
            </section>
        </div>
    )
}

function Chat({ me, other }) {
    const [text, setText] = useState('')
    const [typing, setTyping] = useState(false)
    const bottom = useRef()

    const queryClient = useQueryClient()
    const showToast = useToast()
    const key = ['messages', me, other]

    const messagesQuery = useQuery({
        queryKey: key,
        queryFn: async () => {
            const result = await getMessages(me, other)
            // Opening a chat marks it read, so the badges need to catch up
            queryClient.invalidateQueries({ queryKey: ['unread', me] })
            queryClient.invalidateQueries({ queryKey: ['conversations', me] })
            return result
        },
        refetchInterval: 1500,
        retry: false,
    })

    const sendMutation = useMutation({
        mutationFn: (message) => sendMessage({ from: me, to: other, text: message }),
        onMutate: async (message) => {
            await queryClient.cancelQueries({ queryKey: key })
            const previous = queryClient.getQueryData(key)
            queryClient.setQueryData(key, (data) => data && ({
                ...data,
                messages: [...data.messages, { id: `pending-${Date.now()}`, text: message, fromMe: true, createdAt: Date.now(), pending: true }],
            }))
            return { previous }
        },
        onSuccess: () => { if (messagesQuery.data?.canReply) setTyping(true) },
        onError: (_error, message, context) => {
            queryClient.setQueryData(key, context.previous)
            setText(message)
            showToast('Message not sent. Please try again.')
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: key })
            queryClient.invalidateQueries({ queryKey: ['conversations', me] })
        },
    })

    const messages = messagesQuery.data?.messages ?? []
    const last = messages[messages.length - 1]

    // The typing indicator lasts until their reply arrives (or a few seconds pass)
    useEffect(() => {
        if (last && !last.fromMe) setTyping(false)
    }, [last])

    useEffect(() => {
        if (!typing) return
        const timer = setTimeout(() => setTyping(false), 6000)
        return () => clearTimeout(timer)
    }, [typing])

    useEffect(() => {
        bottom.current?.scrollIntoView({ block: 'end' })
    }, [messages.length, typing])

    const submit = (e) => {
        e.preventDefault()
        const message = text.trim()
        if (!message) return
        setText('')
        sendMutation.mutate(message)
    }

    if (messagesQuery.isPending) {
        return (
            <div className={styles.thread}>
                <div className={styles.header}><Skeleton style={{ width: '10rem', height: '1.5rem' }} /></div>
            </div>
        )
    }

    if (messagesQuery.isError) {
        return (
            <div className={styles.placeholder}>
                <h2>{messagesQuery.error.message === 'User not found' ? "This user doesn't exist" : "Couldn't load this chat"}</h2>
                <Link to="/messages" className={styles.linkButton}>Back to messages</Link>
            </div>
        )
    }

    const { user } = messagesQuery.data

    return (
        <div className={styles.thread}>
            <header className={styles.header}>
                <Link to="/messages" className={styles.back} aria-label="Back to conversations">
                    <ChevronLeftIcon size="1em" aria-hidden="true" />
                </Link>
                <Link to={`/${user.username}`} className={styles.headerUser}>
                    <Avatar user={user} className={styles.avatarSmall} />
                    <span>{user.username}</span>
                </Link>
            </header>

            <div className={styles.messages}>
                {messages.length === 0 && <p className={styles.note}>Say hi to {user.username}.</p>}

                {messages.map((m, i) => (
                    <div key={m.id} className={styles.group}>
                        {(i === 0 || m.createdAt - messages[i - 1].createdAt > GAP_FOR_TIMESTAMP) &&
                            <div className={styles.time}>{formatTime(m.createdAt)}</div>}
                        <div className={`${styles.bubble} ${m.fromMe ? styles.mine : styles.theirs} ${m.pending ? styles.pending : ''}`}>
                            {m.text}
                        </div>
                    </div>
                ))}

                {typing && (
                    <div className={`${styles.bubble} ${styles.theirs} ${styles.typing}`} role="status" aria-label={`${user.username} is typing`}>
                        <span /><span /><span />
                    </div>
                )}
                <div ref={bottom} />
            </div>

            <form className={styles.composer} onSubmit={submit}>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Message..."
                    aria-label="Message"
                    maxLength={500}
                />
                <button type="submit" disabled={!text.trim()} aria-label="Send">
                    <SendIcon size="1em" aria-hidden="true" />
                </button>
            </form>
        </div>
    )
}
