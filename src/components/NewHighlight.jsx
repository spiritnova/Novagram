import { X as XIcon, Check as CheckIcon } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import styles from './NewHighlight.module.css'
import Button from './UI Kit/Button'
import { GridSkeleton } from './UI Kit/Skeleton'
import { useToast } from '../context/ToastContext'
import useDialog from '../hooks/useDialog'
import { createHighlight, getUserPosts } from '../mock/api'

// Pick some of your posts and give them a title to save them as a highlight
export default function NewHighlight({ username, onClose }) {
    const [title, setTitle] = useState('')
    const [selected, setSelected] = useState([])

    const queryClient = useQueryClient()
    const showToast = useToast()

    const postsQuery = useQuery({
        queryKey: ['posts', username],
        queryFn: () => getUserPosts(username),
    })

    const createMutation = useMutation({
        mutationFn: () => createHighlight({ username, title, postIds: selected }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['highlights', username] })
            showToast('Highlight added')
            onClose()
        },
        onError: () => showToast('Could not save the highlight.'),
    })

    const overlay = useRef()
    useDialog(overlay, { onClose })

    const toggle = (id) => setSelected(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id])

    const posts = postsQuery.data?.posts ?? []

    return createPortal(
        <div className={styles.overlay} ref={overlay} onClick={onClose}>
            <div className={styles.dialog} role="dialog" aria-modal="true" aria-label="New highlight" onClick={(e) => e.stopPropagation()}>
                <header className={styles.header}>
                    <h2>New highlight</h2>
                    <button className={styles.close} onClick={onClose} aria-label="Close">
                        <XIcon size="1em" aria-hidden="true" />
                    </button>
                </header>

                <div className={styles.body}>
                    <label className={styles.field}>
                        <span>Title</span>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Highlights"
                            maxLength={15}
                        />
                    </label>

                    <p className={styles.hint}>Choose the posts to include</p>

                    {postsQuery.isPending && <GridSkeleton columns={3} count={6} />}

                    {postsQuery.isError && (
                        <div className={styles.note}>
                            <p>Couldn't load your posts.</p>
                            <Button size="sm" onClick={() => postsQuery.refetch()}>Try again</Button>
                        </div>
                    )}

                    {postsQuery.isSuccess && posts.length === 0 && (
                        <p className={styles.note}>You need a post first. Use Create in the menu to share one.</p>
                    )}

                    <div className={styles.grid}>
                        {posts.map(post => {
                            const isSelected = selected.includes(post.id)
                            return (
                                <button
                                    key={post.id}
                                    className={`${styles.tile} ${isSelected ? styles.selected : ''}`}
                                    onClick={() => toggle(post.id)}
                                    aria-pressed={isSelected}
                                    aria-label={isSelected ? 'Remove post from highlight' : 'Add post to highlight'}
                                >
                                    <img src={post.image} alt="" loading="lazy" />
                                    {isSelected && <span className={styles.check}><CheckIcon size="1em" aria-hidden="true" /></span>}
                                </button>
                            )
                        })}
                    </div>
                </div>

                <footer className={styles.footer}>
                    <span>{selected.length} selected</span>
                    <Button
                        variant="primary"
                        onClick={() => createMutation.mutate()}
                        disabled={selected.length === 0 || createMutation.isPending}
                    >
                        {createMutation.isPending ? 'Saving...' : 'Add'}
                    </Button>
                </footer>
            </div>
        </div>,
        document.body
    )
}
