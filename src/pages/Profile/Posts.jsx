import styles from './Posts.module.css'
import { useQuery } from '@tanstack/react-query'
import { useLocation, useNavigate, useOutletContext, useParams } from 'react-router-dom'

import { Heart, MessageCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

import Post from './Post'
import Wrapper from '../../components/UI Kit/Wrapper'
import { GridSkeleton } from '../../components/UI Kit/Skeleton'
import { getUserPosts } from '../../mock/api'

export default function Posts(){
    const [showModal, setShowModal] = useState(false)
    const [postId, setPostId] = useState()

    const  setPostCount  = useOutletContext()

    const location = useLocation()

    const navigate = useNavigate()

    if (showModal){
        document.body.style.overflow = "hidden"
    }

    else{
        document.body.style.overflow ="auto"
    }

    const user = useParams()

    const postsQuery = useQuery({
        queryKey: ["posts", user.username],
        queryFn:() => getUserPosts(user.username),
    })

    useEffect(() => {
        setPostCount(postsQuery.data?.count) // This gets the posts count from backend and sends it to profile through context
    }, [postsQuery, setPostCount])

    useEffect(() => {
        if(postsQuery.isError){
            navigate("/404")
            console.log(postsQuery.error)
        }
    }, [postsQuery.isError, postsQuery.error, navigate])

    if(postsQuery.isLoading) return <GridSkeleton />
          
    return(
        <Wrapper>
            {postsQuery.data.count === 0 
            ? <div className={styles.noPosts}>No posts yet</div> 
            :
            <div className={styles.cards}>
                {postsQuery.data.posts.map(post => (
                    <button
                        key={post.id}
                        type="button"
                        className={styles.card}
                        aria-label={`Open post, ${post.likes} like${post.likes === 1 ? '' : 's'}, ${post.comments} comment${post.comments === 1 ? '' : 's'}`}
                        onClick={() => {
                            setShowModal(true)
                            setPostId(post.id)
                        }}
                    >
                            <img src={post.image} className={styles.test} alt=""/>
                            <div className={styles.buttons}>
                                <span><Heart size={20} fill="currentColor" aria-hidden="true" />{post.likes}</span>
                                <span><MessageCircle size={20} fill="currentColor" aria-hidden="true" />{post.comments}</span>
                            </div>
                    </button>
                ))}
                {showModal && 
                <Post 
                    onClose={() => setShowModal(false)}
                    showModal={showModal}
                    realRoute={location.pathname}
                    pseudoRoute={`/post/${postId}`}
                />}
            </div>}
        </Wrapper>
    )
}