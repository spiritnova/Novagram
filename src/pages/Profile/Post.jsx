import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import styles from './Post.module.css'
import { Bookmark, Ellipsis, Heart, Link2, MessageCircle, X } from 'lucide-react'
import Button from '../../components/UI Kit/Button'
import RichText from '../../components/RichText'
import useDialog from '../../hooks/useDialog'

import { addComment, deleteComment, deletePost, getPost, toggleLikeComment, toggleLikePost, toggleSavePost } from '../../mock/api'
import { useToast } from '../../context/ToastContext'
import { isoTime, timeAgo } from '../../utils/time'

function Avatar({ picture, username, className }) {
    return (
        <span className={`${styles.avatar} ${className ?? ''}`}>
            {picture ? <img alt="" src={picture} /> : username.charAt(0).toUpperCase()}
        </span>
    )
}

// The "Delete post?" prompt is its own dialog on top of the post, so it traps focus and closes with Escape first
function ConfirmDelete({ pending, onConfirm, onCancel }) {
    const overlay = useRef()
    useDialog(overlay, { onClose: onCancel })

    return (
        <div className={styles.confirmOverlay} ref={overlay} onClick={(e) => { e.stopPropagation(); onCancel() }}>
            <div className={styles.message} role="alertdialog" aria-modal="true" aria-labelledby="delete-post-title" onClick={(e) => e.stopPropagation()}>
                <h2 id="delete-post-title">Delete post?</h2>
                <p>This can't be undone.</p>
                <div className={styles.messageActions}>
                    <Button variant="danger" onClick={onConfirm} disabled={pending}>
                        {pending ? 'Deleting...' : 'Delete'}
                    </Button>
                    <Button onClick={onCancel} data-autofocus>Cancel</Button>
                </div>
            </div>
        </div>
    )
}

