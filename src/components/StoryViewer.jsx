import { Trash2 as Trash2Icon, X as XIcon } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import styles from './StoryViewer.module.css'
import useDialog from '../hooks/useDialog'

// onSeen: called when a user's story is reached. onDelete: shown for highlights you own.
export default function StoryViewer({ stories, startIndex, onSeen, onClose, onDelete }) {
    const [userIndex, setUserIndex] = useState(startIndex)
    const [slideIndex, setSlideIndex] = useState(0)
    const [confirmingDelete, setConfirmingDelete] = useState(false)

    const story = stories[userIndex]

    const next = useCallback(() => {
        if (slideIndex < story.slides.length - 1) {
            setSlideIndex(slideIndex + 1)
        } else if (userIndex < stories.length - 1) {
            onSeen?.(stories[userIndex + 1].username)
            setUserIndex(userIndex + 1)
            setSlideIndex(0)
        } else {
            onClose()
        }
    }, [slideIndex, userIndex, story, stories, onSeen, onClose])

    const previous = useCallback(() => {
        if (slideIndex > 0) {
            setSlideIndex(slideIndex - 1)
        } else if (userIndex > 0) {
            setUserIndex(userIndex - 1)
            setSlideIndex(0)
        }
    }, [slideIndex, userIndex])

    const overlay = useRef()
    useDialog(overlay, { onClose })

    useEffect(() => {
        const keyHandler = (e) => {
            if (e.key === 'ArrowRight') next()
            if (e.key === 'ArrowLeft') previous()
        }
        document.addEventListener('keydown', keyHandler)
        return () => document.removeEventListener('keydown', keyHandler)
    }, [next, previous])

    return createPortal(
        <div className={styles.overlay} ref={overlay} role="dialog" aria-modal="true" aria-label={`${story.title ?? story.username}'s story`} onClick={onClose}>
            <div className={styles.viewer} onClick={(e) => e.stopPropagation()}>
                <div className={styles.progress}>
                    {story.slides.map((slide, i) => (
                        <div key={slide.id} className={styles.track}>
                            <div
                                className={`${styles.bar} ${i < slideIndex ? styles.done : ''} ${i === slideIndex ? styles.active : ''}`}
                                onAnimationEnd={i === slideIndex ? next : undefined}
                            />
                        </div>
                    ))}
                </div>

                <div className={styles.header}>
                    <span className={styles.avatar}>
                        {story.picture
                            ? <img src={story.picture} alt="" />
                            : story.username.charAt(0).toUpperCase()}
                    </span>
                    <span className={styles.name}>{story.title ?? story.username}</span>
                    {onDelete && (confirmingDelete
                        ? <button className={`${styles.deleteButton} ${styles.confirm}`} onClick={onDelete}>Delete highlight?</button>
                        : <button className={styles.deleteButton} onClick={() => setConfirmingDelete(true)} aria-label="Delete highlight">
                            <Trash2Icon size="1em" aria-hidden="true" />
                        </button>)}
                    <button className={styles.close} onClick={onClose} aria-label="Close story">
                        <XIcon size="1em" aria-hidden="true" />
                    </button>
                </div>

                <img
                    key={story.slides[slideIndex].id}
                    className={styles.image}
                    src={story.slides[slideIndex].image}
                    alt={`${story.username}'s story, slide ${slideIndex + 1}`}
                    draggable="false"
                />

                <button className={`${styles.zone} ${styles.left}`} onClick={previous} aria-label="Previous" />
                <button className={`${styles.zone} ${styles.right}`} onClick={next} aria-label="Next" />
            </div>
        </div>,
        document.body
    )
}
