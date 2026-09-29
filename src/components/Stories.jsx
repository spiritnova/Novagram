import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import styles from './Stories.module.css'
import StoryViewer from './StoryViewer'
import ScrollRow from './UI Kit/ScrollRow'
import { StoriesSkeleton } from './UI Kit/Skeleton'
import { getStories } from '../mock/api'

const SEEN_KEY = 'novagram_seen_stories'

function loadSeen() {
    try {
        return JSON.parse(localStorage.getItem(SEEN_KEY)) ?? {}
    } catch {
        return {}
    }
}

function saveSeen(seen) {
    try {
        localStorage.setItem(SEEN_KEY, JSON.stringify(seen))
    } catch {
        // storage unavailable, seen state just won't persist
    }
}

export default function Stories({ username, darkTheme }) {
    const [activeIndex, setActiveIndex] = useState(null)
    const [seen, setSeen] = useState(loadSeen)

    const storiesQuery = useQuery({
        queryKey: ['stories', username],
        queryFn: () => getStories(username),
    })

    if (storiesQuery.isPending) return <StoriesSkeleton />

    const stories = storiesQuery.data ?? []
    if (stories.length === 0) return null

    const markSeen = (user) => {
        setSeen(prev => {
            if (prev[user]) return prev
            const next = { ...prev, [user]: true }
            saveSeen(next)
            return next
        })
    }

    const open = (index) => {
        markSeen(stories[index].username)
        setActiveIndex(index)
    }

    // Unseen stories first, keeping your own story pinned to the front
    const order = stories
        .map((story, index) => ({ story, index }))
        .sort((a, b) => {
            if (a.index === 0 || b.index === 0) return a.index === 0 ? -1 : 1
            return Number(!!seen[a.story.username]) - Number(!!seen[b.story.username])
        })

    return (
        <>
            <ScrollRow className={`${styles.stories} ${darkTheme ? '' : styles.light}`} aria-label="Stories">
                {order.map(({ story, index }) => (
                    <li key={story.username}>
                        <button className={styles.story} onClick={() => open(index)}>
                            <span className={`${styles.ring} ${seen[story.username] ? styles.seen : ''}`}>
                                <span className={styles.avatar}>
                                    {story.picture
                                        ? <img src={story.picture} alt="" />
                                        : story.username.charAt(0).toUpperCase()}
                                </span>
                            </span>
                            <span className={styles.name}>{index === 0 ? 'Your story' : story.username}</span>
                        </button>
                    </li>
                ))}
            </ScrollRow>

            {activeIndex !== null && (
                <StoryViewer
                    stories={stories}
                    startIndex={activeIndex}
                    onSeen={markSeen}
                    onClose={() => setActiveIndex(null)}
                />
            )}
        </>
    )
}