export default function Post(props){
    const [showDelete, setShowDelete] = useState(false)
    const [replyTo, setReplyTo] = useState(null)
    const [draft, setDraft] = useState('')

    const queryClient = useQueryClient()
    const showToast = useToast()

    const input = useRef()

    // While the modal is open the address bar shows /post/:id, so the link can be copied and shared.
    // Back closes the modal, and closing puts the page's own URL back.
    const onCloseRef = useRef(props.onClose)
    onCloseRef.current = props.onClose

    useEffect(() => {
        if(!props.showModal || !props.pseudoRoute) return

        const realRoute = props.realRoute
        window.history.pushState({}, "modal-route", props.pseudoRoute)
        const popHandler = () => onCloseRef.current?.()
        window.addEventListener('popstate', popHandler)

        return () => {
            window.removeEventListener('popstate', popHandler)
            // only restore the URL if it is still the post's; a link inside the modal may have navigated away
            if(realRoute && window.location.pathname === props.pseudoRoute){
                window.history.replaceState(window.history.state, "", realRoute)
            }
        }
    }, [props.showModal, props.pseudoRoute, props.realRoute])

    const overlay = useRef()

    const username = sessionStorage.getItem('username')

    const id = props.pseudoRoute.slice(6)

    const postQuery = useQuery({
        queryKey: ["posts", id],
        queryFn: () => getPost(id, username),
        retry: (count, error) => error.message !== "Post not found" && count < 2,
    })

    // traps focus, locks page scroll and closes on Escape once there is something to show
    useDialog(overlay, { onClose: props.onClose, enabled: !postQuery.isPending })

    const refresh = () => {
        queryClient.invalidateQueries({ queryKey: ["posts", id], exact: true })
        queryClient.invalidateQueries({ queryKey: ["home", username] })
    }

    const newCommentMutation = useMutation({
        mutationFn: addComment,
        onSuccess: () => {
            refresh()
            setDraft('')
            setReplyTo(null)
        },
        onError: () => showToast('Could not post your comment.'),
    })

    const deleteCommentMutation = useMutation({
        mutationFn: (commentId) => deleteComment(id, commentId, username),
        onSuccess: refresh,
    })

    const likeMutation = useMutation({
        mutationFn: () => toggleLikePost(id, username),
        onSuccess: refresh,
    })

    const saveMutation = useMutation({
        mutationFn: () => toggleSavePost(id, username),
        onSuccess: () => {
            refresh()
            queryClient.invalidateQueries({ queryKey: ["saved", username] })
        },
    })

    const commentLikeMutation = useMutation({
        mutationFn: (commentId) => toggleLikeComment(id, commentId, username),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts", id], exact: true }),
    })

    const deletePostMutation = useMutation({
        mutationFn: () => deletePost(id, username),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] })
            queryClient.invalidateQueries({ queryKey: ["home"] })
            queryClient.invalidateQueries({ queryKey: ["explore-posts"] })
            queryClient.invalidateQueries({ queryKey: ["notifications"] })
            setShowDelete(false)
            props.onClose?.()
        },
    })

    const submitComment = () => {
        if(!draft.trim() || newCommentMutation.isPending) return
        newCommentMutation.mutate({ comment: draft, username, id, parentId: replyTo?.id })
    }

    const startReply = (target) => {
        setReplyTo({ id: target.id, username: target.username })
        setDraft(`@${target.username} `)
        input.current?.focus()
    }

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(`${window.location.origin}/post/${id}`)
            showToast('Link copied to clipboard')
        } catch {
            showToast('Could not copy the link')
        }
    }

    if(postQuery.isPending) return (
        <div className={styles.overlay} ref={overlay} role="status" aria-label="Loading post">
            <div className={styles.spinner}></div>
        </div>
    )

    if(postQuery.isError) return (
        <div className={styles.overlay} ref={overlay} onClick={props.onClose}>
            <div className={styles.message} role="alertdialog" aria-modal="true" aria-label="Post unavailable" onClick={(e) => e.stopPropagation()}>
                <p>{postQuery.error.message === "Post not found" ? "This post doesn't exist or was deleted." : "Couldn't load this post."}</p>
                <div className={styles.messageActions}>
                    {postQuery.error.message !== "Post not found" && <Button variant="primary" onClick={() => postQuery.refetch()}>Try again</Button>}
                    <Button onClick={props.onClose}>Close</Button>
                </div>
            </div>
        </div>
    )

    const post = postQuery.data
    const liked = post.likes.includes(username)
    const isPostOwner = username === post.username
    const topLevel = post.comments.filter(c => !c.parentId)
    const repliesOf = (parentId) => post.comments.filter(c => c.parentId === parentId)

    const renderComment = (c, isReply) => (
        <li key={c.id} className={styles.comment}>
            <Avatar picture={c.picture} username={c.username} />
            <div className={styles.commentBody}>
                <p className={styles.commentText}>
                    <Link to={`/${c.username}`} className={styles.author}>{c.username}</Link>{' '}
                    <RichText text={c.content} />
                </p>
                <div className={styles.meta}>
                    <span>{c.date}</span>
                    {c.likes.length > 0 && <span>{c.likes.length} like{c.likes.length === 1 ? '' : 's'}</span>}
                    <button onClick={() => startReply(c)}>Reply</button>
                    {(c.username === username || isPostOwner) &&
                        <button onClick={() => deleteCommentMutation.mutate(c.id)} disabled={deleteCommentMutation.isPending}>Delete</button>}
                </div>
                {!isReply && repliesOf(c.id).length > 0 &&
                    <ul className={styles.replies}>{repliesOf(c.id).map(reply => renderComment(reply, true))}</ul>}
            </div>
            <button
                className={`${styles.commentLike} ${c.likes.includes(username) ? styles.liked : ''}`}
                onClick={() => commentLikeMutation.mutate(c.id)}
                aria-label={c.likes.includes(username) ? 'Unlike comment' : 'Like comment'}
                aria-pressed={c.likes.includes(username)}
            >
                <Heart size={14} fill={c.likes.includes(username) ? 'currentColor' : 'none'} aria-hidden="true" />
            </button>
        </li>
    )

    return(
        <div className={styles.overlay} ref={overlay} onClick={props.onClose}>
            <button className={styles.close} onClick={props.onClose} aria-label="Close post">
                <X size={20} aria-hidden="true" />
            </button>

            <div className={styles.dialog} role="dialog" aria-modal="true" aria-label={`Post by ${post.username}`} onClick={(e) => e.stopPropagation()}>
                <div className={styles.media}>
                    <img src={post.image} alt={post.caption || `Post by ${post.username}`} />
                </div>

                <div className={styles.panel}>
                    <header className={styles.header}>
                        <Link to={`/${post.username}`} className={styles.owner}>
                            <Avatar picture={post.picture} username={post.username} />
                            <span className={styles.author}>{post.username}</span>
                        </Link>
                        {isPostOwner &&
                            <button className={styles.iconButton} onClick={() => setShowDelete(true)} aria-label="Post options">
                                <Ellipsis size={22} aria-hidden="true" />
                            </button>}
                        <button className={`${styles.iconButton} ${styles.headerClose}`} onClick={props.onClose} aria-label="Close post">
                            <X size={20} aria-hidden="true" />
                        </button>
                    </header>

                    <ul className={styles.comments}>
                        {post.caption && (
                            <li className={styles.comment}>
                                <Avatar picture={post.picture} username={post.username} />
                                <div className={styles.commentBody}>
                                    <p className={styles.commentText}>
                                        <Link to={`/${post.username}`} className={styles.author}>{post.username}</Link>{' '}
                                        <RichText text={post.caption} />
                                    </p>
                                    <div className={styles.meta}><span>{timeAgo(post.createdAt)}</span></div>
                                </div>
                            </li>
                        )}
                        {topLevel.map(c => renderComment(c, false))}
                        {topLevel.length === 0 && !post.caption && <li className={styles.empty}>No comments yet.</li>}
                    </ul>

                    <div className={styles.actions}>
                        <div className={styles.actionRow}>
                            <button
                                className={`${styles.iconButton} ${liked ? styles.liked : ''}`}
                                onClick={() => likeMutation.mutate()}
                                aria-label={liked ? 'Unlike' : 'Like'}
                                aria-pressed={liked}
                            >
                                <Heart size={26} strokeWidth={1.75} fill={liked ? 'currentColor' : 'none'} aria-hidden="true" />
                            </button>
                            <button className={styles.iconButton} onClick={() => input.current?.focus()} aria-label="Comment">
                                <MessageCircle size={26} strokeWidth={1.75} aria-hidden="true" />
                            </button>
                            <button className={styles.iconButton} onClick={copyLink} aria-label="Copy link">
                                <Link2 size={26} strokeWidth={1.75} aria-hidden="true" />
                            </button>
                            <button
                                className={`${styles.iconButton} ${styles.push}`}
                                onClick={() => saveMutation.mutate()}
                                aria-label={post.savedByMe ? 'Remove from saved' : 'Save'}
                                aria-pressed={post.savedByMe}
                            >
                                <Bookmark size={26} strokeWidth={1.75} fill={post.savedByMe ? 'currentColor' : 'none'} aria-hidden="true" />
                            </button>
                        </div>
                        <div className={styles.likes}>{post.likes.length} like{post.likes.length === 1 ? '' : 's'}</div>
                        <time className={styles.time} dateTime={isoTime(post.createdAt)}>{timeAgo(post.createdAt)}</time>
                    </div>

                    {replyTo && (
                        <div className={styles.replying}>
                            <span>Replying to <b>@{replyTo.username}</b></span>
                            <button onClick={() => { setReplyTo(null); setDraft('') }} aria-label="Cancel reply">
                                <X size={20} aria-hidden="true" />
                            </button>
                        </div>
                    )}

                    <form className={styles.composer} onSubmit={(e) => { e.preventDefault(); submitComment() }}>
                        <textarea
                            ref={input}
                            rows={1}
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            placeholder="Add a comment..."
                            aria-label="Add a comment"
                            onKeyDown={(e) => {
                                if(e.key === 'Enter' && !e.shiftKey){
                                    e.preventDefault()
                                    submitComment()
                                }
                            }}
                        />
                        <button type="submit" disabled={!draft.trim() || newCommentMutation.isPending}>Post</button>
                    </form>
                </div>
            </div>

            {showDelete && (
                <ConfirmDelete
                    pending={deletePostMutation.isPending}
                    onConfirm={() => deletePostMutation.mutate()}
                    onCancel={() => setShowDelete(false)}
                />
            )}
        </div>
    )
}
