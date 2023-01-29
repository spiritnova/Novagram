import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import styles from './Post.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark, faComment, faEllipsis, faHeart, faXmark } from '@fortawesome/free-solid-svg-icons'
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
                        <div className={styles['modal-pfp']}>
                            {/* <img></img> */}
                        </div>
                        <p>{user.username}</p>
                        <button className={styles['modal-comment-like']}>
                            <FontAwesomeIcon icon={faEllipsis}/>
                        </button>
                    </div>
                    <div className={styles['modal-details-comments']}>
                        <div className={styles['modal-comment']}>
                            <div className={styles['modal-pfp']}></div>
                            <div className={styles['modal-comment-container']}>
                                <div className={styles['modal-comment-details']}>
                                    <p className={styles['modal-comment-user']}>{user.username}</p>
                                    <p className={styles['modal-comment-content']}>{postQuery.data.data.caption}</p>
                                </div>
                                <div className={styles['modal-comment-date']}>
                                    {postQuery.data.data.date}
                                </div>
                            </div>
                        </div>
                        <div className={styles['modal-comment']}>
                            <div className={styles['modal-pfp']}></div>
                            <div className={styles['modal-comment-container']}>
                                <div className={styles['modal-comment-details']}>
                                    <p className={styles['modal-comment-user']}>lemon_maho</p>
                                    <p className={styles['modal-comment-content']}>the comment</p>
                                    <button className={styles['modal-comment-like']}>
                                        <FontAwesomeIcon icon={faHeart}/>
                                    </button>
                                </div>
                                <div className={styles['modal-comment-date']}>
                                    2 days ago
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles['modal-details-reactions']}>
                        <div className={styles.icons}>
                            <div className={styles['icons-left']}>
                                <button className={styles.icon}>
                                    <FontAwesomeIcon icon={faHeart}/>
                                </button>
                                <button className={styles.icon}>
                                    <FontAwesomeIcon icon={faComment}/>
                                </button>
                            </div>
                            <div className={styles['icons-right']}>
                                <button className={styles.icon}>
                                    <FontAwesomeIcon icon={faBookmark}/>
                                </button>
                            </div>
                        </div>
                        <div></div>
                        <div className={styles['modal-post-date']}><p>{postQuery.data.data.date}</p></div>
                    </div>
                    <div className={styles['modal-details-post']}>
                        <div>
                            <textarea type="text" placeholder='Add a comment...'/>
                        </div>
                        <div>
                            <button>Post</button>
                        </div>
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}