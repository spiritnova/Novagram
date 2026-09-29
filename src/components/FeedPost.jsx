import { Bookmark, Heart, Link2, MessageCircle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import styles from './FeedPost.module.css'
import { isoTime, timeAgo } from '../utils/time'
import RichText from './RichText'

const CAPTION_LIMIT = 90
const CLICK_DELAY = 250

export default function FeedPost({ post, darkTheme, onLike, onSave, onComment, onOpen, onShare, first }) {
    const [enteredComment, setEnteredComment] = useState('')
    const [expanded, setExpanded] = useState(false)
    const [burst, setBurst] = useState(false)

    const clickTimer = useRef()
    const burstTimer = useRef()

    useEffect(() => () => {
        clearTimeout(clickTimer.current)
        clearTimeout(burstTimer.current)
    }, [])

    // A single click opens the post; the delay lets a double-click cancel it and like instead
    const imageClickHandler = () => {
        clearTimeout(clickTimer.current)
        clickTimer.current = setTimeout(onOpen, CLICK_DELAY)
    }

    const imageDoubleClickHandler = () => {
        clearTimeout(clickTimer.current)
        if (!post.likedByMe) onLike()

        setBurst(true)
        clearTimeout(burstTimer.current)
        burstTimer.current = setTimeout(() => setBurst(false), 800)
    }

    const submitComment = (e) => {
        e.preventDefault()
        if (!enteredComment.trim()) return
        onComment(enteredComment)
        setEnteredComment('')
    }

    const longCaption = post.caption?.length > CAPTION_LIMIT

    return (
        <article className={`${styles.card} ${darkTheme ? '' : styles.light}`}>
            <header className={styles.info}>
                <Link to={`/${post.user}`} className={styles.pfp} aria-label={`${post.user}'s profile`}>
                    {post.userPicture
                        ? <img src={post.userPicture} alt="" />
                        : post.user.charAt(0).toUpperCase()}
                </Link>
                <Link to={`/${post.user}`} className={styles.username}>{post.user}</Link>
                <span className={styles.dot}>•</span>
                <time className={styles.date} title={post.date} dateTime={isoTime(post.createdAt)}>{timeAgo(post.createdAt)}</time>
            </header>

            <div className={styles.img} onClick={imageClickHandler} onDoubleClick={imageDoubleClickHandler}>
                <img alt={post.caption || `Post by ${post.user}`} src={post.picture} loading={first ? "eager" : "lazy"} fetchPriority={first ? "high" : undefined} draggable="false" />
                {burst && <Heart className={styles.burst} size={96} fill="currentColor" strokeWidth={0} aria-hidden="true" />}
            </div>

            <div className={styles.buttons}>
                <div>
                    <button onClick={onLike} aria-label={post.likedByMe ? 'Unlike' : 'Like'} aria-pressed={post.likedByMe}>
                        <Heart
                            size={26}
                            strokeWidth={1.75}
                            fill={post.likedByMe ? 'currentColor' : 'none'}
                            className={post.likedByMe ? styles.liked : ''}
                            key={post.likedByMe}
                            aria-hidden="true"
                        />
                    </button>
                    <button onClick={onOpen} aria-label="Comments">
                        <MessageCircle size={26} strokeWidth={1.75} aria-hidden="true" />
                    </button>
                    <button onClick={onShare} aria-label="Copy link">
                        <Link2 size={26} strokeWidth={1.75} aria-hidden="true" />
                    </button>
                </div>
                <button onClick={onSave} aria-label={post.savedByMe ? 'Remove from saved' : 'Save'} aria-pressed={post.savedByMe}>
                    <Bookmark size={26} strokeWidth={1.75} fill={post.savedByMe ? 'currentColor' : 'none'} aria-hidden="true" />
                </button>
            </div>

            <div className={styles.footer}>
                <div className={styles.likes}>{post.likesCount} like{post.likesCount === 1 ? '' : 's'}</div>

                {post.caption && (
                    <p className={`${styles.caption} ${expanded ? '' : styles.clamped}`}>
                        <b>{post.user}</b> <RichText text={post.caption} />
                        {longCaption && !expanded && (
                            <button className={styles.more} onClick={() => setExpanded(true)}>more</button>
                        )}
                    </p>
                )}

                {post.commentLength > 0 && (
                    <button className={styles.viewComments} onClick={onOpen}>
                        View all {post.commentLength} comment{post.commentLength === 1 ? '' : 's'}
                    </button>
                )}

                <form className={styles.post} onSubmit={submitComment}>
                    <input
                        type="text"
                        aria-label="Add a comment"
                        placeholder="Add a comment..."
                        value={enteredComment}
                        onChange={(e) => setEnteredComment(e.target.value)}
                    />
                    {enteredComment.trim() && <button type="submit">Post</button>}
                </form>
            </div>
        </article>
    )
}
