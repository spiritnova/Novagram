import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { GridSkeleton } from '../../components/UI Kit/Skeleton'
import { getSavedPosts } from '../../mock/api'
import Post from './Post'
import styles from './Saved.module.css'

export default function Saved(){
    const darkTheme = useTheme()
    const location = useLocation()
    const [postId, setPostId] = useState()

    const username = sessionStorage.getItem('username')

    const savedQuery = useQuery({
        queryKey: ["saved", username],
        queryFn: () => getSavedPosts(username),
    })

    if(savedQuery.isPending) return <GridSkeleton />

    return(
        <div className={styles.wrapper}>
            {savedQuery.data?.count === 0
            ? <p className={styles.empty}>Nothing saved yet. Tap the bookmark on any post to keep it here.</p>
            : <div className={styles.cards}>
                {savedQuery.data.posts.map(post => (
                    <button key={post.id} className={`${darkTheme ? styles.card : styles['card-light']} ${styles.tile}`} onClick={() => setPostId(post.id)}>
                        <img src={post.image} alt="Saved post" loading="lazy" />
                    </button>
                ))}
            </div>}

            {postId && <Post
                onClose={() => setPostId(undefined)}
                realRoute={location.pathname}
                pseudoRoute={`/post/${postId}`}
            />}
        </div>
    )
}
