import styles from './Posts.module.css'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useData } from '../../context/user-context'

export default function Posts(){
    const data = useData()

    const postsQuery = useQuery({
        queryKey: ["posts"],
        queryFn:() => fetch(`/posts/${data.userData.username}`)
        .then(res => res.json()),
    })

    if (postsQuery.isLoading) return <h1>Loading...</h1>
    if (postsQuery.isError) return <pre>{JSON.stringify(postsQuery.error)}</pre>
    return(
        <div>
            <div className={styles.cards}>
                {postsQuery.data.map(post => (
                    <div className={styles.card}>
                        <img src={post}></img>
                    </div>
                ))}
            </div>
        </div>
    )
}