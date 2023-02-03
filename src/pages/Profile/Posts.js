import styles from './Posts.module.css'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'

import { faComment, faHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'

import Post from './Post'
import Wrapper from '../../components/UI Kit/Wrapper'

export default function Posts(){
    const [showModal, setShowModal] = useState(false)


    if (showModal){
        document.body.style.overflow = "hidden"
    }

    else{
        document.body.style.overflow ="auto"
    }

    const username = sessionStorage.getItem('username')

    const user = useParams()

    const postsQuery = useQuery({
        queryKey: ["posts"],
        queryFn:() => fetch(`/posts/${user.username}`)
        .then(res => res.json()),
    })


    if (postsQuery.isLoading) return <div className={styles.loader}></div>
    if (postsQuery.isError) return <pre>{JSON.stringify(postsQuery.error)}</pre>



    const postViewHandler = () => {
        setShowModal(true)
    }

    const handleClose = () => {
        setShowModal(false)
    }


    return(
        <Wrapper>
            {postsQuery.data.length === 0 ? <div className={styles.noPosts}>No posts yet</div> :
            <div className={styles.cards}>
                {postsQuery.data.map(post => (
                    <Link key={post.id} to ={`/profile/${user.username}/${post.id}`} onClick={postViewHandler}>
                        <div className={styles.card}>
                            <img src={post.image} className={styles.test} alt="posts"></img>
                            <div className={styles.buttons}>
                                <FontAwesomeIcon icon={faHeart} className={styles.button}></FontAwesomeIcon>
                                <FontAwesomeIcon icon={faComment} className={styles.button}></FontAwesomeIcon>
                            </div>
                        </div>
                    </Link>
                ))}
                {showModal && <Post onClose={handleClose}/>}
            </div>}
        </Wrapper>
    )
}