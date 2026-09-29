import { Plus as PlusIcon } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import styles from './Highlights.module.css'
import NewHighlight from './NewHighlight'
import StoryViewer from './StoryViewer'
import { Skeleton } from './UI Kit/Skeleton'
import ScrollRow from './UI Kit/ScrollRow'
import { useToast } from '../context/ToastContext'
import { deleteHighlight, getHighlights } from '../mock/api'

// The row of saved highlights under a profile's bio. On your own profile there is also a "New" button.
export default function Highlights({ username, picture, isOwn }) {
    const [viewing, setViewing] = useState(null)
    const [creating, setCreating] = useState(false)

    const queryClient = useQueryClient()
    const showToast = useToast()

    const highlightsQuery = useQuery({
        queryKey: ['highlights', username],
        queryFn: () => getHighlights(username),
    })

    const deleteMutation = useMutation({
        mutationFn: (id) => deleteHighlight(username, id),
        onSuccess: () => {
            setViewing(null)
            queryClient.invalidateQueries({ queryKey: ['highlights', username] })
            showToast('Highlight deleted')
        },
        onError: () => showToast('Could not delete the highlight.'),
    })

    const highlights = highlightsQuery.data ?? []

    if (highlightsQuery.isPending) {
        return (
            <div className={styles.row} role="status" aria-label="Loading highlights">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className={styles.item}>
                        <Skeleton className={styles.circle} />
                        <Skeleton style={{ width: '3.5rem', height: '0.7rem' }} />
                    </div>
                ))}
            </div>
        )
    }

    if (!isOwn && highlights.length === 0) return null

    const stories = highlights.map(h => ({ username, picture, title: h.title, slides: h.slides }))

    return (
        <>
            <ScrollRow className={styles.row} aria-label="Highlights">
                {highlights.map((h, index) => (
                    <li key={h.id}>
                        <button className={styles.item} onClick={() => setViewing(index)}>
                            <span className={styles.circle}>
                                <img src={h.cover} alt="" loading="lazy" />
                            </span>
                            <span className={styles.label}>{h.title}</span>
                        </button>
                    </li>
                ))}

                {isOwn && (
                    <li>
                        <button className={styles.item} onClick={() => setCreating(true)}>
                            <span className={`${styles.circle} ${styles.add}`}>
                                <PlusIcon size="1em" aria-hidden="true" />
                            </span>
                            <span className={styles.label}>New</span>
                        </button>
                    </li>
                )}
            </ScrollRow>

            {viewing !== null && (
                <StoryViewer
                    stories={[stories[viewing]]}
                    startIndex={0}
                    onClose={() => setViewing(null)}
                    onDelete={isOwn ? () => deleteMutation.mutate(highlights[viewing].id) : undefined}
                />
            )}

            {creating && <NewHighlight username={username} onClose={() => setCreating(false)} />}
        </>
    )
}
