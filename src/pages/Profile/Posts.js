import styles from './Posts.module.css'
import { useQuery } from '@tanstack/react-query'
import { useOutletContext } from 'react-router-dom'

export default function Posts(){

    const user = JSON.parse(localStorage.getItem('user'))

    const postsQuery = useQuery({
        queryKey: ["posts"],
        queryFn:() => fetch(`/posts/${user.username}`)
        .then(res => res.json()),
    })

    if (postsQuery.isLoading) return <h1>Loading...</h1>
    if (postsQuery.isError) return <pre>{JSON.stringify(postsQuery.error)}</pre>

    //     setPostCount(prevState => prevState + 1)
    // });

    return(
        <div>
            <div className={styles.cards}>
                {postsQuery.data.map(post => (
                    <div key={post} className={styles.card}>
                        <img src={post} alt="posts"></img>
                    </div>
                ))}
            </div>
        </div>
    )
}