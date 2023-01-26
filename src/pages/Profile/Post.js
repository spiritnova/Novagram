import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import styles from './Post.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import Wrapper from '../../components/UI Kit/Wrapper'

export default function Post(props){

    const { id } = useParams()
    const user = JSON.parse(localStorage.getItem('user'))


    const postQuery = useQuery({
        queryKey: ["posts", id],
        queryFn: () => fetch(`/posts/${user.username}/${id}`)
        .then(res => res.json()),
    })

    if(postQuery.isLoading) return <div className={styles.loader}></div>
    if(postQuery.isError) return <pre>{JSON.stringify(postQuery.error)}</pre>

    return(
        <Wrapper>
            <div className={styles.backdrop}>
                <div className={styles['modal-close']}>
                    <button onClick={props.onClose}>
                        <FontAwesomeIcon icon={faXmark}/>
                    </button>
                </div>
            </div>
            <div className={styles.modal}>
                <div className={styles['modal-img']}>
                    <img src={postQuery.data.data.image} alt="postImage"/>
                </div>
                <div className={styles['modal-details']}>
                    <div className={styles['modal-details-control']}>
                        {/* <img></img> */}
                        <p>{user.username}</p>
                        {/* <button></button> */}
                    </div>
                    <div className={styles['modal-details-comments']}>
                        <h3>No Comments yet</h3>
                        <p>Start the conversation</p>
                    </div>
                    <div className={styles['modal-details-reactions']}></div>
                    <div className={styles['modal-details-post']}></div>
                </div>
            </div>
        </Wrapper>
    )
}