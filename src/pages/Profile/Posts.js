import styles from './Posts.module.css'
import { useQuery } from '@tanstack/react-query'
import { Link, useOutletContext, useParams } from 'react-router-dom'

import { faComment, faHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'

import Post from './Post'
import Wrapper from '../../components/UI Kit/Wrapper'

export default function Posts(){
    const [showModal, setShowModal] = useState(false)

    const  setPostCount  = useOutletContext()

    if (showModal){
        document.body.style.overflow = "hidden"
    }

    else{
        document.body.style.overflow ="auto"
    }

    const user = useParams()

    const postsQuery = useQuery({
        queryKey: ["posts"],
        queryFn:() => fetch(`/posts/${user.username}`)
        .then(res => res.json()),
    })

    useEffect(() => {
        setPostCount(postsQuery.data?.count) // This gets the posts count from backend and sends it to profile through context
    }, [postsQuery, setPostCount])


    if (postsQuery.isLoading) return <div className={styles.loader}></div>
    if (postsQuery.isError) return <pre>{JSON.stringify(postsQuery.error)}</pre>

    return(
        <Wrapper>
            {postsQuery.data.count === 0 ? <div className={styles.noPosts}>No posts yet</div> :
            <div className={styles.cards}>
                {postsQuery.data.posts.map(post => (
                    <Link key={post.id} to ={`/profile/${user.username}/${post.id}`} onClick={() => setShowModal(true)}>
                        <div className={styles.card}>
                            <img src={post.image} className={styles.test} alt="posts"/>
                            <div className={styles.buttons}>
                                <FontAwesomeIcon icon={faHeart} className={styles.button}></FontAwesomeIcon>
                                <FontAwesomeIcon icon={faComment} className={styles.button}></FontAwesomeIcon>
                            </div>
                        </div>
                    </Link>
                ))}
                {showModal && <Post onClose={() => setShowModal(false)}/>}
            </div>}
        </Wrapper>
    )
}