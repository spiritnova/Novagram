import { ImagePlus, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import styles from './CreatePost.module.css'
import Button from './UI Kit/Button'
import { useToast } from '../context/ToastContext'
import useDialog from '../hooks/useDialog'
import { createPost } from '../mock/api'
import { resizeImage } from '../utils/image'

const CAPTION_LIMIT = 500

// Two steps in one dialog: choose a photo (click or drop), then add a caption and share
export default function CreatePost({ onClose }) {
    const [image, setImage] = useState(null) // { blob, preview }
    const [caption, setCaption] = useState('')
    const [dragging, setDragging] = useState(false)
    const [processing, setProcessing] = useState(false)

    const fileInput = useRef()
    const queryClient = useQueryClient()
    const showToast = useToast()
    const username = sessionStorage.getItem('username')

    const overlay = useRef()
    useDialog(overlay, { onClose })

    // free the preview's memory when it is replaced or the dialog closes
    useEffect(() => () => { if (image) URL.revokeObjectURL(image.preview) }, [image])

    const choose = async (file) => {
        if (!file) return
        if (!file.type.startsWith('image/')) {
            showToast('Please choose an image file.')
            return
        }

        setProcessing(true)
        try {
            const blob = await resizeImage(file)
            setImage({ blob, preview: URL.createObjectURL(blob) })
        } catch (error) {
            showToast(error.message)
        } finally {
            setProcessing(false)
        }
    }

    const shareMutation = useMutation({
        mutationFn: () => createPost({ username, caption, imageFile: image.blob }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] })
            queryClient.invalidateQueries({ queryKey: ['home'] })
            queryClient.invalidateQueries({ queryKey: ['explore-posts'] })
            queryClient.invalidateQueries({ queryKey: ['trending-tags'] })
            showToast('Post shared')
            onClose()
        },
        onError: () => showToast("Couldn't share your post. The demo's storage may be full."),
    })

    const drop = (e) => {
        e.preventDefault()
        setDragging(false)
        choose(e.dataTransfer.files?.[0])
    }

    return createPortal(
        <div className={styles.overlay} ref={overlay} onClick={onClose}>
            <div
                className={`${styles.dialog} ${image ? styles.wide : ''}`}
                role="dialog"
                aria-modal="true"
                aria-label="Create new post"
                onClick={(e) => e.stopPropagation()}
            >
                <header className={styles.header}>
                    {image
                        ? <Button variant="ghost" size="sm" onClick={() => setImage(null)}>Back</Button>
                        : <span />}
                    <h2>Create new post</h2>
                    {image
                        ? <Button variant="primary" size="sm" onClick={() => shareMutation.mutate()} disabled={shareMutation.isPending}>
                            {shareMutation.isPending ? 'Sharing...' : 'Share'}
                        </Button>
                        : <button className={styles.close} onClick={onClose} aria-label="Close"><X size={20} /></button>}
                </header>

                {!image ? (
                    <div
                        className={`${styles.drop} ${dragging ? styles.dragging : ''}`}
                        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={drop}
                    >
                        <ImagePlus size={56} strokeWidth={1.25} aria-hidden="true" />
                        <p>{processing ? 'Preparing your photo...' : 'Drag a photo here'}</p>
                        <Button variant="primary" onClick={() => fileInput.current.click()} disabled={processing}>
                            Select from computer
                        </Button>
                        <input
                            ref={fileInput}
                            type="file"
                            accept="image/*"
                            className={styles.hiddenInput}
                            tabIndex={-1}
                            aria-label="Choose a photo"
                            onChange={(e) => { choose(e.target.files?.[0]); e.target.value = '' }}
                        />
                    </div>
                ) : (
                    <div className={styles.compose}>
                        <div className={styles.preview}>
                            <img src={image.preview} alt="Preview of your post" />
                        </div>
                        <div className={styles.details}>
                            <label htmlFor="new-post-caption">Caption</label>
                            <textarea
                                id="new-post-caption"
                                value={caption}
                                onChange={(e) => setCaption(e.target.value.slice(0, CAPTION_LIMIT))}
                                placeholder="Write a caption... use #hashtags and @mentions"
                                autoFocus
                            />
                            <span className={styles.counter}>{caption.length}/{CAPTION_LIMIT}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>,
        document.body
    )
}
