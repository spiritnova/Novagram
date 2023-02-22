import styles from './Posts.module.css'
import { useQuery } from '@tanstack/react-query'
import { Link, useLocation, useNavigate, useOutletContext, useParams } from 'react-router-dom'

import { faComment, faHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'

import Post from './Post'
import Wrapper from '../../components/UI Kit/Wrapper'
import Loader from '../../components/UI Kit/Loader'

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
        queryFn:() => fetch(`/${user.username}`)
        .then(res => res.json()),
    })

    useEffect(() => {
        setPostCount(postsQuery.data?.count) // This gets the posts count from backend and sends it to profile through context
    }, [postsQuery, setPostCount])

    if (postsQuery.isError) {
        console.log("error")
        navigate("/404")
        return <pre>{JSON.stringify(postsQuery.error)}</pre>
    } 

    if(postsQuery.isLoading) return
          
    return(
        <Wrapper>
            {postsQuery.data.count === 0 
            ? <div className={styles.noPosts}>No posts yet</div> 
            :
            <div className={styles.cards}>
                {postsQuery.data.posts.map(post => (
                    <Link key={post.id} onClick={
                        () => {
                            setShowModal(true)
                            setPostId(post.id)
                        }
                        }>
                        <div className={styles.card}>
                            <img src={post.image} className={styles.test} alt="posts"/>
                            <div className={styles.buttons}>
                                <FontAwesomeIcon icon={faHeart} className={styles.button}></FontAwesomeIcon>
                                <FontAwesomeIcon icon={faComment} className={styles.button}></FontAwesomeIcon>
                            </div>
                        </div>
                    </Link>
                ))}
                {postsQuery.isLoading && <div className={styles.loader}><Loader type={'1'}/></div>}
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