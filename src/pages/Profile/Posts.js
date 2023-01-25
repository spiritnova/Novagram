import styles from './Posts.module.css'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

import { faComment, faHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Posts(){

    const user = JSON.parse(localStorage.getItem('user'))

    const postsQuery = useQuery({
        queryKey: ["posts"],
        queryFn:() => fetch(`/posts/${user.username}`)
        .then(res => res.json()),
    })

    if (postsQuery.isLoading) return <div className={styles.loader}></div>
    if (postsQuery.isError) return <pre>{JSON.stringify(postsQuery.error)}</pre>

    if(postsQuery.isError){console.log(postsQuery.error)}
    console.log(postsQuery.data)

    return(
        <div>
            <div className={styles.cards}>
                {postsQuery.data.map(post => (
                    <Link to = "/profile">
                        <div key={post} className={styles.card}>
                            <img src={post.image} className={styles.test} alt="posts"></img>
                            <div className={styles.buttons}>
                                <FontAwesomeIcon icon={faHeart} className={styles.button}></FontAwesomeIcon>
                                <FontAwesomeIcon icon={faComment} className={styles.button}></FontAwesomeIcon>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}